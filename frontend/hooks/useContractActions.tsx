import { Address, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { AbiItem } from "web3-utils";
import { BigNumber } from 'ethers';
import { ADDRESS_ZERO } from '../lib/apy-getter-functions/cap';

export interface useContractActionsProps {
  vaultAddress: Address,
  amount: BigNumber,
  abi: AbiItem[],
  decimals: number,
  tokenAddress: Address
}

export function useContractActions({vaultAddress, amount, abi, tokenAddress}: useContractActionsProps) {

  const {config: depositConfig} = usePrepareContractWrite({
    address: vaultAddress,
    functionName: "deposit",
    abi,
    enabled: amount.gt(0),
    args: tokenAddress === ADDRESS_ZERO ? [] : [amount],
    overrides: tokenAddress === ADDRESS_ZERO ? {value: amount} : undefined
  })

  const {data: depositData, writeAsync: depositIntoVault} = useContractWrite(depositConfig)
  const {
    isLoading: isDepositLoading,
    isSuccess: isDepositSuccess,
    isError: isDepositError,
    isFetching: isDepositFetching
  } = useWaitForTransaction({
    hash: depositData?.hash,
  })

  const {config: withdrawConfig} = usePrepareContractWrite({
    address: vaultAddress,
    args: [
      amount
    ],
    functionName: "withdraw",
    abi,
    enabled: amount.gt(0)
  })

  const {data: withdrawData, writeAsync: withdrawFromVault} = useContractWrite(withdrawConfig)
  const {
    isLoading: isWithdrawLoading,
    isSuccess: isWithdrawSuccess,
    isError: isWithdrawError,
    isFetching: isWithdrawFetching
  } = useWaitForTransaction({
    hash: withdrawData?.hash,
  })

  return {
    withdraw: {
      isLoading: isWithdrawLoading,
      isSuccess: isWithdrawSuccess,
      isError: isWithdrawError,
      isFetching: isWithdrawFetching,
      write: withdrawFromVault,
    },
    deposit: {
      isLoading: isDepositLoading,
      isSuccess: isDepositSuccess,
      isError: isDepositError,
      isFetching: isDepositFetching,
      write: depositIntoVault,
    }
  }
}
