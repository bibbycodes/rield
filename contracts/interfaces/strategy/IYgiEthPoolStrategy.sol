// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IYgiBasePoolStrategy.sol";

interface IYgiEthPoolStrategy is IYgiBasePoolStrategy {
    function deposit() payable external;
}

