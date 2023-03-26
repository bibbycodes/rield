// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface IVELATokenFarm {
//    uint256 public totalLockedUpRewards;
//    address public immutable esToken;
//    address public immutable claimableToken;
//
//    uint256 public cooldownDuration = 1 weeks;
//    uint256 public totalLockedVestingAmount;
//    uint256 public vestingDuration;
//    uint256[] public tierLevels;
//    uint256[] public tierPercents;
//    mapping(address => uint256) public claimedAmounts;
//    mapping(address => uint256) public unlockedVestingAmounts;
//    mapping(address => uint256) public lastVestingUpdateTimes;
//    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
//    mapping(address => uint256) public lockedVestingAmounts;

    // Function to harvest many pools in a single transaction
    function harvestMany(uint256[] calldata _pids) external;
    function deposit(uint256 _pid, uint256 _amount) external;
    function depositVesting(uint256 _amount) external;
    function emergencyWithdraw(uint256 _pid) external;
    function withdraw(uint256 _pid, uint256 _amount) external;
    function withdrawVesting() external;
    function getTier(uint256 _pid, address _account) external view returns (uint256);
    function getTotalVested(address _account) external view returns (uint256);
    function pendingTokens(
        uint256 _pid,
        address _user
    )
    external
    view
    returns (
        address[] memory addresses,
        string[] memory symbols,
        uint256[] memory decimals,
        uint256[] memory amounts
    );

    function poolLength() external view returns (uint256);
    function poolRewarders(uint256 _pid) external view returns (address[] memory rewarders);
    function poolRewardsPerSec(
        uint256 _pid
    )
    external
    view
    returns (
        address[] memory addresses,
        string[] memory symbols,
        uint256[] memory decimals,
        uint256[] memory rewardsPerSec
    );
    function poolTotalLp(uint256 pid) external view returns (uint256);
    function claimable(address _account) external view returns (uint256);
    function getVestedAmount(address _account) external view returns (uint256);
}
