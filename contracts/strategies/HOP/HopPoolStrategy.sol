pragma solidity ^0.8.0;

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin-4/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin-4/contracts/token/ERC20/utils/SafeERC20.sol";
import "../Common/StratFeeManager.sol";
import "../../utils/GasFeeThrottler.sol";
import "../../utils/Manager.sol";
import "../Common/Stoppable.sol";
import "../Common/UniSwapRoutes.sol";
import "../../interfaces/hop/IHopTokenTracker.sol";
import "../../interfaces/hop/IHopRewardPool.sol";

contract HopPoolStrategy is Manager, UniSwapRoutes, GasFeeThrottler, Stoppable {
    using SafeERC20 for IERC20;

    address public inputToken; // USDC, ETH, etc
    address public lpToken; // hUSDC-USDC LP
    address public rewardToken; // HOP
    address public hopToken; // hUSDC, hETH
    address public pool;
    address public tracker;
    address public vault;
    address public stakingAddress;
    address public devFeeAddress;

    uint256 DIVISOR;
    uint8 public hopTokenIdx;
    uint8 public inputTokenIdx;

    uint256 public DEV_FEE;
    uint256 STAKING_FEE = 0;
    uint MAX_FEE;

    uint256 public lastPoolDepositTime;
    bool public harvestOnDeposit;
    uint256 public lastHarvest;

    event StratHarvest(address indexed harvester, uint256 wantTokenHarvested, uint256 tvl);
    event Deposit(uint256 tvl);
    event PendingDeposit(uint256 totalPending);
    event Withdraw(uint256 tvl);
    event ChargedFees(uint256 fees, uint256 amount);

    constructor(
        address _vault,
        address _pool,
        address _tracker,
        address _rewardToken,
        address _token,
        address _hopToken,
        address unirouter
    ) {
        vault = _vault;
        pool = _pool;
        tracker = _tracker;
        rewardToken = _rewardToken;
        inputToken = _token;
        hopToken = _hopToken;
        lpToken = IHopTokenTracker(tracker).swapStorage().lpToken;
        hopTokenIdx = IHopTokenTracker(tracker).getTokenIndex(hopToken);
        inputTokenIdx = IHopTokenTracker(tracker).getTokenIndex(inputToken);
        _giveAllowances();
        setRewardRouteParams(unirouter);
        DEV_FEE = 5 * 10 ** (ERC20(lpToken).decimals() - 2);
        MAX_FEE = 5 * 10 ** (ERC20(lpToken).decimals() - 1);
        DIVISOR = 10 ** ERC20(lpToken).decimals();
        devFeeAddress = _msgSender();
    }

    function setRewardRouteParams(address unirouter) internal {
        setUniRouter(unirouter);
        address[] memory path = new address[](2);
        path[0] = rewardToken;
        path[1] = inputToken;
        uint24[] memory fees = new uint24[](1);
        fees[0] = 10000;
        registerRoute(path, fees);
        address[] memory tokens = new address[](1);
        tokens[0] = rewardToken;
        setTokens(tokens);
    }


    function want() external view returns (address) {
        return lpToken;
    }

    // puts the funds to work
    function deposit() public whenNotStopped {
        uint256 tokenBalance = IERC20(inputToken).balanceOf(address(this));
        if (tokenBalance > 0) {
            uint256[] memory amounts = new uint256[](2);
            amounts[0] = tokenBalance;
            amounts[1] = 0;
            IHopTokenTracker(tracker).addLiquidity(amounts, 0, block.timestamp + (86400));
            uint256 lpTokenBal = IERC20(lpToken).balanceOf(address(this));
            IHopRewardPool(pool).stake(lpTokenBal);
            lastPoolDepositTime = block.timestamp;
            emit Deposit(balanceOf());
        }
    }

    function _withdraw(uint256 _amount) internal {
        require(msg.sender == vault, "!vault");
        uint256 wantTokenBal = IERC20(lpToken).balanceOf(address(this));

        if (wantTokenBal < _amount) {
            uint256 amountToWithdraw = (_amount - wantTokenBal);
            IHopRewardPool(pool).withdraw(amountToWithdraw);
            uint256[] memory minAmounts = new uint256[](2);
            minAmounts[0] = 0;
            minAmounts[1] = 0;
            IHopTokenTracker(tracker).removeLiquidity(amountToWithdraw, minAmounts, block.timestamp + (86400));
            uint256 hopTokenBal = IERC20(hopToken).balanceOf(address(this));
            IHopTokenTracker(tracker).swap(hopTokenIdx, inputTokenIdx, hopTokenBal, 0, block.timestamp + (86400));
            wantTokenBal = IERC20(inputToken).balanceOf(address(this));
        }

        if (wantTokenBal > _amount) {
            wantTokenBal = _amount;
        }

        IERC20(inputToken).safeTransfer(vault, wantTokenBal);
        emit Withdraw(balanceOf());
    }

    function withdraw(uint256 _amount) external {
        _withdraw(_amount);
    }

    function beforeDeposit() external virtual {
        if (harvestOnDeposit && !stopped()) {
            require(msg.sender == vault, "!vault");
            _harvest();
        }
    }

    function harvest() external gasThrottle virtual {
        _harvest();
    }

    // compounds earnings and charges performance fee
    function _harvest() internal whenNotStopped {
        IHopRewardPool(pool).getReward();
        swapRewards();
        uint256 tokenBal = IERC20(inputToken).balanceOf(address(this));
        if (tokenBal > 0) {
            chargeFees();
            uint256 wantTokenHarvested = balanceOfWant();
            deposit();
            lastHarvest = block.timestamp;
            emit StratHarvest(msg.sender, wantTokenHarvested, balanceOf());
        }
    }

    // performance fees
    function chargeFees() internal {
        uint256 devFeeAmount = IERC20(inputToken).balanceOf(address(this)) * DEV_FEE / DIVISOR;
        uint256 stakingFeeAmount = IERC20(inputToken).balanceOf(address(this)) * STAKING_FEE / DIVISOR;
        IERC20(lpToken).safeTransfer(devFeeAddress, devFeeAmount);

        if (stakingFeeAmount > 0) {
            IERC20(lpToken).safeTransfer(stakingAddress, stakingFeeAmount);
        }

        emit ChargedFees(DEV_FEE, devFeeAmount + stakingFeeAmount);
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

    // returns rewards unharvested
    function rewardsAvailable() public view returns (uint256) {
        return IHopRewardPool(pool).earned();
    }


    function setHarvestOnDeposit(bool _harvestOnDeposit) external onlyManagerAndOwner {
        harvestOnDeposit = _harvestOnDeposit;
    }

    function setDevFee(uint fee) external onlyManagerAndOwner {
        require(fee + STAKING_FEE <= MAX_FEE, "fee too high");
        DEV_FEE = fee;
    }

    function setStakingFee(uint fee) external onlyManagerAndOwner {
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

    function panic() public onlyOwner {
        stop();
        IHopRewardPool(pool).getReward();
        IHopRewardPool(pool).exit();
    }

    function stop() public onlyOwner {
        _harvest();
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
