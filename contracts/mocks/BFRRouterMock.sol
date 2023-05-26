// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../interfaces/bfr/IBFRRouter.sol";
import "../interfaces/bfr/IBFRTracker.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BFRRouterMock is IBFRRouter {
    address public feeBlpTrackerAddress;
    address public feeBfrTrackerAddress;
    address public stakedBfrTrackerAddress;
    address public blpManagerAddress;
    address public bfrTokenAddress;

    mapping (address => uint256) public stakedBfrAmounts;

    constructor(
        address _bfrToken,
        address _feeBlpTracker,
        address _feeBfrTracker,
        address _stakedBfrTracker,
        address _blpManager
    ) {
        feeBlpTrackerAddress = _feeBlpTracker;
        feeBfrTrackerAddress = _feeBfrTracker;
        stakedBfrTrackerAddress = _stakedBfrTracker;
        blpManagerAddress = _blpManager;
        bfrTokenAddress = _bfrToken;
    }

    function stakeBfr(uint256 amount) external override {
        IBFRTracker(stakedBfrTrackerAddress).stakeForAccount(msg.sender, msg.sender, bfrTokenAddress, amount);
    }

    function unstakeBfr(uint256 amount) external override {
        IBFRTracker(stakedBfrTrackerAddress).unstakeForAccount(msg.sender, bfrTokenAddress, amount, msg.sender);
    }

    function compound() external override {
    }

    function claimFees() external override {
        // No implementation needed for mock
    }

    function mintAndStakeBlp(
        address _token,
        uint256 _amount,
        uint256 _minUsdg,
        uint256 _minBlp
    ) external override returns (uint256) {
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        return _amount;
    }

    function feeBfrTracker() external view returns (address) {
        return feeBfrTrackerAddress;
    }

    function stakedBfrTracker() external view returns (address) {
        return stakedBfrTrackerAddress;
    }

    function feeBlpTracker() external view returns (address) {
        return feeBlpTrackerAddress;
    }

    function blpManager() external view returns (address) {
        return blpManagerAddress;
    }

    function deposits(address user) external view returns (uint256) {
        return stakedBfrAmounts[user];
    }
}
