// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin-4/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin-4/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../interfaces/bfr/IBFRRouter.sol";
import "../../interfaces/bfr/IBFRTracker.sol";
import "../Common/StratFeeManager.sol";
import "../../utils/GasFeeThrottler.sol";
import "../../interfaces/common/IUniswapRouterV3.sol";
import "../Common/UniSwapRoutes.sol";
import "../../interfaces/tnd/ITNDRewardRouter.sol";

contract StrategyTND is Manager, GasFeeThrottler, UniSwapRoutes, Stoppable {
    using SafeERC20 for IERC20;

    address public esTndToken;
    address public tndToken;
    address public vault;
    address public wethToken; //= 0x82aF49447D8a07e3bd95BD0d56f35241523fBab1;

    address public rewardTracker;
    address public rewardRouter;

    bool public harvestOnDeposit;
    uint256 public lastHarvest;
    uint256 public lastDepositTime;

    address public stakingAddress;
    address public devFeeAddress;
    uint256 STAKING_FEE = 0;
    uint DEV_FEE = 5 * 10 ** 16;
    uint DIVISOR = 10 ** 18;
    uint MAX_FEE = 5 * 10 ** 17;

    event StratHarvest(address indexed harvester, uint256 wantTokenHarvested, uint256 tvl);
    event Deposit(uint256 tvl);
    event Withdraw(uint256 tvl);
    event ChargedFees(uint256 fees, uint256 amount);

    constructor(
        address _rewardTracker,
        address _vault,
        address _uniRouter,
        address _tndToken,
        address _esTndToken,
        address _wethToken
    ) {
        rewardTracker = _rewardTracker;
        rewardRouter = ITNDRewardRouter(rewardTracker);
        devFeeAddress = _msgSender();
        tndToken = _tndToken;
        vault = _vault;
        esTndToken = _esTndToken;
        wethToken = _wethToken;
        setRewardRouteParams(_uniRouter);
        IERC20(tndToken).safeApprove(balanceTracker, type(uint).max);
    }

    function setRewardRouteParams(address unirouter) internal {
        setUniRouter(unirouter);
        address[] memory path = new address[](2);
        path[0] = tndToken;
        path[1] = wethToken;
        uint24[] memory fees = new uint24[](1);
        fees[0] = 500;
        registerRoute(path, fees);
        tokens[0] = esTndToken;
        tokens[1] = ethToken;
        setTokens(tokens);
    }

    function want() external view returns (address) {
        return tndToken;
    }

    // puts the funds to work
    function deposit() public whenNotStopped {
        uint256 wantTokenBal = IERC20(tndToken).balanceOf(address(this));
        uint256 esTndTokenBal = IERC20(esTndToken).balanceOf(address(this));

        if (wantTokenBal > 0) {
            ITNDRewardRouter(rewardTracker).stakeTnd(wantTokenBal);
            ITNDRewardRouter(rewardTracker).stakeEsTnd(esTndTokenBal);
            lastDepositTime = block.timestamp;
            emit Deposit(wantTokenBal);
        }
    }

    function withdraw(uint256 _amount) external {
        require(msg.sender == vault, "!vault");
        uint256 wantTokenBal = IERC20(tndToken).balanceOf(address(this));
        if (wantTokenBal < _amount) {
            ITNDRewardRouter(rewardTracker).unstakeTnd(_amount - wantTokenBal);
            wantTokenBal = IERC20(tndToken).balanceOf(address(this));
        }

        if (wantTokenBal > _amount) {
            wantTokenBal = _amount;
        }

        IERC20(tndToken).safeTransfer(vault, wantTokenBal);
        emit Withdraw(wantTokenBal);
    }

    function beforeDeposit() external virtual {
        if (harvestOnDeposit) {
            require(msg.sender == vault, "!vault");
            _harvest();
        }
    }

    function harvest() external gasThrottle virtual {
        _harvest();
    }

    // compounds earnings and charges performance fee
    function _harvest() internal whenNotStopped {
        ITNDRewardRouter(rewardRouter).handleRewards(true, true, true, true, true, true, false);
        uint256 rewardTokenBalance = IERC20(esTndToken).balanceOf(address(this));
        if (rewardTokenBalance > 0) {
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
        uint256 wantBal = IERC20(tndToken).balanceOf(address(this));
        uint256 wethBalance = IERC20(wethToken).balanceOf(address(this));
        uint256 devFeeAmount = wantBal * DEV_FEE / DIVISOR;
        uint256 stakingFeeAmount = wantBal * STAKING_FEE / DIVISOR;
        IERC20(tndToken).safeTransfer(devFeeAddress, devFeeAmount);
        IERC20(wethToken).safeTransfer(devFeeAddress, devFeeAmount);

        if (stakingFeeAmount > 0) {
            IERC20(tndToken).safeTransfer(stakingAddress, stakingFeeAmount);
            IERC20(wethToken).safeTransfer(stakingAddress, stakingFeeAmount);
        }

        emit ChargedFees(DEV_FEE, devFeeAmount + stakingFeeAmount);
    }

    // calculate the total underlaying 'wantToken' held by the strat.
    function balanceOf() public view returns (uint256) {
        return balanceOfWant() + balanceOfPool();
    }

    // it calculates how much 'wantToken' this contract holds.
    function balanceOfWant() public view returns (uint256) {
        return IERC20(tndToken).balanceOf(address(this));
    }

    // it calculates how much 'wantToken' the strategy has working in the farm.
    function balanceOfPool() public view returns (uint256) {
        return IBFRTracker(balanceTracker).depositBalances(address(this), tndToken);
    }

    // returns rewards unharvested
    function rewardsAvailable() public view returns (uint256) {
        return IBFRTracker(rewardRouter).claimable(address(this));
    }

    // native reward amount for calling harvest
    function callReward() public view returns (uint256) {}

    function setHarvestOnDeposit(bool _harvestOnDeposit) external onlyOwner {
        harvestOnDeposit = _harvestOnDeposit;
    }

    function setDevFee(uint fee) external onlyOwner {
        require(fee + STAKING_FEE <= MAX_FEE, "fee too high");
        DEV_FEE = fee;
    }

    function setStakingFee(uint fee) external onlyOwner {
        require(fee + DEV_FEE <= MAX_FEE, "fee too high");
        STAKING_FEE = fee;
    }

    function getDevFee() external view returns (uint256) {
        return DEV_FEE;
    }

    function getStakingFee() external view returns (uint256) {
        return STAKING_FEE;
    }

    function setStakingAddress(address _stakingAddress) external onlyOwner {
        stakingAddress = _stakingAddress;
    }

    function setDevFeeAddress(address _devFeeAddress) external onlyOwner {
        devFeeAddress = _devFeeAddress;
    }

    function setShouldGasThrottle(bool _shouldGasThrottle) external onlyOwner {
        shouldGasThrottle = _shouldGasThrottle;
    }

    // stops deposits and withdraws all funds from third party systems.
    function panic() public onlyOwner {
        stop();
        ITNDRewardRouter(rewardTracker).unstakeTnd(balanceOfPool());
    }

    function stop() public onlyOwner {
        _harvest();
        _stop();
        _removeAllowances();
    }

    function resume() external onlyOwner {
        _resume();
        _giveAllowances();
        deposit();
    }

    function _giveAllowances() internal {
        IERC20(tndToken).safeApprove(rewardTracker, type(uint).max);
        IERC20(esTndToken).safeApprove(unirouter, type(uint).max);
        IERC20(tndToken).safeApprove(unirouter, type(uint).max);
        IERC20(ethToken).safeApprove(unirouter, type(uint).max);
    }

    function _removeAllowances() internal {
        IERC20(tndToken).safeApprove(balanceTracker, 0);
        IERC20(esTndToken).safeApprove(unirouter, 0);
        IERC20(tndToken).safeApprove(unirouter, 0);
        IERC20(ethToken).safeApprove(unirouter, 0);
    }

    function nativeToWant() external view virtual returns (address[] memory) {}

}
