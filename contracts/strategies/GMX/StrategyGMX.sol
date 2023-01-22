// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin-4/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin-4/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../interfaces/gmx/IGMXRouter.sol";
import "../../interfaces/gmx/IGMXTracker.sol";
import "../../interfaces/gmx/IBeefyVault.sol";
import "../../interfaces/gmx/IGMXStrategy.sol";
import "../Common/StratFeeManager.sol";
import "../../utils/GasFeeThrottler.sol";
import "../../interfaces/common/IUniswapRouterV3.sol";

contract StrategyGMX is StrategyManager, GasFeeThrottler {
    using SafeERC20 for IERC20;

    address public native;
    address public wantToken;

    address public chef;
    address public rewardStorage;
    address public balanceTracker;

    bool public harvestOnDeposit;
    uint256 public lastHarvest;

    event StratHarvest(address indexed harvester, uint256 wantTokenHarvested, uint256 tvl);
    event Deposit(uint256 tvl);
    event Withdraw(uint256 tvl);
    event ChargedFees(uint256 fees, uint256 amount);

    constructor(
        address _chef,
        CommonAddresses memory _commonAddresses
    ) StrategyManager(_commonAddresses) {
        chef = _chef;
        rewardStorage = IGMXRouter(chef).feeGmxTracker();
        balanceTracker = IGMXRouter(chef).stakedGmxTracker();
    }

    function want() external view returns (address) {
        return wantToken;
    }

    // puts the funds to work
    function deposit() public whenNotPaused {
        uint256 wantTokenBal = IERC20(wantToken).balanceOf(address(this));

        if (wantTokenBal > 0) {
            IGMXRouter(chef).stakeGmx(wantTokenBal);
            emit Deposit(balanceOf());
        }
    }

    function withdraw(uint256 _amount) external {
        require(msg.sender == vault, "!vault");
        uint256 wantTokenBal = IERC20(wantToken).balanceOf(address(this));
        if (wantTokenBal < _amount) {
            IGMXRouter(chef).unstakeGmx(_amount - wantTokenBal);
            wantTokenBal = IERC20(wantToken).balanceOf(address(this));
        }

        if (wantTokenBal > _amount) {
            wantTokenBal = _amount;
        }

        IERC20(wantToken).safeTransfer(vault, wantTokenBal);
        emit Withdraw(balanceOf());
    }

    function beforeDeposit() external virtual override {
        if (harvestOnDeposit) {
            require(msg.sender == vault, "!vault");
            _harvest();
        }
    }

    function harvest() external gasThrottle virtual {
        _harvest();
    }

    // compounds earnings and charges performance fee
    function _harvest() internal whenNotPaused {
        IGMXRouter(chef).compound();
        // Claim and re-stake esGMX and multiplier points
        IGMXTracker(rewardStorage).claim(address(this));
        uint256 nativeBal = IERC20(native).balanceOf(address(this));
        if (nativeBal > 0) {
            chargeFees();
            swapRewards();
            uint256 wantTokenHarvested = balanceOfWant();
            deposit();
            lastHarvest = block.timestamp;
            emit StratHarvest(msg.sender, wantTokenHarvested, balanceOf());
        }
    }

    // performance fees
    function chargeFees() internal {
        uint256 feeAmount = IERC20(native).balanceOf(address(this)) * FEE / DIVISOR;
        IERC20(native).safeTransfer(owner(), feeAmount);
        emit ChargedFees(FEE, feeAmount);
    }

    // Adds liquidity to AMM and gets more LP tokens.
    function swapRewards() internal virtual {
        uint256 nativeBal = IERC20(native).balanceOf(address(this));
        if (nativeBal > 0) {
            IUniswapRouterV3.ExactInputSingleParams memory params = IUniswapRouterV3.ExactInputSingleParams({
                tokenIn: native,
                tokenOut: wantToken,
                fee: 3000,
                recipient: address(this),
                amountIn: nativeBal,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
            IUniswapRouterV3(unirouter).exactInputSingle(params);
        }
    }

    // calculate the total underlaying 'wantToken' held by the strat.
    function balanceOf() public view returns (uint256) {
        return balanceOfWant() + balanceOfPool();
    }

    // it calculates how much 'wantToken' this contract holds.
    function balanceOfWant() public view returns (uint256) {
        return IERC20(wantToken).balanceOf(address(this));
    }

    // it calculates how much 'wantToken' the strategy has working in the farm.
    function balanceOfPool() public view returns (uint256) {
        return IGMXTracker(balanceTracker).depositBalances(address(this), wantToken);
    }

    // returns rewards unharvested
    function rewardsAvailable() public view returns (uint256) {
        return IGMXTracker(rewardStorage).claimable(address(this));
    }

    // native reward amount for calling harvest
    function callReward() public view returns (uint256) {}

    function setHarvestOnDeposit(bool _harvestOnDeposit) external onlyOwner {
        harvestOnDeposit = _harvestOnDeposit;
    }

    function setShouldGasThrottle(bool _shouldGasThrottle) external onlyOwner {
        shouldGasThrottle = _shouldGasThrottle;
    }

    // called as part of strat migration. Sends all the available funds back to the vault.
    function retireStrat() external {
        require(msg.sender == vault, "!vault");

        IBeefyVault.StratCandidate memory candidate = IBeefyVault(vault).stratCandidate();
        address stratAddress = candidate.implementation;

        IGMXRouter(chef).signalTransfer(stratAddress);
        IGMXStrategy(stratAddress).acceptTransfer();

        uint256 wantTokenBal = IERC20(wantToken).balanceOf(address(this));
        IERC20(wantToken).transfer(vault, wantTokenBal);
    }

    // pauses deposits and withdraws all funds from third party systems.
    function panic() public onlyOwner {
        pause();
        IGMXRouter(chef).unstakeGmx(balanceOfPool());
    }

    function pause() public onlyOwner {
        _pause();
        _removeAllowances();
    }

    function unpause() external onlyOwner {
        _unpause();
        _giveAllowances();
        deposit();
    }

    function _giveAllowances() internal {
        IERC20(wantToken).safeApprove(balanceTracker, type(uint).max);
        IERC20(native).safeApprove(unirouter, type(uint).max);
    }

    function _removeAllowances() internal {
        IERC20(wantToken).safeApprove(balanceTracker, 0);
        IERC20(native).safeApprove(unirouter, 0);
    }

    function nativeToWant() external view virtual returns (address[] memory) {}

    function acceptTransfer() external {
        address prevStrat = IBeefyVault(vault).strategy();
        require(msg.sender == prevStrat, "!prevStrat");
        IGMXRouter(chef).acceptTransfer(prevStrat);
    }
}
