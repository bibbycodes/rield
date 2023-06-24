// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./IRldBaseVault.sol";

interface IRldYgiBaseVault is IRldBaseVault {
    function directWithdraw(uint256 _amount) external;
}
