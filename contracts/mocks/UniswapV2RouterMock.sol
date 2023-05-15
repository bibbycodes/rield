// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../interfaces/common/IUniswapRouterETH.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UniswapV2RouterMock is IUniswapRouterETH {
    constructor(){
    }

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity) {
        return (0, 0, 0);
    }

    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity) {
        return (0, 0, 0);
    }

    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB) {
        return (0, 0);
    }

    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountToken, uint amountETH) {
        return (0, 0);
    }

    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts) {
        uint[] memory amounts = new uint[](1);
        IERC20(address(path[path.length - 1])).transfer(to, amountIn);
        amounts[0] = amountIn;
        return amounts;
    }

    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
    external
    payable
    returns (uint[] memory amounts){
        uint[] memory amounts = new uint[](1);
        return amounts;
    }

    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
    external
    returns (uint[] memory amounts) {
        uint[] memory amounts = new uint[](1);
        amounts[0] = (amountIn);
        return amounts;
    }

    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts) {
        uint[] memory amounts = new uint[](1);
        amounts[0] = (amountIn);
        return amounts;
    }
}
