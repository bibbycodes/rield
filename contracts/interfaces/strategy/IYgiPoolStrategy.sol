// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IYgiBasePoolStrategy.sol";

interface IYgiPoolStrategy is IYgiBasePoolStrategy {
    function deposit(uint _totalAmount) external;
}

