// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "../interfaces/strategy/ITokenStrategy.sol";
import "./RldTokenVault.sol";
import "../interfaces/vaults/IRldTokenVault.sol";
import "../utils/UniswapV3Utils.sol";
import "hardhat/console.sol";

/**
 * @dev Implementation of a vault to deposit funds for yield optimizing.
 * This is the contract that receives funds and that users interface with.
 * The yield optimizing strategy itself is implemented in a separate 'Strategy.sol' contract.
 */
contract RldYieldGeneratingIndexVault is ERC20Upgradeable, OwnableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    struct VaultDetails {
        string name;
        address want;
        address strategyAddress;
        address vaultAddress;
        uint24[] uniFee;
        uint256 weight;
        uint256 index;
    }

    mapping(address => VaultDetails) public addressToVaultDetails;
    VaultDetails[] public vaults;
    address inputTokenAddress;
    address uniRouter;
    uint256 MULTIPLIER;
    uint256 DIVISOR = 10 ** (decimals() + 10);

    function initialize(
        string memory _name,
        string memory _symbol,
        address _inputTokenAddress,
        address _uniRouter
    ) public initializer {
        __ERC20_init(_name, _symbol);
        __Ownable_init();
        __ReentrancyGuard_init();
        inputTokenAddress = _inputTokenAddress;
        uniRouter = _uniRouter;
        _giveAllowance(uniRouter, inputTokenAddress);
        MULTIPLIER = decimals() - inputTokenDecimals();
        MULTIPLIER = decimals() - inputTokenDecimals();
    }

    function wants() public view returns (address[] memory) {
        address[] memory wants = new address[](vaults.length);
        for (uint i = 0; i < vaults.length; i++) {
            VaultDetails memory vault = vaults[i];
            wants[i] = vault.want;
        }
        return wants;
    }
    
    function totalAllocation() public view returns (uint256) {
        uint256 totalAllocation = 0;
        for (uint i = 0; i < vaults.length; i++) {
            VaultDetails memory vault = vaults[i];
            totalAllocation += vault.weight;
        }
        return totalAllocation;
    }

    function inputToken() public view returns (IERC20Upgradeable) {
        return IERC20Upgradeable(inputTokenAddress);
    }
    
    function inputTokenDecimals() public view returns (uint8) {
        return ERC20Upgradeable(inputTokenAddress).decimals();
    }

    function wantForVault(address vaultAddress) public view returns (IERC20Upgradeable) {
        VaultDetails memory vault = addressToVaultDetails[vaultAddress];
        ITokenStrategy strategy = ITokenStrategy(vault.strategyAddress);
        return IERC20Upgradeable(address(strategy.want()));
    }

    function decimalsForVault(address vaultAddress) public view returns (uint8) {
        IRldTokenVault vault = IRldTokenVault(vaultAddress);
        return vault.decimals();
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function balanceOfVault(address vaultAddress) public view returns (uint) {
        IRldTokenVault vault = IRldTokenVault(vaultAddress);
        return vault.balance();
    }

    function balances() public view returns (uint256[] memory) {
        uint256[] memory _balances = new uint256[](vaults.length);
        for (uint i = 0; i < vaults.length; i++) {
            _balances[i] = balanceOfVault(vaults[i].vaultAddress);
        }
        return _balances;
    }

    function swapTokens(uint256 amount, address fromToken, address toToken, uint24[] memory uniFee) internal returns (uint256) {
        address[] memory _path = new address[](2);
        _path[0] = fromToken;
        _path[1] = toToken;
        bytes memory path = getPathFromRoute(_path, uniFee);
        if (amount > 0) {
            return UniswapV3Utils.swap(uniRouter, path, amount);
        }
        return 0;
    }

    function swapToVaultWantToken(uint256 amount, VaultDetails memory vaultDetails) internal returns (uint256) {
        return swapTokens(amount, inputTokenAddress, vaultDetails.want, vaultDetails.uniFee);
    }
    

    function swapToInputToken(uint256 amount, VaultDetails memory vaultDetails) internal returns (uint256) {
        return swapTokens(amount, vaultDetails.want, inputTokenAddress, vaultDetails.uniFee);
    }

    function getPathFromRoute(address[] memory route, uint24[] memory fee) internal pure returns (bytes memory) {
        return UniswapV3Utils.routeToPath(route, fee);
    }

    function registerVault(
        string calldata name,
        address want,
        address strategyAddress,
        address vaultAddress,
        uint24[] memory uniFee,
        uint256 weight
    ) public onlyOwner {
        VaultDetails memory vaultDetails = VaultDetails(
            name,
            want,
            strategyAddress,
            vaultAddress,
            uniFee,
            weight,
            vaults.length
        );
        vaults.push(vaultDetails);
        addressToVaultDetails[vaultDetails.vaultAddress] = vaultDetails;
        _giveAllowance(vaultAddress, want);
        _giveAllowance(uniRouter, want);
    }

//    // TODO deal with any remaining rewards    
//    function removeVault(address vaultAddress) public onlyOwner {
//        VaultDetails memory vault = addressToVaultDetails[vaultAddress];
//        IRldTokenVault vaultContract = IRldTokenVault(vaultAddress);
//        delete vaults[vault.index];
//        
//        ITokenStrategy(vault.strategyAddress).harvest();
//        vaultContract.withdrawAll();
//        for (uint i = vault.index; i < vaults.length - 1; i++) {
//            VaultDetails memory _vault = vault[i];
//            vaults[i] = vaults[i + 1];
//            _vault.index = i + 1;
//        }
//        
//        removedVaultWantBalance = IERC20(vaultDetails.want).balanceOf(address(this));
//        
//        
//        for (uint i = 0; i < vaults.length; i++) {
//            VaultDetails memory _vault = vault[i];
//            IRldTokenVault _vaultContract = IRldTokenVault(_vault.vaultAddress);
//            amountToSwap = _vault.weight * removedVaultWantBalance / totalAllocation();
//        }
//    }

    /**
     * @dev Custom logic in here for how much the vault allows to be borrowed.
     * We return 100% of tokens for now. Under certain conditions we might
     * want to keep some of the system funds at hand in the vault, instead
     * of putting them to work.
     */
    function available() public view returns (uint256) {
        return inputToken().balanceOf(address(this));
    }

    function getPricePerFullShareForVault(address vaultAddress) public view returns (uint256) {
        return IRldTokenVault(vaultAddress).getPricePerFullShare();
    }

    /**
     * @dev A helper function to call deposit() with all the sender's funds.
     */
    function depositAll() external {
        deposit(inputToken().balanceOf(msg.sender));
    }

    function balance() public view returns (uint256) {
        uint256 vaultBalances = 0;
        uint256 thisBalance = inputToken().balanceOf(address(this));
        for (uint i = 0; i < vaults.length; i++) {
            vaultBalances += inputToken().balanceOf((vaults[i].vaultAddress));
        }
        return vaultBalances + thisBalance;
    }

    function balanceOfVaultTokens() public view returns (uint256) {
        uint256 vaultBalances = 0;
        for (uint i = 0; i < vaults.length; i++) {
            IERC20Upgradeable vaultToken = IERC20Upgradeable(address(vaults[i].vaultAddress));
            vaultBalances += vaultToken.balanceOf(address(this));
        }
        return vaultBalances;
    }

    /** @dev deposit into underlying vault
     * @param vaultAddress address of vault to deposit into
     * @param amount of vault specific want to deposit
     */
    function depositIntoVault(address vaultAddress, uint256 amount) internal {
        IRldTokenVault vault = IRldTokenVault(vaultAddress);
        vault.deposit(amount);
    }

    /**
     * @dev The entrypoint of funds into the system. People deposit with this function
     * into the vault. The vault is then in charge of sending funds into the strategy.
     */
    function deposit(uint _amount) public nonReentrant {
        inputToken().safeTransferFrom(msg.sender, address(this), _amount);
        uint256 beforeBalance = balanceOfVaultTokens();
        earn();
        uint256 sharesToMint = balanceOfVaultTokens() - beforeBalance;
        _mint(msg.sender, sharesToMint);
    }

    function _giveAllowance(address spender, address token) internal {
        IERC20Upgradeable(token).safeApprove(spender, type(uint).max);
    }

    /**
     * @dev Function to send funds into the strategy and put them to work. It's primarily called
     * by the vault's deposit() function.
     */
    function earn() public {
        uint _bal = available();
        for (uint i = 0; i < vaults.length; i++) {
            uint256 weight = vaults[i].weight;
            uint256 amount = ((_bal * 10 ** MULTIPLIER) / (totalAllocation() / weight)) / 10 ** MULTIPLIER;
            uint amountSwapped = swapToVaultWantToken(amount, vaults[i]);
            uint256 vaultWantTokenBalance = IERC20(vaults[i].want).balanceOf(address(this));
            if (vaultWantTokenBalance > 0) {
                depositIntoVault(vaults[i].vaultAddress, vaultWantTokenBalance);
            }
        }
    }

    /**
     * @dev A helper function to call withdraw() with all the sender's funds.
     */
    function withdrawAll() external {
        withdraw(balanceOf(msg.sender));
    }

    /**
     * @dev Function to exit the system. The vault will withdraw the required tokens
     * from the strategy and pay up the token holder. A proportional number of IOU
     * tokens are burned in the process.
     */
    function withdraw(uint256 _shares) public nonReentrant {
        uint256 userShareOfMasterVault = _shares * DIVISOR / totalSupply();
        _burn(msg.sender, _shares);
        uint256 withdrawnAmount = 0;

        for (uint i = 0; i < vaults.length; i++) {
            uint256 weight = vaults[i].weight;
            VaultDetails memory vaultDetails = vaults[i];
            IRldTokenVault vault = IRldTokenVault(vaultDetails.vaultAddress);
            uint256 beforeVaultWantBalance = vault.want().balanceOf(address(this));
            uint256 currentVaultTokenBalance = IERC20(vaultDetails.vaultAddress).balanceOf(address(this));
            uint256 userSharesOfVault = (userShareOfMasterVault * currentVaultTokenBalance) / DIVISOR;
            uint256 amountToWithdraw = 0;

            if (userSharesOfVault > currentVaultTokenBalance) {
                amountToWithdraw = userSharesOfVault - currentVaultTokenBalance;
            } else {
                amountToWithdraw = userSharesOfVault;
            }
            
            vault.withdraw(amountToWithdraw);
            uint afterVaultWantBalance = vault.want().balanceOf(address(this));

            if (beforeVaultWantBalance > 0) {
                afterVaultWantBalance = afterVaultWantBalance - beforeVaultWantBalance;
                withdrawnAmount += swapToInputToken(afterVaultWantBalance, vaultDetails) + beforeVaultWantBalance;
            } else {
                withdrawnAmount += swapToInputToken(afterVaultWantBalance, vaultDetails);
            }
        }

        inputToken().safeTransfer(msg.sender, withdrawnAmount);
    }


    //    /**
    //     * @dev Rescues random funds stuck that the strat can't handle.
    //     * @param _token address of the token to rescue.
    //     */
        function inCaseTokensGetStuck(address _token) external onlyOwner {
            for (uint i = 0; i < vaults.length; i++) {
                require(_token != address(vaults[i].want), "!token");
            }

            uint256 amount = IERC20Upgradeable(_token).balanceOf(address(this));
            IERC20Upgradeable(_token).safeTransfer(msg.sender, amount);
        }
}
