import {useContractWrite, usePrepareContractWrite, useWaitForTransaction} from 'wagmi'
import {AbiItem} from "web3-utils";
import {BigNumber} from 'ethers';

export interface useContractActionsProps {
  vaultAddress: string,
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

  const {config: depositAllConfig} = usePrepareContractWrite({
    address: vaultAddress,
    args: [],
    functionName: "depositAll",
    abi
  })

  const {data: depositAllData, writeAsync: depositAllFromVault} = useContractWrite(depositAllConfig)
  const {
    isLoading: isDepositAllLoading,
    isSuccess: isDepositAllSuccess,
    isError: isDepositAllError,
    isFetching: isDepositAllFetching
  } = useWaitForTransaction({
    hash: depositAllData?.hash,
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

  const {config: withdrawAllConfig} = usePrepareContractWrite({
    address: vaultAddress,
    args: [{
      gasLimit: 1300000,
    }],
    functionName: "withdrawAll",
    abi,
  })

  const {data: withdrawAllData, writeAsync: withdrawAllFromVault} = useContractWrite(withdrawAllConfig)
  const {
    isLoading: isWithdrawAllLoading,
    isSuccess: isWithdrawAllSuccess,
    isError: isWithdrawAllError,
    isFetching: isWithdrawAllFetching
  } = useWaitForTransaction({
    hash: withdrawAllData?.hash,
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
    },
    withdrawAll: {
      isLoading: isWithdrawAllLoading,
      isSuccess: isWithdrawAllSuccess,
      isError: isWithdrawAllError,
      isFetching: isWithdrawAllFetching,
      write: withdrawAllFromVault,
    },
    depositAll: {
      isLoading: isDepositAllLoading,
      isSuccess: isDepositAllSuccess,
      isError: isDepositAllError,
      isFetching: isDepositAllFetching,
      write: depositAllFromVault,
    }
  }
}
