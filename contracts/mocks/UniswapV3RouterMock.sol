// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../interfaces/common/IUniswapRouterV3.sol";
import "../interfaces/common/IUniswapRouterV3WithDeadline.sol";
import "@openzeppelin-4/contracts/token/ERC20/ERC20.sol";
import "../utils/UniswapV3Utils.sol";

contract UniswapV3RouterMock is IUniswapRouterV3WithDeadline {
    constructor(){
    }

    function exactInput(IUniswapRouterV3WithDeadline.ExactInputParams memory params) external payable override returns (uint256 amountOut) {
        ERC20(UniswapV3Utils.pathToRoute(params.path)[1]).transfer(msg.sender, params.amountIn);
        return params.amountIn;
    }

    function exactInputSingle(IUniswapRouterV3WithDeadline.ExactInputSingleParams memory params) external payable override returns (uint256 amountOut) {
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
