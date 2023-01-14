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
  const {isLoading: isDepositLoading, isSuccess: isDepositSuccess} = useWaitForTransaction({
    hash: depositData?.hash,
  })

  const {config: withdrawConfig} = usePrepareContractWrite({
    address: vaultAddress,
    args: [amount],
    functionName: "withdraw",
    abi
  })


  const {data: withdrawData, writeAsync: withdrawFromVault} = useContractWrite(withdrawConfig)
  const {isLoading: isWithdrawLoading, isSuccess: isWithdrawSuccess} = useWaitForTransaction({
    hash: withdrawData?.hash,
  })

  const {config: withdrawAllConfig} = usePrepareContractWrite({
    address: vaultAddress,
    args: [],
    functionName: "withdrawAll",
    abi
  })

  const {data: withdrawAllData, writeAsync: withdrawAllFromVault} = useContractWrite(withdrawAllConfig)
  const {isLoading: isWithdrawAllLoading, isSuccess: isWithdrawAllSuccess} = useWaitForTransaction({
    hash: withdrawAllData?.hash,
  })

  const {config: depositAllConfig} = usePrepareContractWrite({
    address: vaultAddress,
    args: [],
    functionName: "depositAll",
    abi
  })

  const {data: depositAllData, writeAsync: depositAllFromVault} = useContractWrite(depositAllConfig)
  const {isLoading: isDepositAllLoading, isSuccess: isDepositAllSuccess} = useWaitForTransaction({
    hash: depositAllData?.hash,
  })

  return {
    withdraw: {
      isLoading: isWithdrawLoading,
      isSuccess: isWithdrawSuccess,
      write: withdrawFromVault,
    },
    deposit: {
      isLoading: isDepositLoading,
      isSuccess: isDepositSuccess,
      write: depositIntoVault,
    },
    withdrawAll: {
      isLoading: isWithdrawAllLoading,
      isSuccess: isWithdrawAllSuccess,
      write: withdrawAllFromVault,
    },
    depositAll: {
      isLoading: isDepositAllLoading,
      isSuccess: isDepositAllSuccess,
      write: depositAllFromVault,
    }
  }

}
