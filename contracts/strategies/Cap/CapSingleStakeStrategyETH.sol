// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin-4/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin-4/contracts/token/ERC20/utils/SafeERC20.sol";
import "../Common/StratFeeManager.sol";
import "../../utils/GasFeeThrottler.sol";
import "../../interfaces/cap/ICapETHPool.sol";
import "../../interfaces/cap/ICapRewards.sol";
import "../../utils/Manager.sol";

contract CapSingleStakeStrategyETH is Manager, Pausable, GasFeeThrottler {
    using SafeERC20 for IERC20;

    address public vault;
    address public pool;
    address public rewards;
    address public protocolTokenAddress;
    uint256 constant DIVISOR = 1 ether;
    uint256 DEV_FEE = 5 * 10 ** 16;
    uint256 STAKING_CONTRACT_FEE = 0;
    
    uint256 public lastDepositTime;
    uint256 public lastPausedTime;
    bool public harvestOnDeposit;
    uint256 public lastHarvest;

    event StratHarvest(address indexed harvester, uint256 wantTokenHarvested, uint256 tvl);
    event Deposit(uint256 tvl);
    event Withdraw(uint256 tvl);
    event ChargedFees(uint256 fees, uint256 amount);

    constructor(
        address _vault,
        address _pool,
        address _rewards
    ) {
        vault = _vault;
        pool = _pool;
        rewards = _rewards;
    }

    receive() external payable {}
    fallback() external payable {}

    function deposit() public payable whenNotPaused {
        if (address(this).balance > 0) {
            ICapETHPool(pool).deposit{value : address(this).balance}(0);
            lastDepositTime = block.timestamp;
            emit Deposit(balanceOf());
        }
    }

    function _withdraw(uint256 _amount) internal {
        require(msg.sender == vault, "!vault");
        uint256 wantTokenBal = address(this).balance;

        if (wantTokenBal < _amount) {
            ICapETHPool(pool).withdraw(_amount - wantTokenBal);
            wantTokenBal = address(this).balance;
        }

        if (wantTokenBal > _amount) {
            wantTokenBal = _amount;
        }


        (bool success,) = vault.call{value : wantTokenBal}('');
        require(success, "WITHDRAW_FAILED");
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
        uint256 tokenBal = address(this).balance;
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
        uint256 devFeeAmount = address(this).balance * DEV_FEE / DIVISOR;
        uint256 protocolTokenFeeAmount = address(this).balance * STAKING_CONTRACT_FEE / DIVISOR;
        (bool ownerTransferSuccess,) = owner().call{value : devFeeAmount}('');
        require(ownerTransferSuccess, "OWNER_FEE_TRANSFER_FAILED");

        if (protocolTokenFeeAmount > 0) {
            (bool protocolTransferSuccess,) = protocolTokenAddress.call{value : protocolTokenFeeAmount}('');
            require(protocolTransferSuccess, "PROTOCOL_TOKEN_FEE_TRANSFER_FAILED");
        }

        emit ChargedFees(DEV_FEE, devFeeAmount + protocolTokenFeeAmount);
    }

    // calculate the total underlying 'wantToken' held by the strat.
    function balanceOf() public view returns (uint256) {
        return balanceOfWant() + balanceOfPool();
    }

    // it calculates how much 'wantToken' this contract holds.
    function balanceOfWant() public view returns (uint256) {
        return address(this).balance;
    }

    // it calculates how much 'wantToken' the strategy has working in the farm.
    function balanceOfPool() public view returns (uint256) {
        return ICapETHPool(pool).getCurrencyBalance(address(this));
    }

    // returns rewards unharvested
    function rewardsAvailable() public view returns (uint256) {
        return ICapRewards(rewards).getClaimableReward();
    }

    // native reward amount for calling harvest
    // function callReward() public view returns (uint256) {}

    function setHarvestOnDeposit(bool _harvestOnDeposit) external onlyManagerAndOwner {
        harvestOnDeposit = _harvestOnDeposit;
    }

    function setDevFee(uint fee) external onlyManagerAndOwner {
        require(fee + STAKING_CONTRACT_FEE <= 5 * 10 ** 17, "fee too high");
        DEV_FEE = fee;
    }

    function setStakingFee(uint fee) external onlyManagerAndOwner {
        require(fee + DEV_FEE <= 5 * 10 ** 17, "fee too high");
        STAKING_CONTRACT_FEE = fee;
    }

    function getDevFee() external view returns (uint256) {
        return DEV_FEE;
    }

    function getStakingFee() external view returns (uint256) {
        return STAKING_CONTRACT_FEE;
    }

    function setProtocolTokenAddress(address _protocolTokenAddress) external onlyOwner {
        protocolTokenAddress = _protocolTokenAddress;
    }

    function setShouldGasThrottle(bool _shouldGasThrottle) external onlyOwner {
        shouldGasThrottle = _shouldGasThrottle;
    }

    // pauses deposits and withdraws all funds from third party systems.
    function panic() public onlyOwner {
        pause();
        ICapRewards(rewards).collectReward();
        ICapETHPool(pool).withdraw(balanceOfPool());
        lastPausedTime = block.timestamp;
    }

    function pause() public onlyManagerAndOwner {
        _pause();
        lastPausedTime = block.timestamp;
    }

    function unpause() external onlyManagerAndOwner {
        _unpause();
        deposit();
    }
}
