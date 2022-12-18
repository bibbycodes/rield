// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../../interfaces/common/IUniswapRouterETH.sol";
import "./StrategyGMX.sol";

contract StrategyGMXUniV2 is StrategyGMX {

    // Route
    address[] public nativeToWantRoute;

    constructor(
        address _chef,
        address[] memory _nativeToWantRoute, // [WETH, GMX]
        CommonAddresses memory _commonAddresses
    ) StrategyGMX(_chef, _commonAddresses) {
        native = _nativeToWantRoute[0]; // WETH
        wantToken = _nativeToWantRoute[_nativeToWantRoute.length - 1]; // GMX

        nativeToWantRoute = _nativeToWantRoute;

        _giveAllowances();
    }

    function swapRewards() internal override {
        uint256 nativeBal = IERC20(native).balanceOf(address(this));
        IUniswapRouterETH(unirouter).swapExactTokensForTokens(
            nativeBal, 0, nativeToWantRoute, address(this), block.timestamp
        );
    }

    function nativeToWant() external view override returns (address[] memory) {
        return nativeToWantRoute;
    }
}
