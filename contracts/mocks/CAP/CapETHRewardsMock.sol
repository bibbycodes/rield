// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../../interfaces/cap/ICapRewards.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract CapETHRewardsMock is ICapRewards {
    using SafeERC20 for IERC20;
    address public poolContract;

    event CollectRewards(address indexed user, uint256 amount);

    mapping(address => uint256) public rewards;

    function init ( address _pool ) external {
        poolContract = _pool;
    }

    receive() external payable {}
    fallback() external payable {}

    function UNIT (  ) external view returns ( uint256 ) {
        return 1;
    }

    function collectReward (  ) external {
        (bool success,) = msg.sender.call{value: 1 ether}('');
        require(success, "Transfer failed.");
        emit CollectRewards(msg.sender, 1 ether);
    }
    function cumulativeRewardPerTokenStored (  ) external view returns ( uint256 ) {
        return 0;
    }
    function currency (  ) external view returns ( address ) {
        return address(this);
    }
    function getClaimableReward (  ) external view returns ( uint256 ) {
        return rewards[msg.sender];
    }

    function notifyRewardReceived ( uint256 amount ) external {}

    function owner (  ) external view returns ( address ) {
        return address(0);
    }

    function pendingReward (  ) external view returns ( uint256 ) {
        return rewards[msg.sender];
    }

    function pool (  ) external view returns ( address ) {
        return poolContract;
    }

    function router (  ) external view returns ( address ) {
        return address(0);
    }
    function setOwner ( address newOwner ) external {}
    function setRouter ( address _router ) external {}
    function trading (  ) external view returns ( address ) {
        return address(0);
    }
    function treasury (  ) external view returns ( address ) {
        return address(0);
    }
    function updateRewards ( address account ) external {}
}
