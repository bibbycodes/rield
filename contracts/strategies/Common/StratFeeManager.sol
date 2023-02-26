// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin-4/contracts/access/Ownable.sol";
import "@openzeppelin-4/contracts/security/Pausable.sol";
import "../../interfaces/common/IFeeConfig.sol";
import "../../utils/Manager.sol";
import "./PausableTimed.sol";

contract StrategyManager is Manager, PausableTimed {

    struct CommonAddresses {
        address vault;
        address unirouter;
        address owner;
    }

    // common addresses for the strategy
    address public vault;
    address public unirouter;

    event SetUnirouter(address unirouter);

    constructor(
        CommonAddresses memory _commonAddresses
    ) {
        vault = _commonAddresses.vault;
        unirouter = _commonAddresses.unirouter;
        transferOwnership(_commonAddresses.owner);
    }

    // set new unirouter
    function setUnirouter(address _unirouter) external onlyOwner {
        unirouter = _unirouter;
        emit SetUnirouter(_unirouter);
    }

    function beforeDeposit() external virtual {}
}
