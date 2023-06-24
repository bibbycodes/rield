// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./IRldVault.sol";
import "./IRldYgiBaseVault.sol";

interface IRldYgiVault is IRldVault, IRldYgiBaseVault {
    function init(uint256 amountToMint, uint256 amountToDeposit) external;
}
