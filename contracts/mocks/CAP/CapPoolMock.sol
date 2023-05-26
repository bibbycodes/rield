// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../../interfaces/cap/ICapPool.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "hardhat/console.sol";

contract CapPoolMock {
    address immutable token;
    address immutable rewardsContract;
    using SafeERC20 for IERC20;
    using Address for address payable;
    uint256 UNIT = 10 ** 18;
    uint256 CAP_MULTIPLIER = 10 ** 12;
    uint8 decimals = 6;

    constructor(address _token, address _rewards) {
        token = _token;
        rewardsContract = _rewards;
    }

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    mapping(address => uint256) public deposits;

    function deposit(uint256 amount) external payable {
        if (token == address(0)) {
            amount = msg.value;
        } else {
            amount = amount * (10**decimals) / UNIT;
            IERC20(token).transferFrom(msg.sender, address(this), amount);
        }
        deposits[msg.sender] += amount;
        emit Deposit(msg.sender, amount);
    }

    function getCurrencyBalance(address account) external view returns (uint256) {
        return deposits[account] * CAP_MULTIPLIER;
    }

    function withdraw(uint256 currencyAmount) external  payable {
        currencyAmount = currencyAmount * (10**decimals) / UNIT;
        deposits[msg.sender] -= currencyAmount;
        if (token == address(0)) {
            payable(msg.sender).sendValue(currencyAmount);
        } else {
            IERC20(token).transfer(msg.sender, currencyAmount);
        }
        emit Withdraw(msg.sender, currencyAmount);
    }
}
