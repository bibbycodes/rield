pragma solidity ^0.8.0;

import "../../interfaces/ram/ISolidlyPair.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SolidlyPairMock is ISolidlyPair, ERC20 {
//    address public factory;
    address public token0;
    address public token1;
    bool public isStable;
//    uint112 public reserve0;
//    uint112 public reserve1;
//    uint32 public blockTimestampLast;

    constructor(
//        address _factory,
        address _token0,
        address _token1,
        bool _isStable
//        uint112 _reserve0,
//        uint112 _reserve1,
//        uint32 _blockTimestampLast
    ) ERC20("SolidlyPairMock", "SPM_LP") {
//        factory = _factory;
        token0 = _token0;
        token1 = _token1;
        isStable = _isStable;
//        reserve0 = _reserve0;
//        reserve1 = _reserve1;
//        blockTimestampLast = _blockTimestampLast;
    }

    function burn(address to) external override returns (uint256 amount0, uint256 amount1) {
        amount0 = 0;
        amount1 = 0;
    }

    function getReserves() external view override returns (uint112, uint112, uint32) {
        return (1000, 2000, uint32(block.timestamp));
    }

    function stable() external view override returns (bool) {
        return isStable;
    }

    function getAmountOut(uint256 amountIn, address tokenIn) external view override returns (uint256) {
        return amountIn;
    }

    function factory() external view returns (address) {
        return address(0);
    }

    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }

    function mintFor(address recipient, uint256 amount) public {
        _mint(recipient, amount);
    }
}
