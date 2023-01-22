pragma solidity ^0.8.0;

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
import "../../interfaces/cap/ICapPool.sol";
import "../../interfaces/cap/ICapRewards.sol";
import "hardhat/console.sol";

contract CapSingleStakeStrategy is Ownable, Pausable, GasFeeThrottler {
    using SafeERC20 for IERC20;

    address public token;
    address public pool;
    address public vault;
    address public rewards;
    address public protocolStakingAddress;
    uint256 DIVISOR;
    uint256 public DEV_FEE;
    uint256 STAKING_CONTRACT_FEE = 0;
    uint256 CAP_MULTIPLIER = 10 ** 12;

    bool public harvestOnDeposit;
    uint256 public lastHarvest;

    event StratHarvest(address indexed harvester, uint256 wantTokenHarvested, uint256 tvl);
    event Deposit(uint256 tvl);
    event Withdraw(uint256 tvl);
    event ChargedFees(uint256 fees, uint256 amount);

    constructor(
        address _vault,
        address _pool,
        address _rewards,
        address _token
    ) {
        vault = _vault;
        pool = _pool;
        rewards = _rewards;
        token = _token;
        _giveAllowances();
        DEV_FEE = 3 * 10 ** (ERC20(token).decimals() - 1);
        DIVISOR = 10 ** ERC20(token).decimals();
    }


    function want() external view returns (address) {
        return token;
    }

    // puts the funds to work
    function deposit() public whenNotPaused {
        uint256 tokenBalance = IERC20(token).balanceOf(address(this));
        if (tokenBalance > 0) {
            ICapPool(pool).deposit(tokenBalance * CAP_MULTIPLIER);
            emit Deposit(balanceOf());
        }
    }

    function _withdraw(uint256 _amount) internal {
        require(msg.sender == vault, "!vault");
        uint256 wantTokenBal = IERC20(token).balanceOf(address(this));

        if (wantTokenBal < _amount) {
            uint256 amountToWithdraw = (_amount - wantTokenBal) * CAP_MULTIPLIER;
            ICapPool(pool).withdraw(amountToWithdraw);
            wantTokenBal = IERC20(token).balanceOf(address(this));
        }

        if (wantTokenBal > _amount) {
            wantTokenBal = _amount;
        }

        IERC20(token).safeTransfer(vault, wantTokenBal);
        emit Withdraw(balanceOf());
    }

    function withdraw(uint256 _amount) external {
        _withdraw(_amount);
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
    function _harvest() internal whenNotPaused {
        ICapRewards(rewards).collectReward();
        uint256 tokenBal = IERC20(token).balanceOf(address(this));
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
        uint256 devFeeAmount = IERC20(token).balanceOf(address(this)) * DEV_FEE / DIVISOR;
        uint256 protocolTokenFeeAmount = IERC20(token).balanceOf(address(this)) * STAKING_CONTRACT_FEE / DIVISOR;
        IERC20(token).safeTransfer(owner(), devFeeAmount);

        if (protocolTokenFeeAmount > 0) {
            IERC20(token).safeTransfer(protocolStakingAddress, protocolTokenFeeAmount);
        }
        
        emit ChargedFees(DEV_FEE, devFeeAmount + protocolTokenFeeAmount);
    }

    // calculate the total underlying 'wantToken' held by the strat.
    function balanceOf() public view returns (uint256) {
        return balanceOfWant() + balanceOfPool();
    }

    // it calculates how much 'wantToken' this contract holds.
    function balanceOfWant() public view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    // it calculates how much 'wantToken' the strategy has working in the farm.
    function balanceOfPool() public view returns (uint256) {
        uint256 capPoolAmount = ICapPool(pool).getCurrencyBalance(address(this));
        return capPoolAmount / CAP_MULTIPLIER;
    }

    // returns rewards unharvested
    function rewardsAvailable() public view returns (uint256) {
        return ICapRewards(rewards).getClaimableReward();
    }
     

    function setHarvestOnDeposit(bool _harvestOnDeposit) external onlyOwner {
        harvestOnDeposit = _harvestOnDeposit;
    }

    function setDevFee(uint fee) external onlyOwner {
        require(fee + STAKING_CONTRACT_FEE <= 5 * 10 ** 17, "fee too high");
        DEV_FEE = fee;
    }

    function setStakingFee(uint fee) external onlyOwner {
        require(fee + DEV_FEE <= 5 * 10 ** 17, "fee too high");
        STAKING_CONTRACT_FEE = fee;
    }

    function getDevFee() external view returns (uint256) {
        return DEV_FEE;
    }

    function getStakingFee() external view returns (uint256) {
        return STAKING_CONTRACT_FEE;
    }

    function setProtocolStakingAddress(address _protocolStakingAddress) external onlyOwner {
        protocolStakingAddress = _protocolStakingAddress;
    }

    function setShouldGasThrottle(bool _shouldGasThrottle) external onlyOwner {
        shouldGasThrottle = _shouldGasThrottle;
    }

    // called as part of strat migration. Sends all the available funds back to the vault.
    function retireStrat() external {
        require(msg.sender == vault, "!vault");
        IBeefyVault.StratCandidate memory candidate = IBeefyVault(vault).stratCandidate();
        _harvest();
        uint256 tokenBal = IERC20(token).balanceOf(address(this));
        uint256 poolBal = balanceOfPool();
        _withdraw(poolBal);
        IERC20(token).transfer(vault, tokenBal + poolBal);
    }

    // pauses deposits and withdraws all funds from third party systems.
    function panic() public onlyOwner {
        pause();
        ICapRewards(rewards).collectReward();
        ICapPool(pool).withdraw(balanceOfPool());
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
        IERC20(token).safeApprove(pool, type(uint).max);
    }

    function _removeAllowances() internal {
        IERC20(token).safeApprove(pool, 0);
    }
}
