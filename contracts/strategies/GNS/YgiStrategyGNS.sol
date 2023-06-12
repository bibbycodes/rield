// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./StrategyGNS.sol";

contract YgiStrategyGNS is StrategyGNS {
    address public ygiVault;

    constructor(
        address _chef,
        address[] memory _rewardToWantRoute,
        uint24[] memory _rewardToWantFees,
        CommonAddresses memory _commonAddresses,
        address _ygiVault
    ) StrategyGNS(_chef, _rewardToWantRoute, _rewardToWantFees, _commonAddresses) {
        ygiVault = _ygiVault;
    }

    function beforeWithdraw() internal virtual override {
        require(msg.sender == vault || msg.sender == ygiVault, "!vault");
    }
}
