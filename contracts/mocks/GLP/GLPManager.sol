import "../../interfaces/gmx/IGLPManager.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GLPManager is IGLPManager, ERC20 {
    constructor() ERC20("GLP", "GLP") {}

    function addLiquidityForAccount(address _fundingAccount, address _account, address _token, uint256 _amount, uint256 _minUsdg, uint256 _minGlp) external returns (uint256) {
        ERC20(_token).transferFrom(_fundingAccount, address(this), _amount);
        _mint(_fundingAccount, _amount);
        return _amount;
    }

    function mintFor(address to, uint256 amount) external {
        _mint(to, amount);
    }

}
