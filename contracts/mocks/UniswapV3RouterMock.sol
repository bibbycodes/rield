import "../interfaces/common/IUniswapRouterV3.sol";

contract UniswapV3RouterMock is IUniswapRouterV3 {
    constructor(){
    }
    
    function exactInput(IUniswapRouterV3.ExactInputParams memory params) external payable override returns (uint256 amountOut) {
        return 0;
    }

    function exactInputSingle(IUniswapRouterV3.ExactInputSingleParams memory params) external payable override returns (uint256 amountOut) {
        return params.amountIn;
    }

    function exactOutput(IUniswapRouterV3.ExactOutputParams memory params) external payable override returns (uint256 amountIn) {
        return 0;
    }

    function exactOutputSingle(IUniswapRouterV3.ExactOutputSingleParams memory params) external payable override returns (uint256 amountIn) {
        return 0;
    }
}
