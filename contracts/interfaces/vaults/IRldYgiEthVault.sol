// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./IRldEthVault.sol";
import "./IRldYgiBaseVault.sol";

interface IRldYgiEthVault is IRldEthVault, IRldYgiBaseVault {
    function init(uint256 amountToMint) external payable;
}
