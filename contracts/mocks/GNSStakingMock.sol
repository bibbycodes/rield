// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../interfaces/common/IUniswapRouterV3.sol";
import "../interfaces/common/IUniswapRouterV3WithDeadline.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../utils/UniswapV3Utils.sol";
import "../interfaces/gns/IGNSStakingProxy.sol";

contract GNSStakingMock is IGNSStakingProxy {

    address immutable gns;
    address immutable rewardToken;
    mapping(address => uint256) public gnsBalances;

    event Harvest(address indexed user, uint256 amount);
    event Staked(address indexed user, uint256 amount);
    event UnStaked(address indexed user, uint256 amount);
    constructor(address _gns, address _rewardToken) {
        gns = _gns;
        rewardToken = _rewardToken;
    }
    function stakeTokens(uint256 _amount) external {
        gnsBalances[msg.sender] += _amount;
        IERC20(gns).transferFrom(msg.sender, address(this), _amount);

        emit Staked(msg.sender, _amount);
    }

    function unstakeTokens(uint256 _amount) external {
        gnsBalances[msg.sender] -= _amount;
        IERC20(gns).transfer(msg.sender, _amount);
        emit UnStaked(msg.sender, _amount);
    }

    function harvest() external {
        uint256 amount = gnsBalances[msg.sender];
        uint256 extraAmount = amount / 10;
        ERC20(rewardToken).transfer(msg.sender, extraAmount);
        emit Harvest(msg.sender, extraAmount);
    }

    function users(address _user) external view returns (
        uint256 stakedTokens,
        uint256 debtDai,
        uint256 stakedNftsCount,
        uint256 totalBoostTokens,
        uint256 harvestedRewardsDai
    ) {
        return (gnsBalances[_user], 0, 0, 0, 0);
    }

}
