pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../../interfaces/ram/IGuageStaker.sol";
import "../../interfaces/ram/IGuage.sol";
import "hardhat/console.sol";


contract MockGaugeStaker is IGaugeStaker, Ownable {
    address public stake; // LP token
    address public gauge;

    address[] public rewards; // reward tokens

    constructor(
        address _stake,
        address[] memory _rewards,
        address _gauge
    ) {
        stake = _stake;
        rewards = _rewards;
        gauge = _gauge;
    }

    function setRewards(address[] memory _rewards) external onlyOwner {
        rewards = _rewards;
    }

    function deposit(address gauge, uint256 amount) external override {
        IGauge(gauge).setBalance(msg.sender, amount);
        uint256 stakeBal = IERC20(stake).balanceOf(address(this));
        IERC20(stake).transferFrom(msg.sender, address(this), amount);
    }

    function withdraw(address gauge, uint256 amount) external override {
        uint256 balance = IGauge(gauge).balanceOf(msg.sender);
        IGauge(gauge).setBalance(msg.sender, balance - amount);
        uint256 stakeBal = IERC20(stake).balanceOf(address(this));
        IERC20(stake).transfer(msg.sender, amount);
    }

    function harvestRewards(address gauge, address[] calldata tokens) external override {
        for (uint256 i; i < tokens.length; i++) {
            uint256 rewardAmount = IERC20(tokens[i]).balanceOf(address(this));
            IERC20(tokens[i]).transfer(msg.sender, rewardAmount);
        }
    }

    function claimGaugeReward(address gauge) external override {
        for (uint256 i; i < rewards.length; i++) {
            uint256 rewardAmount = IERC20(rewards[i]).balanceOf(address(this));
            IERC20(rewards[i]).transfer(msg.sender, rewardAmount);
        }
    }
}
