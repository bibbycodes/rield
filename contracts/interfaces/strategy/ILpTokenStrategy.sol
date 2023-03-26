// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "./ITokenStrategy.sol";

interface ILpTokenStrategy is ITokenStrategy  {
    function inputToken() external view returns (IERC20Upgradeable);
}

