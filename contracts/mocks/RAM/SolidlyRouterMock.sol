// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;
pragma experimental ABIEncoderV2;

import "../../interfaces/ram/ISolidlyRouter.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockSolidlyRouter is ISolidlyRouter {
    address lpToken;

    constructor(address _lpToken) {
        lpToken = _lpToken;
    }

    function addLiquidity(
        address tokenA,
        address tokenB,
        bool stable,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external override returns (uint amountA, uint amountB, uint liquidity) {
        ERC20(tokenA).transferFrom(msg.sender, address(this), amountADesired);
        ERC20(tokenB).transferFrom(msg.sender, address(this), amountBDesired);
        ERC20(lpToken).transfer(to, amountADesired + amountBDesired);
        return (amountADesired, amountBDesired, amountADesired + amountBDesired);
    }

    function addLiquidityETH(
        address token,
        bool stable,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable override returns (uint amountToken, uint amountETH, uint liquidity) {
        return (amountTokenDesired, msg.value, amountTokenDesired + msg.value);
    }

    function removeLiquidity(
        address tokenA,
        address tokenB,
        bool stable,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external override returns (uint amountA, uint amountB) {
        ERC20(lpToken).transferFrom(msg.sender, address(this), liquidity);
        ERC20(tokenA).transfer(to, liquidity / 2);
        ERC20(tokenB).transfer(to, liquidity / 2);
        return (liquidity / 2, liquidity / 2);
    }

    function removeLiquidityETH(
        address token,
        bool stable,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external override returns (uint amountToken, uint amountETH) {
        return (liquidity / 2, liquidity / 2);
    }

    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        Routes[] memory route,
        address to,
        uint deadline
    ) external override returns (uint[] memory amounts) {
        uint numRoutes = route.length;
        address inputToken = route[0].from;
        address outputToken = route[numRoutes - 1].to;
        amounts = new uint[](numRoutes + 1);
        amounts[0] = amountIn;

        // Get the decimals of the "from" token
        uint8 fromDecimals = ERC20(inputToken).decimals();

        for (uint i = 1; i <= numRoutes; i++) {
            // Get the decimals of the "to" token
            uint8 toDecimals = ERC20(outputToken).decimals();

            // Adjust the amount based on decimals
            amounts[i] = amounts[i - 1] * (10**toDecimals) / (10**fromDecimals);
        }

        uint256 amountOut = amounts[numRoutes];
        // Transfer the tokens
        ERC20(inputToken).transferFrom(msg.sender, address(this), amountIn);
        ERC20(outputToken).transfer(msg.sender, amountOut);
        return amounts;
    }

    function getAmountOut(uint amountIn, address tokenIn, address tokenOut) external view override returns (uint amount, bool stable) {
        return (amountIn * 2, true);
    }

    function getAmountsOut(uint amountIn, Routes[] memory routes) external view override returns (uint[] memory amounts) {
        uint numRoutes = routes.length;
        amounts = new uint[](numRoutes + 1);
        amounts[0] = amountIn;
        for (uint i = 1; i <= numRoutes; i++) {
            amounts[i] = amounts[i - 1] * 2;
        }
        return amounts;
    }

    function quoteAddLiquidity(
        address tokenA,
        address tokenB,
        bool stable,
        uint amountADesired,
        uint amountBDesired
    ) external view override returns (uint amountA, uint amountB, uint liquidity) {
        return (amountADesired, amountBDesired, amountADesired + amountBDesired);
    }
}
