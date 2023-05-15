// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "./Manager.sol";

abstract contract FeeUtils is Manager{
    uint256 public DEV_FEE;
    uint256 STAKING_FEE = 0;
    uint MAX_FEE;
    function getDevFee() external view returns (uint256) {
        return DEV_FEE;
    }

    function getStakingFee() external view returns (uint256) {
        return STAKING_FEE;
    }

    function setStakingAddress(address _stakingAddress) external onlyOwner {
        stakingAddress = _stakingAddress;
    }

    function setDevFeeAddress(address _devFeeAddress) external onlyOwner {
        devFeeAddress = _devFeeAddress;
    }

    function setDevFee(uint fee) external onlyManagerAndOwner {
        require(fee + STAKING_FEE <= MAX_FEE, "fee too high");
        DEV_FEE = fee;
    }

    function setStakingFee(uint fee) external onlyManagerAndOwner {
        require(fee + DEV_FEE <= MAX_FEE, "fee too high");
        STAKING_FEE = fee;
    }
}
