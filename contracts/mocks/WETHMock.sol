// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WETHMock is ERC20 {


    constructor() ERC20('WETH', 'WETH') {
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }

    function mintFor(address recipient, uint256 amount) public {
        _mint(recipient, amount);
    }

    function deposit() public payable {
        _mint(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) public {
        _burn(msg.sender, amount);
        payable(msg.sender).transfer(amount);
    }

}
