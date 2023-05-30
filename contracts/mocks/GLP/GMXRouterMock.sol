// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../../interfaces/gmx/IGMXRouter.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../interfaces/gmx/IGMXTracker.sol";

contract GMXRouterMock is IGMXRouter, IGMXTracker {
    address immutable gmx;
    address immutable rewardToken;
    constructor(address _gmx, address _rewardToken) {
        gmx = _gmx;
        rewardToken = _rewardToken;
    }

    event Staked(address indexed user, uint256 amount);
    event UnStaked(address indexed user, uint256 amount);
    event Compound(address indexed user, uint256 amount);
    event Claimed(address indexed user, uint256 amount);

    using SafeERC20 for IERC20;

    mapping(address => uint256) public gmxBalances;

    function stakeGmx(uint256 amount) external override {
        gmxBalances[msg.sender] += amount;
        IERC20(gmx).transferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    function unstakeGmx(uint256 amount) external override {
        gmxBalances[msg.sender] -= amount;
        IERC20(gmx).transfer(msg.sender, amount);
        emit UnStaked(msg.sender, amount);
    }

    function compound() external override {
        uint256 amount = gmxBalances[msg.sender];
        uint256 extraAmount = amount / 10;
        IERC20(rewardToken).transfer(msg.sender, extraAmount);
        emit Compound(msg.sender, extraAmount);
    }

    function claimFees() external override {
    }

    function mintAndStakeGlp(
        address _token,
        uint256 _amount,
        uint256 _minUsdg,
        uint256 _minGlp
    ) external override returns (uint256) {
        return 0;
    }

    function unstakeAndRedeemGlp(
        address _tokenOut,
        uint256 _glpAmount,
        uint256 _minOut,
        address _receiver
    ) external override returns (uint256) {
        return 0;
    }

    function feeGlpTracker() external view override returns (address) {}

    function feeGmxTracker() external view override returns (address) {
        return address(this);
    }

    function stakedGmxTracker() external view override returns (address) {
        return address(this);
    }

    function glpManager() external view override returns (address) {
        return address(this);
    }

    function glp() external view override returns (address) {
    }

    function signalTransfer(address _receiver) external override {
    }

    function acceptTransfer(address _sender) external override {
    }

    function claim(address receiver) external {
        emit Claimed(msg.sender, 1 ether);
    }

    function claimable(address user) external view returns (uint256) {
        return 0;
    }
    function depositBalances(address user, address token) external view returns (uint256) {
        return gmxBalances[user];
    }

    function stakedAmounts(address user) external view returns (uint256) {
        return gmxBalances[user];
    }

}
