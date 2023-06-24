import {SelectedVaultContext, TransactionAction} from "../../contexts/SelectedVaultContext";
import {ToastContext, ToastSeverity} from "../../contexts/ToastContext";
import {BigNumber, ethers} from "ethers";
import * as React from "react";
import {useContext, useState} from "react";
import {Address, useAccount} from "wagmi";
import {usePostHog} from "posthog-js/react";
import {VaultDataContext} from "../../contexts/vault-data-context/VaultDataContext";
import {useGetUserDepositedInVault} from "../../hooks/useGetUserDepositedInVault";
import {LpPoolVault} from "../../lib/types/strategy-types";
import {LpStrategies} from "../../model/strategy";
import {SelectChangeEvent} from "@mui/material";
import {useLpVaultActions} from "../../hooks/useLpVaultActions";
import {useCalculateSendAmount} from "../../hooks/useCalculateSendAmount";
import {TokenPricesContext} from "../../contexts/TokenPricesContext";
import {useLpPoolApprovals, useLpPoolTokensDetails, useLpTokenBalances} from "./utils";

export interface TokenValues {
  address: Address;
  approvals: {
    approve: Function,
    isLoading: boolean,
    isApproved: boolean,
  },
  decimals: number;
  symbol: string;
  balances: {
    value: BigNumber,
    formatted: string
  },
  logoUrl: string
}

export interface TokensByKey {
  [tokenName: string]: TokenValues
}

export interface TokensByAddress {
  [tokenAddress: Address]: TokenValues
}

