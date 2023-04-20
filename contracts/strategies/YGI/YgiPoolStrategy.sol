pragma solidity ^0.8.0;

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin-4/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin-4/contracts/token/ERC20/utils/SafeERC20.sol";
import "../Common/StratFeeManager.sol";
import "../../utils/GasFeeThrottler.sol";
import "../../utils/Manager.sol";
import "../utils/UniswapV3Utils.sol";
import "../Common/Stoppable.sol";
import "../Common/UniSwapRoutes.sol";
import "../../interfaces/hop/IHopTokenTracker.sol";
import "../../interfaces/hop/IHopRewardPool.sol";
import "../../interfaces/strategy/ITokenStrategy.sol";

contract YgiPoolStrategy is Manager, UniSwapRoutes, GasFeeThrottler, Stoppable {
    using SafeERC20 for IERC20;

    address public vault;
    address public inputToken;
    address public uniRouter;

    struct YgiComponent {
        string name;
        address inputToken;
        ITokenStrategy strategy;
        uint256 allocation;
        Route route;
    }

    uint256 totalAllocation;

    YgiComponent[] public ygiComponents;
    uint256 DIVISOR;
    uint256 public lastPoolDepositTime;

    event Deposit(uint256 deposited, uint256 amountToMint);
    event Withdraw(uint256 withdrawRatio, uint256 withdrawAmount);

    constructor(
        address _vault,
        address _unirouter
    ) {
        vault = _vault;
        DIVISOR = 10 ** ERC20(inputToken).decimals();
        _giveAllowances();
    }

    // TODO: Handle vaults with ETH as input (inputToken = address(0))
    function registerYgiComponent(
        string calldata name,
        address inputToken,
        address strategyAddress,
        uint24 allocation,
        Route route
    ) public onlyOwner {
        // todo: rebalance here
        YgiComponent memory ygiComponent = YgiComponent(
            name,
            inputToken,
            ITokenStrategy(strategyAddress),
            allocation,
            route
        );
        totalAllocation += allocation;
        unirouter = _unirouter;
        ygiComponents.push(ygiComponent);
        _giveAllowance(uniRouter, inputToken);
    }

    function deregisterYgiComponent(
        string calldata name
    ) public onlyOwner {
        for (uint i = 0; i < ygiComponents.length; i++) {
            if (keccak256(abi.encodePacked(ygiComponents[i].name)) == keccak256(abi.encodePacked(name))) {
                totalAllocation -= ygiComponents[i].allocation;
                sunsetStrategy(ygiComponents[i].strategy);
                ygiComponents[i] = ygiComponents[ygiComponents.length - 1];
                ygiComponents.pop();
                break;
            }
        }
    }

    /**
     * @dev The entrypoint of funds into the system. People deposit with this function
     * into the vault. The vault is then in charge of sending funds into the strategy.
     */
    function deposit(uint _totalAmount) external nonReentrant whenNotStopped returns (uint256) {
        uint256 memory amountToMint = 0;
        for (uint i = 0; i < ygiComponents.length; i++) {
            uint256 allocation = ygiComponents[i].allocation;
            uint256 amount = (_totalAmount * (allocation * 10 ** MULTIPLIER / totalAllocation())) / 10 ** MULTIPLIER;
            uint amountReceived = swapTokens(amount, ygiComponents[i].route);
            if (amountReceived > 0) {
                amountToMint += amountReceived;
                IERC20(ygiComponents[i].inputToken).transfer(ygiComponents[i].strategy, amountReceived);
                ygiComponents[i].strategy.deposit();
            }
        }
        emit Deposit(_totalAmount, amountToMint);
        return amountToMint;
    }

    function swapTokens(uint256 amount, Route calldata route) internal returns (uint256) {
        if (route.path.length == 0) {
            return amount;
        }
        if (amount > 0) {
            return UniswapV3Utils.swap(uniRouter, route.path, amount);
        }
        return 0;
    }

    function _giveAllowance(address spender, address token) internal {
        IERC20Upgradeable(token).safeApprove(spender, type(uint).max);
    }

    /**
     * @dev Function to exit the system. The vault will withdraw the required tokens
     * from the strategy and pay up the token holder. A proportional number of IOU
     * tokens are burned in the process.
     */
    function withdraw(uint256 _ratio, bool skipOnWithdrawFail) external {
        require(msg.sender == vault, "!vault");
        uint256 withdrawnAmount = 0;
        for (uint i = 0; i < ygiComponents.length; i++) {
            YgiComponent memory ygiComponent = ygiComponents[i];
            ITokenStrategy strategy = ygiComponent.strategy;
            uint256 amountToWithdraw = normalizeAmount(strategy.balance() * _ratio / DIVISOR, strategy.decimals());
            try strategy.withdraw(amountToWithdraw) returns (bool success) {
                success = true;
            } catch {
                if (!skipOnWithdrawFail) {
                    revert("Withdrawal failed");
                } else {
                    emit WithdrawFailureSkipped();
                }
            }
            uint256 wantBal = strategy.want().balanceOf(address(this));
            if (wantBal > 0) {
                withdrawnAmount += swapToInputToken(wantBal, ygiComponent);
            }
        }

        inputToken().safeTransfer(vault, withdrawnAmount);
        emit Withdraw(_ratio, withdrawnAmount);
    }

    function normalizeAmount(uint256 amount, uint256 decimals) internal pure returns (uint256) {
        uint256 inputDecimals = ERC20(inputToken).decimals();
        if (decimals > inputDecimals) {
            return amount / (10 ** (decimals - inputDecimals));
        }
        return amount * (10 ** (inputDecimals - decimals));
    }

    // calculate the total underlying 'wantToken' held by the strat.
    function balanceOf() public view returns (uint256) {
        return balanceOfWant() + balanceOfPool();
    }

    // it calculates how much 'wantToken' this contract holds.
    function balanceOfWant() public view returns (uint256) {
        return IERC20(lpToken).balanceOf(address(this));
    }

    // it calculates how much 'wantToken' the strategy has working in the farm.
    function balanceOfPool() public view returns (uint256) {
        return IHopRewardPool(pool).balanceOf(address(this));
    }

    function setUniRouter(address _uniRouter) public onlyOwner {
        uniRouter = _uniRouter;
    }

    function panic() public onlyOwner {
        stop();
        // todo: exit all strats
    }

    // todo: function for wayward tokens

    function stop() public onlyOwner {
        _stop();
        _removeAllowances();
    }

    function resume() public onlyOwner {
        _resume();
        _giveAllowances();
        deposit();
    }

    function _giveAllowances() internal {
        IERC20(lpToken).safeApprove(pool, type(uint).max);
        IERC20(lpToken).safeApprove(tracker, type(uint).max);
        IERC20(inputToken).safeApprove(tracker, type(uint).max);
        IERC20(hopToken).safeApprove(tracker, type(uint).max);
    }

    function _removeAllowances() internal {
        IERC20(lpToken).safeApprove(pool, 0);
        IERC20(lpToken).safeApprove(tracker, 0);
        IERC20(inputToken).safeApprove(tracker, 0);
        IERC20(hopToken).safeApprove(tracker, 0);
    }
}
