import {SelectedVaultContext, TransactionAction} from "../../contexts/SelectedVaultContext";
import {ToastContext, ToastSeverity} from "../../contexts/ToastContext";
import {BigNumber, ethers} from "ethers";
import * as React from "react";
import {useContext, useState} from "react";
import {Address, useAccount, useBalance} from "wagmi";
import {usePostHog} from "posthog-js/react";
import {ADDRESS_ZERO} from "../../lib/apy-getter-functions/cap";
import {VaultDataContext} from "../../contexts/vault-data-context/VaultDataContext";
import {useApproveToken} from "../../hooks/useApproveToken";
import {useGetUserDepositedInVault} from "../../hooks/useGetUserDepositedInVault";
import {LpPoolVault} from "../../lib/types/strategy-types";
import {LpStrategies} from "../../model/strategy";
import {isTokenApproved} from "../../lib/utils";
import {SelectChangeEvent} from "@mui/material";
import {useLpVaultActions} from "../../hooks/useLpVaultActions";
import {useCalculateSendAmount} from "../../hooks/useCalculateSendAmount";
import {TokenPricesContext} from "../../contexts/TokenPricesContext";

export interface DepositModalTokenDetails {
  [tokenName: string]: {
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
}

export const useLpDepositAndWithdrawModal = () => {
  const {action, setAction} = useContext(SelectedVaultContext)
  const {prices} = useContext(TokenPricesContext)
  const selectedVault = LpStrategies[0]
  const {
    vaultAddress,
    inputTokenAddress,
    lp0TokenAddress,
    lp1TokenAddress,
    lp0TokenSymbol,
    lp1TokenSymbol,
    lp0TokenLogoUrl,
    lp1TokenLogoUrl,
    inputTokenLogoUrl,
    hasWithdrawalSchedule,
    inputTokenSymbol,
    abi,
    inputTokenDecimals,
    lp0TokenDecimals,
    lp1TokenDecimals,
    lp0CoinGeckoId,
    lp1CoinGeckoId,
    type
  } = selectedVault as LpPoolVault;

  const {address: userAddress} = useAccount();
  const postHog = usePostHog()
  const lp0Price = prices[lp0CoinGeckoId]
  const lp1Price = prices[lp1CoinGeckoId]

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

  const {data: vaultTokenBalanceData} = useBalance({token: vaultAddress, address: userAddress, watch: true})
  const formattedToken0Balance = lp0TokenBalance?.formatted
  const formattedToken1Balance = lp1TokenBalance?.formatted
  const formattedInputTokenBalance = inputTokenBalance?.formatted

  const tokenBalances = {
    [lp0TokenAddress]: lp0TokenBalance,
    [lp1TokenAddress]: lp1TokenBalance,
    [inputTokenAddress]: inputTokenBalance
  }

  const decimalsForTokensMap = {
    [lp0TokenAddress]: lp0TokenDecimals,
    [lp1TokenAddress]: lp1TokenDecimals,
    [inputTokenAddress]: inputTokenDecimals,
  }

  const tokenBalanceBN = lp0TokenBalance?.value
  const vaultTokenBalanceBn = vaultTokenBalanceData?.value

  const [visibleAmounts, setVisibleAmounts] = useState<{ [tokenAddress: Address]: string }>({
    [inputTokenAddress]: '0',
    [lp0TokenAddress]: '0',
    [lp1TokenAddress]: '0'
  })
  const [currentToken, setCurrentToken] = useState<Address>(inputTokenAddress)
  const [depositAs, setDepositAs] = useState<string>(inputTokenSymbol)
  const {vaultsData, refetchForStrategy} = useContext(VaultDataContext)

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

  const {userStaked, fetchUserStaked} = useGetUserDepositedInVault(selectedVault)
  const {setOpen: setOpenToast, setMessage: setToastMessage, setSeverity} = useContext(ToastContext)
  const inputTokenAmount = useCalculateSendAmount(visibleAmounts[inputTokenAddress], action, inputTokenDecimals, userStaked, vaultTokenBalanceBn)
  const lp0Amount = useCalculateSendAmount(visibleAmounts[lp0TokenAddress], action, lp0TokenDecimals, userStaked, vaultTokenBalanceBn)
  const lp1Amount = useCalculateSendAmount(visibleAmounts[lp1TokenAddress], action, lp1TokenDecimals, userStaked, vaultTokenBalanceBn)

  const tokens = {
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

  const showApprove = () => {
    if (depositAs === inputTokenSymbol) {
      return action.includes('deposit') && !tokens.inputToken.approvals.isApproved
    } else {
      return action.includes('deposit') && !tokens.lp0Token.approvals.isApproved && !tokens.lp1Token.approvals.isApproved
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

  const getTokenVisibleAmount = (tokenAddress: Address, amount: string) => {
    if (depositAs === inputTokenSymbol) {
      handleSetVisibleAmountForToken(amount, tokenAddress)
    } else if (tokenAddress === lp0TokenAddress) {
      const lp0TokenPriceInDollars = lp0Price * parseFloat(amount)
      const lp1TokVisibleAmount = lp0TokenPriceInDollars / lp1Price
      handleSetVisibleAmountForToken(lp1TokVisibleAmount.toString(), lp1TokenAddress)
      handleSetVisibleAmountForToken(amount, lp0TokenAddress)
    } else if (tokenAddress === lp1TokenAddress) {
      const lp1TokenPriceInDollars = lp1Price * parseFloat(amount)
      const lp0TokVisibleAmount = lp1TokenPriceInDollars / lp0Price
      handleSetVisibleAmountForToken(lp0TokVisibleAmount.toString(), lp0TokenAddress)
      handleSetVisibleAmountForToken(amount, lp1TokenAddress)
    }
  }

  const actions = useLpVaultActions({
    vaultAddress,
    inputTokenAmount,
    abi,
    inputTokenDecimals,
    inputTokenAddress,
    isLp0TokenApproved: tokens.lp0Token.approvals.isApproved,
    isLp1TokenApproved: tokens.lp1Token.approvals.isApproved,
    isInputTokenApproved: tokens.inputToken.approvals.isApproved,
    lp0TokenAddress,
    lp1TokenAddress,
    lp0Amount,
    lp1Amount,
  })

  const handleSetDepositAs = (event: SelectChangeEvent) => {
    setDepositAs(event.target.value as string)
  }

  const getFormattedBalanceForToken = (tokenAddress: Address) => tokenBalances[tokenAddress]?.formatted ?? '0'
  const getTokenBalanceBn = (tokenAddress: Address) => tokenBalances[tokenAddress]?.value ?? BigNumber.from('0')
  const getTokenDecimals = (tokenAddress: Address) => decimalsForTokensMap[tokenAddress] ?? 18

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
    console.log('performAction', action, inputTokenAmount)
    // TODO fix visible amount
    if (parseFloat(visibleAmount) > 0) {
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
    postHog?.capture(`TX_MODAL:${action}`, {action, strategy: selectedVault.name, amount: visibleAmount})
  }

  function showToast(msg: string, severity: ToastSeverity) {
    setToastMessage(msg)
    setSeverity(severity)
    setOpenToast(true)
  }

  const handleSetMax = (tokenAddress: Address) => {
    if (getTokenBalanceBn(tokenAddress) && formattedToken0Balance) {
      const amountToSet = (action === 'deposit') ?
        getFormattedBalanceForToken(tokenAddress) :
        (ethers.utils.formatUnits(userStaked, getTokenDecimals(tokenAddress)) ?? '0')
      if (parseFloat(amountToSet) == 0) {
        handleSetVisibleAmountForToken('0.00')
        return
      }
      handleSetVisibleAmountForToken(amountToSet, tokenAddress)
    }
  }

  const isBalanceLessThanAmount = (value: number, tokenAddress: Address) => {
    const balance = getTokenBalanceBn(tokenAddress)
    if (balance) {
      const balanceToCheck = (action === 'deposit') ? +ethers.utils.formatUnits(balance, inputTokenDecimals) : +ethers.utils.formatUnits(userStaked, getTokenDecimals(tokenAddress))
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
      return '0.00'
    }

    const commaIndex = value.indexOf('.');
    return commaIndex !== -1 ? value.slice(0, commaIndex + 6) : value;
  }

  const handleSetVisibleAmountForToken = (value: string, token: Address = currentToken) => {
    const currentVisibleAmounts = {...visibleAmounts}
    currentVisibleAmounts[token] = removeLeadingZeros(value)
    setVisibleAmounts(currentVisibleAmounts)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value.match(/^-{0,1}\d*\.?\d{0,18}/)?.join('')
    const isNullOrUndefined = value == null || value === '';

    if (isNullOrUndefined) {
      handleSetVisibleAmountForToken('')
      return
    }
    getTokenVisibleAmount(currentToken, value)
  }

  return {
    handleAmountChange,
    handleSetMax,
    performAction,
    showApprove,
    isBalanceLessThanAmount,
    truncateAmount,
    selectedVault,
    formattedToken0Balance,
    formattedToken1Balance,
    formattedInputTokenBalance,
    userStaked,
    action,
    tokens,
    hasWithdrawalSchedule,
    visibleAmounts,
    currentToken,
    setCurrentToken,
    handleSetDepositAs,
    depositAs,
    handleSetAction,
    getActionVerb,
  }
}
