pragma solidity >=0.7.0 <0.9.0;

interface ITNDRewardRouter {
    event StakeTnd(address account, address token, uint256 amount);
    event UnstakeTnd(address account, address token, uint256 amount);

    function acceptTransfer(address _sender) external;

    function batchCompoundForAccounts(address[] memory _accounts) external;

    function batchStakeTndForAccount(address[] memory _accounts, uint256[] memory _amounts) external;

    function bnTnd() external view returns (address);

    function bonusTndTracker() external view returns (address);

    function claim() external;

    function claimEsTnd() external;

    function claimFees() external;

    function compound() external;

    function compoundForAccount(address _account) external;

    function esTnd() external view returns (address);

    function feeTndTracker() external view returns (address);

    function gov() external view returns (address);

    function handleRewards(bool _shouldClaimTnd, bool _shouldStakeTnd, bool _shouldClaimEsTnd, bool _shouldStakeEsTnd, bool _shouldStakeMultiplierPoints, bool _shouldClaimWeth, bool _shouldConvertWethToEth) external;

    function initialize(address _weth, address _tnd, address _esTnd, address _bnTnd, address _stakedTndTracker, address _bonusTndTracker, address _feeTndTracker, address _tndVester, address _unitroller) external;

    function isInitialized() external view returns (bool);

    function pendingReceivers(address) external view returns (address);

    function setGov(address _gov) external;

    function signalTransfer(address _receiver) external;

    function stakeEsTnd(uint256 _amount) external;

    function stakeTnd(uint256 _amount) external;

    function stakeTndForAccount(address _account, uint256 _amount) external;

    function stakedTndTracker() external view returns (address);

    function tnd() external view returns (address);

    function tndVester() external view returns (address);

    function unitroller() external view returns (address);

    function unstakeEsTnd(uint256 _amount) external;

    function unstakeTnd(uint256 _amount) external;

    function weth() external view returns (address);

    function withdrawToken(address _token, address _account, uint256 _amount) external;

    receive() external payable;
}
