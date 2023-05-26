pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../../interfaces/ram/IGuage.sol";
import "hardhat/console.sol";


contract MockGauge is IGauge, Ownable {
    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private userRewards;
    address[] public rewardTokens;
    address public stake;

    constructor(address[] memory _rewardTokens, address _stake) {
        rewardTokens = _rewardTokens;
        stake = _stake;
    }

    function setRewardTokens(address[] memory _rewardTokens) external {
        rewardTokens = _rewardTokens;
    }

    function setBalance(address user, uint256 amount) external {
        balances[user] = amount;
    }

    function setReward(address user, address token, uint256 amount) external {
        userRewards[user][token] = amount;
    }

    function balanceOf(address user) external view override returns (uint256) {
        return balances[user];
    }

    function earned(address token, address user) external view override returns (uint256) {
        return userRewards[user][token];
    }

    function earned(address user) external view override returns (uint256) {
        uint256 totalEarned = 0;
        for (uint256 i = 0; i < rewardTokens.length; i++) {
            totalEarned += userRewards[user][rewardTokens[i]];
        }
        return totalEarned;
    }
    
    function deposit(uint256 tokenId, uint256 amount) external override {
        balances[msg.sender] += amount;
        uint256 balance = balances[msg.sender];
        ERC20(stake).transferFrom(msg.sender, address(this), amount);
    }
    
    function withdraw(uint256 amount) external override {
        uint256 balance = balances[msg.sender];
        balances[msg.sender] = balance - amount;
        ERC20(stake).transfer(msg.sender, amount);
    }

    function getReward(address account, address[] memory tokens) public {
        for (uint256 i = 0; i < tokens.length; i++) {
            ERC20(tokens[i]).transfer(account, 1 ether);
        }
    }
}
