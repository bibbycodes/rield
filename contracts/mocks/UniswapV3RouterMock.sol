// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../interfaces/common/IUniswapRouterV3.sol";
import "../interfaces/common/IUniswapRouterV3WithDeadline.sol";
import "@openzeppelin-4/contracts/token/ERC20/ERC20.sol";
import "../utils/UniswapV3Utils.sol";
import "hardhat/console.sol";

contract UniswapV3RouterMock is IUniswapRouterV3WithDeadline {
    constructor(){
    }

    function exactInput(IUniswapRouterV3WithDeadline.ExactInputParams memory params) external payable override returns (uint256 amountOut) {
        uint8 decimalsIn = ERC20(UniswapV3Utils.pathToRoute(params.path)[0]).decimals();
        uint8 decimalsOut = ERC20(UniswapV3Utils.pathToRoute(params.path)[1]).decimals();
        ERC20(UniswapV3Utils.pathToRoute(params.path)[0]).transferFrom(msg.sender, address(this), params.amountIn);
        if (decimalsIn > decimalsOut) {
            params.amountIn = params.amountIn / (10 ** (decimalsIn - decimalsOut));
        } else if (decimalsIn < decimalsOut) {
            params.amountIn = params.amountIn * (10 ** (decimalsOut - decimalsIn));
        }
        ERC20(UniswapV3Utils.pathToRoute(params.path)[1]).transfer(msg.sender, params.amountIn);
        return params.amountIn;
    }

    function exactInputSingle(IUniswapRouterV3WithDeadline.ExactInputSingleParams memory params) external payable override returns (uint256 amountOut) {
        ERC20(params.tokenIn).transferFrom(msg.sender, address(this), params.amountIn);
        ERC20(params.tokenOut).transfer(msg.sender, params.amountIn);
        return params.amountIn;
    }

    function exactOutput(IUniswapRouterV3WithDeadline.ExactOutputParams memory params) external payable override returns (uint256 amountIn) {
        return 0;
    }

    function exactOutputSingle(IUniswapRouterV3WithDeadline.ExactOutputSingleParams memory params) external payable override returns (uint256 amountIn) {
        return 0;
    }
}
