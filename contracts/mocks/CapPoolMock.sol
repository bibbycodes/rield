import "../interfaces/cap/ICapPool.sol";
import "@openzeppelin-4/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin-4/contracts/token/ERC20/utils/SafeERC20.sol";

contract CapPoolMock {
    address immutable token;
    address immutable rewardsContract;
    using SafeERC20 for IERC20;
    using Address for address payable;

    constructor(address _token, address _rewards) {
        token = _token;
        rewardsContract = _rewards;
    }

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    mapping(address => uint256) public deposits;

    function UNIT() external view returns (uint256) {
        return 1;
    }

    function creditUserProfit(address destination, uint256 amount) external {}

    function currency() external view returns (address) {
        return token;
    }

    function deposit(uint256 amount) external payable {
        if (token == address(0)) {
            amount = msg.value;
        } else {
            IERC20(token).transferFrom(msg.sender, address(this), amount);
        }
        deposits[msg.sender] += amount;
        emit Deposit(msg.sender, amount);
    }

    function getBalance(address account) external view returns (uint256) {
        return deposits[account];
    }

    function getCurrencyBalance(address account) external view returns (uint256) {
        return deposits[account];
    }

    function getUtilization() external view returns (uint256) {
        return 0;
    }

    function maxCap() external view returns (uint256) {
        return 0;
    }

    function minDepositTime() external view returns (uint256) {
        return 0;
    }

    function openInterest() external view returns (uint256) {
        return 0;
    }

    function owner() external view returns (address)   {
        return address(0);
    }

    function rewards() external view returns (address) {
        return rewardsContract;
    }

    function router() external view returns (address) {
        return address(0);
    }

    function setOwner(address newOwner) external {}

    function setParams(uint256 _minDepositTime, uint256 _utilizationMultiplier, uint256 _maxCap, uint256 _withdrawFee) external {}

    function setRouter(address _router) external {}

    function totalSupply() external view returns (uint256) {
        return 0;
    }

    function trading() external view returns (address) {
        return address(0);
    }

    function updateOpenInterest(uint256 amount, bool isDecrease) external {}

    function utilizationMultiplier() external view returns (uint256) {
        return 0;
    }

    function withdraw(uint256 currencyAmount) external  payable {
        deposits[msg.sender] -= currencyAmount;
        if (token == address(0)) {
            payable(msg.sender).sendValue(currencyAmount);
        } else {
            IERC20(token).transfer(msg.sender, currencyAmount);
        }
        emit Withdraw(msg.sender, currencyAmount);
    }

    function withdrawFee() external view returns (uint256) {
        return 0;
    }
}
