// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../interfaces/bfr/IBFRTracker.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract BFRTrackerMock is IBFRTracker {
    using SafeERC20 for ERC20;

    mapping(address => uint256) private _claimable;
    mapping(address => mapping(address => uint256)) public _depositBalances;
    address bfrTokenAddress;
    address rewardTokenAddress;

    constructor(address _bfrToken, address _rewardToken) {
        bfrTokenAddress = _bfrToken;
        rewardTokenAddress = _rewardToken;
    }

    function setClaimable(address user, uint256 amount) external {
        _claimable[user] = amount;
    }

    function setDepositBalance(address user, address token, uint256 amount) external {
        _depositBalances[user][token] = amount;
    }

    function claim(address receiver) external override {
        console.log(rewardTokenAddress);
        _claimable[receiver] += 1000000;
        uint256 amount = _claimable[receiver];
        _claimable[receiver] = 0;
        ERC20 token = ERC20(address(rewardTokenAddress));
        token.transfer(receiver, amount);
    }

    function claimable(address user) external view override returns (uint256) {
        return _claimable[user];
    }

    function depositBalances(address user, address token) external view override returns (uint256) {
        return _depositBalances[user][token];
    }

    function stakeForAccount(
        address _fundingAccount,
        address _account,
        address _depositToken,
        uint256 _amount
    ) external override {
        ERC20(_depositToken).safeTransferFrom(_fundingAccount, address(this), _amount);
        _depositBalances[_account][_depositToken] += _amount;
    }

    function unstakeForAccount (
        address _account,
        address _depositToken,
        uint256 _amount,
        address _receiver
    ) external override {
        require(_depositBalances[_account][_depositToken] >= _amount, "BFRTracker: Insufficient balance");
        _depositBalances[_account][_depositToken] -= _amount;
        ERC20(_depositToken).safeTransfer(_receiver, _amount);
    }
}
