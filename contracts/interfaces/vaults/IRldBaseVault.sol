// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../strategy/ITokenStrategy.sol";

interface IRldBaseVault is IERC20 {
    function want() external returns (IERC20);
    function decimals() external view returns (uint8);
    function balance() external view returns (uint);
    function getPricePerFullShare() external view returns (uint256);
    function withdraw(uint256 _shares) external;
    function strategy() external view returns (ITokenStrategy);
}