export const useLpDepositAndWithdrawModal = () => {
  const {action, setAction} = useContext(SelectedVaultContext)
  const {prices, updatePrices} = useContext(TokenPricesContext)
  const selectedVault = LpStrategies[0]
  const {
    vaultAddress,
    inputTokenAddress,
    lp0TokenAddress,
    lp1TokenAddress,
    hasWithdrawalSchedule,
    inputTokenSymbol,
    abi,
    inputTokenDecimals,
    lp0TokenDecimals,
    lp1TokenDecimals,
    lp0CoinGeckoId,
    lp1CoinGeckoId,
  } = selectedVault as LpPoolVault;

  const {address: userAddress} = useAccount();
  const postHog = usePostHog()
  const lp0Price = prices[lp0CoinGeckoId]
  const lp1Price = prices[lp1CoinGeckoId]

  const balances = useLpTokenBalances({
    userAddress: userAddress as Address,
    vaultAddress,
    inputTokenAddress,
    lp0TokenAddress,
    lp1TokenAddress,
  })

  const vaultTokenBalanceBn = balances.vaultTokenBalance?.value

  const [visibleAmounts, setVisibleAmounts] = useState<{ [tokenAddress: Address]: string }>({
    [inputTokenAddress]: '0',
    [lp0TokenAddress]: '0',
    [lp1TokenAddress]: '0'
  })

  const [currentToken, setCurrentToken] = useState<Address>(inputTokenAddress)
  const [depositAs, setDepositAs] = useState<string>(inputTokenSymbol)
  const {vaultsData, refetchForStrategy} = useContext(VaultDataContext)

  const approvals = useLpPoolApprovals({
    inputTokenAddress,
    lp0TokenAddress,
    lp1TokenAddress,
    vaultAddress,
    userAddress: userAddress as Address,
    selectedVault,
    refetchForStrategy
  })

  const {userStaked, fetchUserStaked} = useGetUserDepositedInVault(selectedVault)
  const {setOpen: setOpenToast, setMessage: setToastMessage, setSeverity} = useContext(ToastContext)
  const inputTokenAmount = useCalculateSendAmount(visibleAmounts[inputTokenAddress], action, inputTokenDecimals, userStaked, vaultTokenBalanceBn)
  const lp0Amount = useCalculateSendAmount(visibleAmounts[lp0TokenAddress], action, lp0TokenDecimals, userStaked, vaultTokenBalanceBn)
  const lp1Amount = useCalculateSendAmount(visibleAmounts[lp1TokenAddress], action, lp1TokenDecimals, userStaked, vaultTokenBalanceBn)

  const {tokensByKey, tokensByAddress} = useLpPoolTokensDetails(
    {
      vault: selectedVault,
      vaultsData,
      balances,
      approvals,
      visibleAmounts
    }
  )

  const isDeposit = (action: TransactionAction) => action === 'deposit' || action === 'depositLpTokens'

  const showApprove = () => {
    if (depositAs === inputTokenSymbol) {
      return isDeposit(action) && !tokensByKey.inputToken.approvals.isApproved
    } else {
      return isDeposit(action) && !tokensByKey.lp0Token.approvals.isApproved && !tokensByKey.lp1Token.approvals.isApproved
    }
  }
  const handleSetAction = (onClickAction: 'deposit' | 'withdraw') => {
    const isDepositAsInputToken = depositAs === inputTokenSymbol
    if (onClickAction === 'deposit') {
      setAction(isDepositAsInputToken ? 'deposit' : 'depositLpTokens')
    } else if (onClickAction === 'withdraw') {
      setAction(isDepositAsInputToken ? 'withdraw' : 'withdrawLpTokens')
    } else {
      setAction('deposit')
    }
  }

  const setTokensVisibleAmounts = (tokenAddress: Address, amount: string) => {
    if (depositAs === inputTokenSymbol) {
      return handleSetVisibleAmountForSingleToken(amount, tokenAddress)
    }
    updatePrices(60 * 1000).then(() => {
      if (tokenAddress === lp0TokenAddress) {
        const lp0TokenPriceInDollars = lp0Price * parseFloat(amount)
        const lp1TokVisibleAmount = lp0TokenPriceInDollars / lp1Price
        return handleSetVisibleAmountForMultipleTokens(amount, lp0TokenAddress, lp1TokVisibleAmount.toString(), lp1TokenAddress)
      }

      if (tokenAddress === lp1TokenAddress) {
        const lp1TokenPriceInDollars = lp1Price * parseFloat(amount)
        const lp0TokVisibleAmount = lp1TokenPriceInDollars / lp0Price
        return handleSetVisibleAmountForMultipleTokens(amount, lp1TokenAddress, lp0TokVisibleAmount.toString(), lp0TokenAddress)
      }
    })
  }

  const actions = useLpVaultActions({
    vaultAddress,
    inputTokenAmount,
    abi,
    inputTokenDecimals,
    inputTokenAddress,
    isLp0TokenApproved: tokensByKey.lp0Token.approvals.isApproved,
    isLp1TokenApproved: tokensByKey.lp1Token.approvals.isApproved,
    isInputTokenApproved: tokensByKey.inputToken.approvals.isApproved,
    lp0TokenAddress,
    lp1TokenAddress,
    lp0Amount,
    lp1Amount,
  })

  const handleSetDepositAs = (event: SelectChangeEvent) => {
    setDepositAs(event.target.value as string)
  }

  const getFormattedBalanceForToken = (tokenAddress: Address) => tokensByAddress[tokenAddress]?.balances.formatted ?? '0'
  const getTokenBalanceBn = (tokenAddress: Address) => tokensByAddress[tokenAddress]?.balances.value ?? BigNumber.from('0')
  const getTokenDecimals = (tokenAddress: Address) => tokensByAddress[tokenAddress]?.decimals ?? 18

  const getActionVerbForToast = (action: TransactionAction) => {
    switch (true) {
      case action.includes('deposit'):
        return 'Deposit'
      case action.includes('withdraw'):
        return 'Withdrawal'
      default:
        return action
    }
  }

  const getActionVerb = (action: TransactionAction) => {
    switch (true) {
      case action.includes('deposit'):
        return 'Deposit'
      case action.includes('withdraw'):
        return 'Withdraw'
      default:
        return action
    }
  }

  const performAction = async (action: TransactionAction) => {
    if (parseFloat(visibleAmounts[currentToken]) > 0) {
      const actionVerb = getActionVerbForToast(action)
      const fn = actions[action]?.write
      console.log(fn, actions, action)
      try {
        const tx = await fn?.()
        if (tx?.hash) {
          showToast(`${actionVerb} submitted!`, 'info')
        }
        await tx?.wait()
        showToast(`${actionVerb} successful!`, 'success')
        await fetchUserStaked()
      } catch (e: any) {
        if (e.code === 4001) {
          showToast(`Transaction rejected.`, 'warning')
        } else {
          console.log(e.message)
          showToast(`An unexpected error occurred.`, 'error')
        }
      }
    } else {
      showToast(`Amount must be greater than 0`, 'error')
    }
    // TODO capture amounts based on single or multiple token deposit
    postHog?.capture(`TX_MODAL:${action}`, {action, strategy: selectedVault.name, amount: visibleAmounts[currentToken]})
  }

  function showToast(msg: string, severity: ToastSeverity) {
    setToastMessage(msg)
    setSeverity(severity)
    setOpenToast(true)
  }

  const handleSetMax = (tokenAddress: Address) => {
    if (getTokenBalanceBn(tokenAddress) && tokensByAddress[tokenAddress]?.balances.formatted) {
      const amountToSet = isDeposit(action) ?
        getFormattedBalanceForToken(tokenAddress) :
        (ethers.utils.formatUnits(userStaked, getTokenDecimals(tokenAddress)) ?? '0')
      if (parseFloat(amountToSet) == 0) {
        setTokensVisibleAmounts(tokenAddress, '0.00')
        return
      }
      setTokensVisibleAmounts(tokenAddress, amountToSet)
    }
  }

  const isBalanceLessThanAmount = (value: number, tokenAddress: Address) => {
    const balance = getFormattedBalanceForToken(tokenAddress)
    const formattedUserStaked = getFormattedBalanceForToken(tokensByAddress[vaultAddress]?.address)
    if (balance) {
      const balanceToCheck = (action === 'deposit') ? parseFloat(balance) : parseFloat(formattedUserStaked)
      return !isNaN(value) && balanceToCheck < value
    }
    return false
  }

  const removeLeadingZeros = (value: string) => {
    return value.replace(/^0+(?=\d)/, '')
  }

  const truncateAmount = (value?: string) => {
    const isNullOrUndefined = value == null || value === '';
    const isZero = value === '0';

    if (isNullOrUndefined || isZero) {
      return '0'
    }

    const commaIndex = value.indexOf('.');
    return commaIndex !== -1 ? value.slice(0, commaIndex + 6) : value;
  }

  const handleSetVisibleAmountForSingleToken = (value: string, token: Address = currentToken) => {
    const currentVisibleAmounts = {...visibleAmounts}
    currentVisibleAmounts[token] = removeLeadingZeros(value)
    setVisibleAmounts(currentVisibleAmounts)
  }

  const handleSetVisibleAmountForMultipleTokens = (
    value0: string,
    token0: Address,
    value1: string,
    token1: Address
  ) => {
    const currentVisibleAmounts = {...visibleAmounts}
    currentVisibleAmounts[token0] = removeLeadingZeros(value0)
    currentVisibleAmounts[token1] = removeLeadingZeros(value1)
    setVisibleAmounts(currentVisibleAmounts)
  }
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value.match(/^-{0,1}\d*\.?\d{0,18}/)?.join('')
    const isNullOrUndefined = value == null || value === '';

    if (isNullOrUndefined) {
      setTokensVisibleAmounts(currentToken, '0')
      return
    }
    setTokensVisibleAmounts(currentToken, value)
  }

  return {
    handleAmountChange,
    handleSetMax,
    performAction,
    showApprove,
    isBalanceLessThanAmount,
    truncateAmount,
    userStaked,
    action,
    tokensByKey,
    hasWithdrawalSchedule,
    visibleAmounts,
    setCurrentToken,
    handleSetDepositAs,
    depositAs,
    handleSetAction,
    getActionVerb,
  }
}
