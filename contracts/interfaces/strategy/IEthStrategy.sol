// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./IBaseStrategy.sol";

interface IEthStrategy is IBaseStrategy {
    function deposit() payable external;
}

