// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "../strategy/ITokenStrategy.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IRldTokenVault is IERC20 {
    function initialize(
        ITokenStrategy _strategy,
        string memory _name,
        string memory _symbol
    ) external;
    function want() external returns (IERC20);
    function decimals() external view returns (uint8);
    function balance() external view returns (uint);
//    function available() public view returns (uint256);
    function getPricePerFullShare() external view returns (uint256);
    function deposit(uint _amount) external;
//    function withdrawAll() external;
    function withdraw(uint256 _shares) external;
}
