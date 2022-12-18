import "../interfaces/cap/ICapPool.sol";
import "@openzeppelin-4/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin-4/contracts/token/ERC20/utils/SafeERC20.sol";

contract CapPoolMock is ICapPool {
    address immutable token;
    address immutable rewardsContract;
    using SafeERC20 for IERC20;
    
    constructor(address _token, address _rewards) {
        token = _token;
        rewardsContract = _rewards;
    }
    
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    
    mapping(address => uint256) public deposits;
    
    function UNIT () external view override returns ( uint256 ) {
        return 1;
    }

    function creditUserProfit ( address destination, uint256 amount ) external {}

    function currency (  ) external view returns ( address ) {
        return token;
    }
    
    function deposit ( uint256 amount ) external override {
        deposits[msg.sender] += amount;
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        emit Deposit(msg.sender, amount);
    }
    
    function getBalance ( address account ) external view override returns ( uint256 ) {
        return deposits[account];
    }
    function getCurrencyBalance ( address account ) external view override returns ( uint256 ) {
        return deposits[account];
    }

    function getUtilization (  ) external view override returns ( uint256 ) {
        return 0;
    }
    function maxCap (  ) external view override returns ( uint256 ) {
        return 0;
    }
    function minDepositTime (  ) external view override returns ( uint256 ) {
        return 0;
    }
    function openInterest (  ) external view override returns ( uint256 ) {
        return 0;
    }
    function owner (  ) external view override returns ( address )   {
        return address(0);
    }
    
    function rewards (  ) external view override returns ( address ) {
       return rewardsContract;
    }
    
    function router (  ) external view override returns ( address ) {
        return address(0);
    }
    function setOwner ( address newOwner )  external override {}
    function setParams ( uint256 _minDepositTime, uint256 _utilizationMultiplier, uint256 _maxCap, uint256 _withdrawFee ) external override {}
    function setRouter ( address _router ) external override {}
    function totalSupply (  ) external view override returns ( uint256 ) {
        return 0;
    }
    
    function trading (  ) external view override returns ( address ) {
        return address(0);
    }
    function updateOpenInterest ( uint256 amount, bool isDecrease ) external override {}
    function utilizationMultiplier (  ) external view override returns ( uint256 ) {
        return 0;
    }
    
    function withdraw ( uint256 currencyAmount ) external override {
        deposits[msg.sender] -= currencyAmount;
        IERC20(token).transfer(msg.sender, currencyAmount);
        emit Withdraw(msg.sender, currencyAmount);
    }
    function withdrawFee (  ) external view override returns ( uint256 ) {
        return 0;
    }
}
