// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IYgiBasePoolStrategy {

    struct Route {
        address[] aToBRoute;
        uint24[] aToBFees;
        bytes path;
    }


    struct YgiComponent {
        address inputToken;
        address vault;
        uint256 allocation;
        Route route;
        Route backRoute;
    }

    function ygiInputToken() external view returns (address);
    function totalAllocation() external view returns (uint256);
}

