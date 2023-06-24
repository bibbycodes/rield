import {Address, useBalance} from "wagmi";
import {useApproveToken} from "../../hooks/useApproveToken";
import {LpPoolVault, RldVault} from "../../lib/types/strategy-types";
import {ADDRESS_ZERO} from "../../lib/apy-getter-functions/cap";
import {isTokenApproved} from "../../lib/utils";
import {BigNumber} from "ethers";
import {VaultsData} from "../../contexts/vault-data-context/VaultDataContext";
import {TokensByAddress, TokensByKey} from "./useLpDepositAndWithdrawModal";

export interface AddressMap {
  [address: string]: Address
}

export const useLpPoolApprovals = ({
                                     inputTokenAddress,
                                     lp0TokenAddress,
                                     lp1TokenAddress,
                                     vaultAddress,
                                     userAddress,
                                     selectedVault,
                                     refetchForStrategy
                                   }: {
  inputTokenAddress: Address,
  lp0TokenAddress: Address,
  lp1TokenAddress: Address,
  vaultAddress: Address,
  userAddress: Address,
  selectedVault: RldVault,
  refetchForStrategy: (strategy: RldVault, userAddress: Address) => Promise<void>
}) => {
  const {
    approve: approveInputToken,
    isLoading: approveInputTokenLoading
  } = useApproveToken(inputTokenAddress, vaultAddress, userAddress, selectedVault, refetchForStrategy);

  const {
    approve: approveLp0Token,
    isLoading: approveLp0TokenLoading
  } = useApproveToken(lp0TokenAddress, vaultAddress, userAddress, selectedVault, refetchForStrategy);

  const {
    approve: approveLp1Token,
    isLoading: approveLp1TokenLoading
  } = useApproveToken(lp1TokenAddress, vaultAddress, userAddress, selectedVault, refetchForStrategy);

  return {
    approveInputToken,
    approveInputTokenLoading,
    approveLp0Token,
    approveLp0TokenLoading,
    approveLp1Token,
    approveLp1TokenLoading,
  }
}

export const useLpTokenBalances = ({
                                     inputTokenAddress,
                                     lp0TokenAddress,
                                     lp1TokenAddress,
                                     vaultAddress,
                                     userAddress
                                   }: AddressMap) => {
  const {data: lp0TokenBalance} = useBalance({
    token: lp0TokenAddress !== ADDRESS_ZERO ? lp0TokenAddress : undefined,
    address: userAddress,
    watch: true
  })

  const {data: lp1TokenBalance} = useBalance({
    token: lp1TokenAddress !== ADDRESS_ZERO ? lp1TokenAddress : undefined,
    address: userAddress,
    watch: true
  })

  const {data: inputTokenBalance} = useBalance({
    token: inputTokenAddress !== ADDRESS_ZERO ? inputTokenAddress : undefined,
    address: userAddress,
    watch: true
  })

  const {data: vaultTokenBalance} = useBalance({token: vaultAddress, address: userAddress, watch: true})
  const formattedVaultTokenBalance = vaultTokenBalance?.formatted
  const formattedToken0Balance = lp0TokenBalance?.formatted
  const formattedToken1Balance = lp1TokenBalance?.formatted
  const formattedInputTokenBalance = inputTokenBalance?.formatted

  return {
    lp0TokenBalance,
    lp1TokenBalance,
    inputTokenBalance,
    vaultTokenBalance,
    formattedInputTokenBalance,
    formattedToken0Balance,
    formattedToken1Balance,
    formattedVaultTokenBalance
  }
}

export const useLpPoolTokensDetails = ({
                                         vault,
                                         visibleAmounts,
                                         vaultsData,
                                         approvals,
                                         balances,
                                       }: {
  vault: LpPoolVault,
  visibleAmounts: any,
  vaultsData: VaultsData,
  approvals: any,
  balances: any,
}): {tokensByKey: TokensByKey, tokensByAddress: TokensByAddress} => {
  const {
    inputTokenAddress,
    lp0TokenAddress,
    lp1TokenAddress,
    vaultAddress,
    lp0TokenDecimals,
    lp1TokenDecimals,
    inputTokenDecimals,
    inputTokenSymbol,
    inputTokenLogoUrl,
    lp0TokenSymbol,
    lp1TokenSymbol,
    lp0TokenLogoUrl,
    lp1TokenLogoUrl,
  } = vault

  const {
    approveInputToken,
    approveInputTokenLoading,
    approveLp0Token,
    approveLp0TokenLoading,
    approveLp1Token,
    approveLp1TokenLoading,
  } = approvals

  const {
    lp0TokenBalance,
    lp1TokenBalance,
    inputTokenBalance,
  } = balances

  const tokensByKey = {
    inputToken: {
      address: inputTokenAddress,
      approvals: {
        approve: approveInputToken,
        isLoading: approveInputTokenLoading,
        isApproved: isTokenApproved('inputTokenAddress', visibleAmounts[lp0TokenAddress], vaultsData[vaultAddress], lp0TokenDecimals)
      },
      decimals: inputTokenDecimals,
      symbol: inputTokenSymbol,
      balances: {
        value: inputTokenBalance?.value ?? BigNumber.from(0),
        formatted: inputTokenBalance?.formatted ?? '0'
      },
      logoUrl: inputTokenLogoUrl
    },
    lp0Token: {
      address: lp0TokenAddress,
      approvals: {
        approve: approveLp0Token,
        isLoading: approveLp0TokenLoading,
        isApproved: isTokenApproved('lp1TokenAddress', visibleAmounts[lp1TokenAddress], vaultsData[vaultAddress], lp1TokenDecimals)
      },
      decimals: lp0TokenDecimals,
      symbol: lp0TokenSymbol,
      balances: {
        value: lp0TokenBalance?.value ?? BigNumber.from(0),
        formatted: lp0TokenBalance?.formatted ?? '0'
      },
      logoUrl: lp0TokenLogoUrl
    },
    lp1Token: {
      address: lp1TokenAddress,
      approvals: {
        approve: approveLp1Token,
        isLoading: approveLp1TokenLoading,
        isApproved: isTokenApproved('lp1TokenAddress', visibleAmounts[lp1TokenAddress], vaultsData[vaultAddress], lp1TokenDecimals)
      },
      decimals: lp1TokenDecimals,
      symbol: lp1TokenSymbol,
      balances: {
        value: lp1TokenBalance?.value ?? BigNumber.from(0),
        formatted: lp1TokenBalance?.formatted ?? '0'
      },
      logoUrl: lp1TokenLogoUrl
    },
  }
  
  const tokensByAddress = {
    [inputTokenAddress]: tokensByKey.inputToken,
    [lp0TokenAddress]: tokensByKey.lp0Token,
    [lp1TokenAddress]: tokensByKey.lp1Token,
  }
  
  return {
    tokensByKey,
    tokensByAddress
  }
}
