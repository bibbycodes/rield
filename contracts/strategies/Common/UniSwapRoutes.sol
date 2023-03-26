// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin-4/contracts/access/Ownable.sol";
import "@openzeppelin-4/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../utils/UniswapV3Utils.sol";

abstract contract UniSwapRoutes is Ownable {
    using SafeERC20 for IERC20;

    struct Route {
        address[] aToBRoute;
        uint24[] aToBFees;
        bytes path;
    }

    mapping(address => Route) public routesByToken;
    address public unirouter;
    address[] tokens;

    function swapReward(address token) internal {
        uint256 tokenBalance = IERC20(token).balanceOf(address(this));
        if (tokenBalance > 0) {
            UniswapV3Utils.swap(unirouter, routesByToken[token].path, tokenBalance);
        }
    }

    // todo: remove token allowance?
    function registerRoute(address[] memory route, uint24[] memory fee) public onlyOwner {
        bytes memory path = UniswapV3Utils.routeToPath(route, fee);
        routesByToken[route[0]] = Route(route, fee, path);
        IERC20(route[0]).safeApprove(unirouter, type(uint).max);
    }

    function setUniRouter(address _unirouter) public onlyOwner {
        unirouter = _unirouter;
    }

    function setTokens(address[] memory _tokens) public onlyOwner {
        tokens = _tokens;
    }

    function swapRewards() public {
        for (uint i = 0; i < tokens.length; i++) {
            swapReward(tokens[i]);
        }
    }
}
