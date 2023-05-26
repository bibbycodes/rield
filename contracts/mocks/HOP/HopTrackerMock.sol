// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "hardhat/console.sol";
import "../../interfaces/hop/IHopTokenTracker.sol";

contract HopTrackerMock is IHopTokenTracker {
    address immutable inputToken;
    address immutable hopToken;
    address immutable lpToken;
    using SafeERC20 for IERC20;
    using Address for address payable;
    uint256 UNIT = 10 ** 18;
    uint256 CAP_MULTIPLIER = 10 ** 12;
    uint8 decimals = 6;

    constructor(address _inputToken, address _hopToken, address _lpToken) {
        inputToken = _inputToken;
        hopToken = _hopToken;
        lpToken = _lpToken;
    }

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    mapping(address => uint256) public deposits;

    function swapStorage() external returns (Swap memory) {
        Swap memory swap = Swap({
        initialA : 0,
        futureA : 0,
        initialATime : 0,
        futureATime : 0,
        swapFee : 0,
        adminFee : 0,
        defaultWithdrawFee : 0,
        lpToken : lpToken
        });
        return swap;
    }

    function addLiquidity(uint256[] memory amounts, uint256 minMintAmount, uint256 deadline) external {
        uint256 amount = amounts[0];
        deposits[msg.sender] += amount;
        IERC20(inputToken).transferFrom(msg.sender, address(this), amount);
        IERC20(lpToken).approve(address(this), type(uint256).max);
        IERC20(lpToken).transferFrom(address(this), msg.sender, amount * 10 ** 12);
        emit Deposit(msg.sender, amount);
    }

    function removeLiquidity(uint256 amount, uint256[] memory minAmounts, uint256 deadline) external {
        deposits[msg.sender] -= amount / 10 ** 12;
        IERC20(lpToken).transferFrom(msg.sender, address(this), amount);
        IERC20(inputToken).transfer(msg.sender, amount / 2 / 10 ** 12);
        IERC20(hopToken).transfer(msg.sender, amount / 2 / 10 ** 12);
        emit Withdraw(msg.sender, amount);
    }

    function getTokenIndex(address _token) external view returns (uint8) {
        if (_token == inputToken) {
            return 0;
        } else if (_token == hopToken) {
            return 1;
        }
        revert();
    }

    function swap(uint8 tokenIndexFrom, uint8 tokenIndexTo, uint256 dx, uint256 minDy, uint256 deadline) external {
        IERC20(hopToken).transferFrom(msg.sender, address(this), dx);
        IERC20(inputToken).transfer(msg.sender, dx);
    }

    function calculateRemoveLiquidity(address account, uint256 amount) external view returns (uint256[] memory) {
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = amount / 2;
        amounts[1] = amount / 2;
        return amounts;
    }

    function calculateSwap(uint8 tokenIndexFrom, uint8 tokenIndexTo, uint256 dx) external view returns (uint256) {
        return dx;
    }

    function calculateTokenAmount(address account, uint256[] memory amounts, bool deposit) external view returns (uint256){
        return amounts[0];
    }
}
