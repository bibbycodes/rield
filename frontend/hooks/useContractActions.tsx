import {Address, useContractWrite, usePrepareContractWrite, useWaitForTransaction} from 'wagmi'
import {AbiItem} from "web3-utils";
import {BigNumber} from 'ethers';

export interface useContractActionsProps {
  vaultAddress: Address,
  amount: BigNumber,
  abi: AbiItem[],
  decimals: number
}

export function useContractActions({vaultAddress, amount, abi}: useContractActionsProps) {
  const {config: depositConfig} = usePrepareContractWrite({
    address: vaultAddress,
    args: [amount],
    functionName: "deposit",
    abi
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
      amount,
      {gasLimit: 1300000}
    ],
    functionName: "withdraw",
    abi,
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
