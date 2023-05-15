pragma solidity ^0.8.0;

// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../../utils/UniswapV3Utils.sol";
import "../../interfaces/strategy/ITokenStrategy.sol";
import "../../interfaces/vaults/IRldVault.sol";
import "../Common/Stoppable.sol";

contract YgiPoolStrategy is Ownable, Stoppable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    uint8 constant MULTIPLIER = 18;

    address public inputToken;
    address public uniRouter;

    struct Route {
        address[] aToBRoute;
        uint24[] aToBFees;
        bytes path;
    }

    struct YgiComponent {
        string name;
        address inputToken;
        IRldVault vault;
        uint256 allocation;
        Route route;
        Route backRoute;
    }

    uint256 totalAllocation;

    YgiComponent[] public ygiComponents;
    uint256 DIVISOR;
    uint256 public lastPoolDepositTime;
    mapping(address => mapping(address => uint256)) public userToVaultToAmount;

    event Deposit(uint256 deposited);
    event Withdraw(uint256 withdrawRatio, uint256 withdrawAmount);
    event WithdrawFailureSkipped();

    constructor(
        address _inputToken,
        address _uniRouter
    ) {
        uniRouter = _uniRouter;
        inputToken = _inputToken;
        DIVISOR = 10 ** ERC20(_inputToken).decimals();
    }

    // todo: rebalance

    // TODO: Handle vaults with ETH as input (inputToken = address(0))
    function registerYgiComponent(
        string calldata name,
        address _inputToken,
        address vaultAddress,
        uint256 allocation,
        address[] memory _route,
        uint24[] memory _fee,
        address[] memory _backRoute,
        uint24[] memory _backFee
    ) public onlyOwner {
        Route memory route = Route(_route, _fee, UniswapV3Utils.routeToPath(_route, _fee));
        Route memory backRoute = Route(_backRoute, _backFee, UniswapV3Utils.routeToPath(_backRoute, _backFee));
        YgiComponent memory ygiComponent = YgiComponent(
            name,
            _inputToken,
            IRldVault(vaultAddress),
            allocation,
            route,
            backRoute
        );
        totalAllocation += allocation;
        ygiComponents.push(ygiComponent);
        _giveAllowance(uniRouter, _route[0]);
        _giveAllowance(uniRouter, _backRoute[0]);
        _giveAllowance(uniRouter, _inputToken);
        _giveAllowance(vaultAddress, _inputToken);
    }

    function deregisterYgiComponent(
        string calldata name,
        bool skipOnFail
    ) public onlyOwner {
        for (uint i = 0; i < ygiComponents.length; i++) {
            if (keccak256(abi.encodePacked(ygiComponents[i].name)) == keccak256(abi.encodePacked(name))) {
                totalAllocation -= ygiComponents[i].allocation;
                sunsetStrategy(ygiComponents[i], skipOnFail);
                ygiComponents[i] = ygiComponents[ygiComponents.length - 1];
                ygiComponents.pop();
                break;
            }
        }
    }

    function sunsetStrategy(YgiComponent memory component, bool skipOnFail) internal {
        IRldVault vault = component.vault;
        uint256 balance = vault.balanceOf(address(this));

        try vault.withdraw(balance) {
            swapTokens(ERC20(component.inputToken).balanceOf(address(this)), component.backRoute);
        } catch {
            if (!skipOnFail) {
                revert("WithdrawAll failed");
            }
        }
    }

    /**
     * @dev The entrypoint of funds into the system. People deposit with this function
     * into the vault. The vault is then in charge of sending funds into the strategy.
     */
    function deposit(uint _totalAmount) public nonReentrant whenNotStopped {
        IERC20(inputToken).safeTransferFrom(msg.sender, address(this), _totalAmount);
        for (uint i = 0; i < ygiComponents.length; i++) {
            uint256 allocation = ygiComponents[i].allocation;
            uint256 amount = (_totalAmount * (allocation * 10 ** MULTIPLIER / totalAllocation)) / 10 ** MULTIPLIER;
            uint amountReceived = swapTokens(amount, ygiComponents[i].route);
            if (amountReceived > 0) {
                uint256 vaultBalanceBefore = ygiComponents[i].vault.balanceOf(address(this));
                ygiComponents[i].vault.deposit(amountReceived);
                uint256 vaultBalanceAfter = ygiComponents[i].vault.balanceOf(address(this));
                userToVaultToAmount[msg.sender][address(ygiComponents[i].vault)] += vaultBalanceAfter - vaultBalanceBefore;
            }
        }
        emit Deposit(_totalAmount);
    }

    function swapTokens(uint256 amount, Route memory route) internal returns (uint256) {
        if (route.path.length == 0) {
            return amount;
        }
        if (amount > 0) {
            return UniswapV3Utils.swap(uniRouter, route.path, amount);
        }
        return 0;
    }

    function _giveAllowance(address spender, address token) internal {
        if (IERC20(token).allowance(address(this), spender) < type(uint).max) {
            IERC20(token).safeApprove(spender, type(uint).max);
        }
    }

    /**
     * @dev Function to exit the system. The vault will withdraw the required tokens
     * from the strategy and pay up the token holder. A proportional number of IOU
     * tokens are burned in the process.
     */
    function withdraw(uint256 _ratio, bool skipOnWithdrawFail) external nonReentrant {
        require(_ratio <= DIVISOR, "Ratio too high");
        uint256 withdrawnTotalAmount = 0;
        for (uint i = 0; i < ygiComponents.length; i++) {
            IRldVault vault = ygiComponents[i].vault;
            uint256 balance = userToVaultToAmount[msg.sender][address(vault)];
//            uint256 amountToWithdraw = normalizeAmount(balance * _ratio / DIVISOR, vault.decimals());
            uint256 amountToWithdraw = balance * _ratio / DIVISOR;

            uint256 vaultBalanceBefore = ygiComponents[i].vault.balanceOf(address(this));
            //todo check this again: seeems insecure??
            try vault.withdraw(amountToWithdraw){
                uint256 vaultBalanceAfter = ygiComponents[i].vault.balanceOf(address(this));
                userToVaultToAmount[msg.sender][address(ygiComponents[i].vault)] -= vaultBalanceBefore - vaultBalanceAfter;
            } catch {
                if (!skipOnWithdrawFail) {
                    revert("Withdrawal failed");
                } else {
                    emit WithdrawFailureSkipped();
                }
            }
            uint256 withdrawnBalance = IERC20(ygiComponents[i].inputToken).balanceOf(address(this));
            if (withdrawnBalance > 0) {
                withdrawnTotalAmount += swapTokens(withdrawnBalance, ygiComponents[i].backRoute);
            }
        }

        IERC20(inputToken).safeTransfer(msg.sender, withdrawnTotalAmount);
        emit Withdraw(_ratio, withdrawnTotalAmount);
    }

    function normalizeAmount(uint256 amount, uint256 decimals) internal view returns (uint256) {
        uint256 inputDecimals = ERC20(inputToken).decimals();
        if (decimals > inputDecimals) {
            return amount * (10 ** (decimals - inputDecimals));
        }
        return amount / (10 ** (inputDecimals - decimals));
    }

    function setUniRouter(address _uniRouter) public onlyOwner {
        uniRouter = _uniRouter;
    }

    function panic() public onlyOwner {
        stop();
    }

    // todo: function for wayward tokens

    function stop() public onlyOwner {
        _stop();
    }

    function resume() public onlyOwner {
        _resume();
    }
}
