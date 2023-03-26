// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin-4/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin-4/contracts/token/ERC20/utils/SafeERC20.sol";
import "hardhat/console.sol";
import "../interfaces/hop/IHopRewardPool.sol";

contract HopPoolMock is IHopRewardPool {
    address immutable lpToken;
    address immutable rewardToken;
    using SafeERC20 for IERC20;
    using Address for address payable;
    uint256 UNIT = 10 ** 18;
    uint8 decimals = 6;

    constructor(address _lpToken, address _rewardToken) {
        lpToken = _lpToken;
        rewardToken = _rewardToken;
    }

    event CollectRewards();
    event Withdraw(address indexed user, uint256 amount);

    mapping(address => uint256) public deposits;

    function exit() external{}

    function getReward() external {
        IERC20(rewardToken).approve(address(this), type(uint256).max);
        IERC20(rewardToken).transferFrom(address(this), msg.sender, 10**6);
        emit CollectRewards();
    }

    function earned() external view returns (uint256) {
        return 10**6;
    }

    function stake(uint256 amount) external {
        deposits[msg.sender] += amount;
        IERC20(lpToken).transferFrom(msg.sender, address(this), amount);
    }

    function withdraw(uint256 amount) external {
        deposits[msg.sender] -= amount;
        IERC20(lpToken).approve(address(this), type(uint256).max);
        IERC20(lpToken).transferFrom(address(this), msg.sender, amount);
    }

    function balanceOf(address account) external view returns (uint256) {
        return IERC20(lpToken).balanceOf(address(this));
    }
}
