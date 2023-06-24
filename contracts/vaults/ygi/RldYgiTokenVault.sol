// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../RldTokenVault.sol";

contract RldYgiTokenVault is RldTokenVault {
    using SafeERC20 for IERC20;

    address ygiVault;
    bool initialized;

    constructor(
        string memory _name,
        string memory _symbol,
        address _ygiVault
    ) RldTokenVault(_name, _symbol) {
        ygiVault = _ygiVault;
    }

    modifier onlyYgiVault() {
        require(msg.sender == ygiVault, "Only YGI Vault can call this function");
        _;
    }

    function init(uint256 amountToMint, uint256 amountToDeposit) external onlyYgiVault {
        require(!initialized, "Already initialized");
        initialized = true;
        want().safeTransferFrom(ygiVault, address(this), amountToDeposit);
        earn();
        _mint(ygiVault, amountToMint);
    }

    function directWithdraw(uint256 _amount) external onlyYgiVault {
        strategy.withdraw(_amount);
        want().safeTransfer(ygiVault, _amount);
    }
}
