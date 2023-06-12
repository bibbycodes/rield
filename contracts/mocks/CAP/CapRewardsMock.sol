// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../../interfaces/cap/ICapRewards.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract CapRewardsMock is ICapRewards {
    using SafeERC20 for IERC20;
    address public token;
    address public poolContract;
    constructor(address _token) {
        token = _token;
    }

    event CollectRewards(address indexed user, uint256 amount);

    mapping(address => uint256) public rewards;

    function init ( address _pool ) external {
        poolContract = _pool;
    }

    function collectReward (  ) external {
        IERC20(token).transfer(msg.sender, 10 ** 6);
        emit CollectRewards(msg.sender, 10 ** 6);
    }

    function getClaimableReward (  ) external view returns ( uint256 ) {
        return rewards[msg.sender];
    }
}
