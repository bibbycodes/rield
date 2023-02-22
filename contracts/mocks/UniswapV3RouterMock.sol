// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../interfaces/common/IUniswapRouterV3.sol";
import "../interfaces/common/IUniswapRouterV3WithDeadline.sol";

contract UniswapV3RouterMock is IUniswapRouterV3WithDeadline {
    constructor(){
    }

    function exactInput(IUniswapRouterV3WithDeadline.ExactInputParams memory params) external payable override returns (uint256 amountOut) {
        return params.amountIn;
    }

    function exactInputSingle(IUniswapRouterV3WithDeadline.ExactInputSingleParams memory params) external payable override returns (uint256 amountOut) {
        return params.amountIn;
    }

    function exactOutput(IUniswapRouterV3WithDeadline.ExactOutputParams memory params) external payable override returns (uint256 amountIn) {
        return 0;
    }

    function exactOutputSingle(IUniswapRouterV3WithDeadline.ExactOutputSingleParams memory params) external payable override returns (uint256 amountIn) {
        return 0;
    }
}
