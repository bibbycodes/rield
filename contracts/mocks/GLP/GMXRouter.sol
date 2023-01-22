import "../../interfaces/gmx/IGMXRouter.sol";
import "../../interfaces/gmx/IGLPManager.sol";
import "@openzeppelin-4/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin-4/contracts/token/ERC20/utils/SafeERC20.sol";


contract GMXRouter is IGMXRouter {
    address glpTracker;
    address gmxTracker;
    address glpMan;
    address rewardToken;
    address gmx;

    constructor(
        address _feeGlpTracker, 
        address _feeGmxTracker, 
        address _glpManager,
        address _rewardToken,
        address _gmx
    ) {
        glpTracker = _feeGlpTracker;
        gmxTracker = _feeGmxTracker;
        glpMan = _glpManager;
        rewardToken = _rewardToken;
        gmx = _gmx;
    }

    event Staked(address indexed user, uint256 amount);
    event UnStaked(address indexed user, uint256 amount);
    event Compound(address indexed user, uint256 amount);
    event Claimed(address indexed user, uint256 amount);
    
    using SafeERC20 for ERC20;

    mapping(address => uint256) public gmxBalances;

    function feeGlpTracker() external view returns (address) {
        return glpTracker;
    }
    function feeGmxTracker() external view returns (address) {
        return gmxTracker;
    }
    
    function glpManager() external view returns (address) {
        return glpMan;
    }

    function glp() external view override returns (address) {
        return glpMan;
    }

    function stakedGmxTracker() external view override returns (address) {
        return address(this);
    }

    function stakeGmx(uint256 amount) external override {
        gmxBalances[msg.sender] += amount;
        IERC20(gmx).transferFrom(msg.sender, address(this), amount);
        emit Staked(msg.sender, amount);
    }

    function unstakeGmx(uint256 amount) external override {
        gmxBalances[msg.sender] -= amount;
        IERC20(gmx).transfer(msg.sender, amount);
        emit UnStaked(msg.sender, amount);
    }

    function compound() external override {
        uint256 amount = gmxBalances[msg.sender];
        uint256 extraAmount = amount / 10;
        gmxBalances[msg.sender] += extraAmount;
        emit Compound(msg.sender, extraAmount);
    }
    
    function unstakeAndRedeemGlp(
        address _tokenOut,
        uint256 _glpAmount,
        uint256 _minOut,
        address _receiver
    ) external override returns (uint256) {
        return 0;
    }
    
    function claimFees() external override {
        ERC20(rewardToken).safeTransfer(msg.sender, 1 ether);
    }

    function claim(address receiver) external {
        IERC20(rewardToken).transfer(msg.sender, 1 ether);
        emit Claimed(msg.sender, 1 ether);
    }

    function mintAndStakeGlp(address _token, uint256 _amount, uint256 _minUsdg, uint256 _minGlp) external returns (uint256) {
        require(_amount > 0, "RewardRouter: invalid _amount");
        IGLPManager(glpMan).addLiquidityForAccount(msg.sender, msg.sender, _token, _amount, _minUsdg, _minGlp);
        return _amount;
    }

    function depositBalances(address user, address token) external view returns (uint256) {
        return gmxBalances[user];
    }

    function stakedAmounts(address user) external view returns (uint256) {
        return gmxBalances[user];
    }

    function signalTransfer(address _receiver) external override {
    }

    function acceptTransfer(address _sender) external override {
    }
}
