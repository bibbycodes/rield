// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../../utils/UniswapV3Utils.sol";
import "./StrategyGMXUniV3.sol";

contract YgiStrategyGMXUniV3 is StrategyGMXUniV3 {
    address public ygiVault;

    constructor(
        address _chef, // GmxRewards
        address[] memory _nativeToWantRoute, // [WETH, GMX]
        uint24[] memory _nativeToWantFees,
        CommonAddresses memory _commonAddresses,
        address _ygiVault
    ) StrategyGMXUniV3(_chef, _nativeToWantRoute, _nativeToWantFees, _commonAddresses) {
        ygiVault = _ygiVault;
    }

    function beforeWithdraw() internal virtual override {
        require(msg.sender == vault || msg.sender == ygiVault, "!vault");
    }
}
