import "../../interfaces/gmx/IGMXTracker.sol";

contract GMXTracker is IGMXTracker {
    constructor() {
        
    }
    function claim(address receiver) external {
        
    }
    function claimable(address user) external view returns (uint256) {
        return 1 ether;
    }
    function depositBalances(address user, address token) external view returns (uint256) {
        return 1 ether;
    }
//    function stakedAmounts(address user) external view returns (uint256);
}
