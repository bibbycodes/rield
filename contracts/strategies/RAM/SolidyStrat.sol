// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


import "../../utils/GasFeeThrottler.sol";
import "../Common/UniSwapRoutes.sol";
import "../Common/Stoppable.sol";
import "../../interfaces/ram/ISolidlyRouter.sol";
import "../../interfaces/ram/ISolidlyPair.sol";
import "../../interfaces/ram/IGuageStaker.sol";
import "../../interfaces/ram/IGuage.sol";
import "../../utils/Manager.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "../../utils/FeeUtils.sol";

contract SolidlyLp is FeeUtils, GasFeeThrottler, UniSwapRoutes, Stoppable, Pausable {
    using SafeERC20 for IERC20;

    // Tokens used
    address public feeToken; //WETH
    address public rewardToken; //RAM
    address public want; //LP Token
    address public lpToken0; //WETH
    address public lpToken1; //ARB

    // Third party contracts
    address public gauge; //0x46dcafbb2c9d479827f69bec9314e13741f21058
    address public gaugeStaker; //0x69a3de5f13677fd8d7aaf350a6c65de50e970262

    address public vault;
    address[] public rewards;

    uint256 DIVISOR;
    bool public isStable;

    bool public spiritHarvest;
    bool public harvestOnDeposit;
    uint256 public lastPoolDepositTime;
    uint256 public lastHarvest;

    // Routes
    ISolidlyRouter.Routes[] public rewardTokenToFeeTokenRoute;
    ISolidlyRouter.Routes[] public rewardTokenToLp0TokenRoute;
    ISolidlyRouter.Routes[] public rewardTokenToLp1TokenRoute;

    event StratHarvest(address indexed harvester, uint256 wantTokenHarvested, uint256 tvl);
    event Deposit(uint256 tvl);
    event PendingDeposit(uint256 totalPending);
    event Withdraw(uint256 tvl);
    event ChargedFees(uint256 fees, uint256 amount);

    constructor (
        address _vault,
        address _want,
        address _gauge,
        address _gaugeStaker,
        address _unirouter,
        ISolidlyRouter.Routes[] memory _rewardTokenToFeeTokenRoute,
        ISolidlyRouter.Routes[] memory _rewardTokenToLp0TokenRoute,
        ISolidlyRouter.Routes[] memory _rewardTokenToLp1TokenRoute
    ) {
//        __StratFeeManager_init(_commonAddresses);
        vault = _vault;
        want = _want;
        gauge = _gauge;
        gaugeStaker = _gaugeStaker;
        unirouter = _unirouter;
        devFeeAddress = _msgSender();

        // check if LP is stable or not
        // stable (correlated) vaults use the uniswapV2 model for LP
        // volatile vaults use the solidly model for LP
        isStable = ISolidlyPair(want).stable();

        for (uint i; i < _rewardTokenToFeeTokenRoute.length; ++i) {
            rewardTokenToFeeTokenRoute.push(_rewardTokenToFeeTokenRoute[i]);
        }

        for (uint i; i < _rewardTokenToLp0TokenRoute.length; ++i) {
            rewardTokenToLp0TokenRoute.push(_rewardTokenToLp0TokenRoute[i]);
        }

        for (uint i; i < _rewardTokenToLp1TokenRoute.length; ++i) {
            rewardTokenToLp1TokenRoute.push(_rewardTokenToLp1TokenRoute[i]);
        }

        rewardToken = rewardTokenToFeeTokenRoute[0].from;
        feeToken = rewardTokenToFeeTokenRoute[rewardTokenToFeeTokenRoute.length - 1].to;
        lpToken0 = rewardTokenToLp0TokenRoute[rewardTokenToLp0TokenRoute.length - 1].to;
        lpToken1 = rewardTokenToLp1TokenRoute[rewardTokenToLp1TokenRoute.length - 1].to;
        rewards.push(rewardToken);
        _giveAllowances();
    }

    // puts the funds to work
    function deposit() public whenNotPaused {
        uint256 wantBal = IERC20(want).balanceOf(address(this));

        if (wantBal > 0) {
            IGaugeStaker(gaugeStaker).deposit(gauge, wantBal);
            emit Deposit(balanceOf());
        }
    }

    function withdraw(uint256 _amount) external {
        require(msg.sender == vault, "!vault");

        uint256 wantBal = IERC20(want).balanceOf(address(this));

        if (wantBal < _amount) {
            IGaugeStaker(gaugeStaker).withdraw(gauge, _amount - wantBal);
            wantBal = IERC20(want).balanceOf(address(this));
        }

        if (wantBal > _amount) {
            wantBal = _amount;
        }


        IERC20(want).safeTransfer(vault, wantBal);

        emit Withdraw(balanceOf());
    }

    function beforeDeposit() external virtual {
        if (harvestOnDeposit) {
            require(msg.sender == vault, "!vault");
            _harvest(tx.origin);
        }
    }

    function harvest() external gasThrottle virtual {
        _harvest(tx.origin);
    }

    function harvest(address callFeeRecipient) external gasThrottle virtual {
        _harvest(callFeeRecipient);
    }

    function managerHarvest() external onlyManagerAndOwner {
        _harvest(tx.origin);
    }

    // compounds earnings and charges performance fee
    function _harvest(address callFeeRecipient) internal whenNotPaused {
        IGaugeStaker(gaugeStaker).harvestRewards(gauge, rewards);
        uint256 outputBal = IERC20(rewardToken).balanceOf(address(this));
        if (outputBal > 0) {
            chargeFees(callFeeRecipient);
            addLiquidity();
            uint256 wantHarvested = balanceOfWant();
            deposit();
            lastHarvest = block.timestamp;
            emit StratHarvest(msg.sender, wantHarvested, balanceOf());
        }
    }

    // performance fees
    function chargeFees(address callFeeRecipient) internal {
        uint256 devFeeAmount = IERC20(rewardToken).balanceOf(address(this)) * DEV_FEE / DIVISOR;
        uint256 stakingFeeAmount = IERC20(rewardToken).balanceOf(address(this)) * STAKING_FEE / DIVISOR;
        uint256 totalFeeAmount = devFeeAmount + stakingFeeAmount;
        if (totalFeeAmount > 0) {
            ISolidlyRouter(unirouter).swapExactTokensForTokens(totalFeeAmount, 0, rewardTokenToFeeTokenRoute, address(this), block.timestamp);
            uint256 feeTokenBal = IERC20(feeToken).balanceOf(address(this));
            uint256 devFeeInFeeToken = feeTokenBal * devFeeAmount / DIVISOR;

            emit ChargedFees(DEV_FEE + STAKING_FEE, devFeeAmount + stakingFeeAmount);
        }
    }

    // Adds liquidity to AMM and gets more LP tokens.
    function addLiquidity() internal {
        uint256 outputBal = IERC20(rewardToken).balanceOf(address(this));
        uint256 lp0Amt = outputBal / 2;
        uint256 lp1Amt = outputBal - lp0Amt;

        // NB stable pools use a different model for LP compared to volatile
        if (isStable) {
            uint256 lp0Decimals = 10**ERC20(lpToken0).decimals();
            uint256 lp1Decimals = 10**ERC20(lpToken1).decimals();
            uint256 out0 = ISolidlyRouter(unirouter).getAmountsOut(lp0Amt, rewardTokenToLp0TokenRoute)[rewardTokenToLp0TokenRoute.length] * 1e18 / lp0Decimals;
            uint256 out1 = ISolidlyRouter(unirouter).getAmountsOut(lp1Amt, rewardTokenToLp1TokenRoute)[rewardTokenToLp1TokenRoute.length] * 1e18 / lp1Decimals;
            (uint256 amountA, uint256 amountB,) = ISolidlyRouter(unirouter).quoteAddLiquidity(lpToken0, lpToken1, isStable, out0, out1);
            amountA = amountA * 1e18 / lp0Decimals;
            amountB = amountB * 1e18 / lp1Decimals;
            uint256 ratio = out0 * 1e18 / out1 * amountB / amountA;
            lp0Amt = outputBal * 1e18 / (ratio + 1e18);
            lp1Amt = outputBal - lp0Amt;
        }

        if (lpToken0 != rewardToken) {
            ISolidlyRouter(unirouter).swapExactTokensForTokens(lp0Amt, 0, rewardTokenToLp0TokenRoute, address(this), block.timestamp);
        }

        if (lpToken1 != rewardToken) {
            ISolidlyRouter(unirouter).swapExactTokensForTokens(lp1Amt, 0, rewardTokenToLp1TokenRoute, address(this), block.timestamp);
        }

        uint256 lp0Bal = IERC20(lpToken0).balanceOf(address(this));
        uint256 lp1Bal = IERC20(lpToken1).balanceOf(address(this));
        ISolidlyRouter(unirouter).addLiquidity(lpToken0, lpToken1, isStable, lp0Bal, lp1Bal, 1, 1, address(this), block.timestamp);
    }

    // calculate the total underlaying 'want' held by the strat.
    function balanceOf() public view returns (uint256) {
        return balanceOfWant() + balanceOfPool();
    }

    // it calculates how much 'want' this contract holds. NB the want is the LP token
    function balanceOfWant() public view returns (uint256) {
        return IERC20(want).balanceOf(address(this));
    }

    // it calculates how much 'want' the strategy has working in the farm.
    function balanceOfPool() public view returns (uint256) {
        uint256 _amount = IGauge(gauge).balanceOf(gaugeStaker);
        return _amount;
    }

    // returns rewards unharvested
    function rewardsAvailable() public view returns (uint256) {
        return spiritHarvest ? IGauge(gauge).earned(gaugeStaker) : IGauge(gauge).earned(rewardToken, gaugeStaker);
    }

    function setSpiritHarvest(bool _spiritHarvest) external onlyManagerAndOwner {
        spiritHarvest = _spiritHarvest;
    }

    function setGaugeStaker(address _gaugeStaker) external onlyOwner {
        panic();
        gaugeStaker = _gaugeStaker;
        unpause();
    }

    function setHarvestOnDeposit(bool _harvestOnDeposit) external onlyManagerAndOwner {
        harvestOnDeposit = _harvestOnDeposit;
    }

    function setShouldGasThrottle(bool _shouldGasThrottle) external onlyManagerAndOwner {
        shouldGasThrottle = _shouldGasThrottle;
    }
    // called as part of strat migration. Sends all the available funds back to the vault.
    function retireStrat() external {
        require(msg.sender == vault, "!vault");

        IGaugeStaker(gaugeStaker).withdraw(gauge, balanceOfPool());

        uint256 wantBal = IERC20(want).balanceOf(address(this));
        IERC20(want).transfer(vault, wantBal);
    }

    // pauses deposits and withdraws all funds from third party systems.
    function panic() public onlyManagerAndOwner {
        pause();
        IGaugeStaker(gaugeStaker).withdraw(gauge, balanceOfPool());
    }

    function pause() public onlyManagerAndOwner {
        _pause();

        _removeAllowances();
    }

    function unpause() public onlyManagerAndOwner {
        _unpause();

        _giveAllowances();

        deposit();
    }

    function _giveAllowances() internal {
        IERC20(want).safeApprove(gaugeStaker, type(uint).max);
        IERC20(rewardToken).safeApprove(unirouter, type(uint).max);

        IERC20(lpToken0).safeApprove(unirouter, 0);
        IERC20(lpToken0).safeApprove(unirouter, type(uint).max);

        IERC20(lpToken1).safeApprove(unirouter, 0);
        IERC20(lpToken1).safeApprove(unirouter, type(uint).max);
    }

    function _removeAllowances() internal {
        IERC20(want).safeApprove(gaugeStaker, 0);
        IERC20(rewardToken).safeApprove(unirouter, 0);
        IERC20(lpToken0).safeApprove(unirouter, 0);
        IERC20(lpToken1).safeApprove(unirouter, 0);
    }

    function _solidlyToUniRoute(ISolidlyRouter.Routes[] memory _route) internal pure returns (address[] memory) {
        address[] memory route = new address[](_route.length + 1);
        route[0] = _route[0].from;
        for (uint i; i < _route.length; ++i) {
            route[i + 1] = _route[i].to;
        }
        return route;
    }

    function getRewardTokenToFeeTokenRoute() external view returns (address[] memory) {
        ISolidlyRouter.Routes[] memory _route = rewardTokenToFeeTokenRoute;
        return _solidlyToUniRoute(_route);
    }

    function getRewardTokenToLp0TokenRoute() external view returns (address[] memory) {
        ISolidlyRouter.Routes[] memory _route = rewardTokenToLp0TokenRoute;
        return _solidlyToUniRoute(_route);
    }

    function getRewardTokenToLp1TokenRoute() external view returns (address[] memory) {
        ISolidlyRouter.Routes[] memory _route = rewardTokenToLp1TokenRoute;
        return _solidlyToUniRoute(_route);
    }
}
