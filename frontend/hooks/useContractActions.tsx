import {useContractWrite, usePrepareContractWrite, useWaitForTransaction} from 'wagmi'
import {AbiItem} from "web3-utils";
import {ethers} from 'ethers';

export interface useContractActionsProps {
  vaultAddress: string,
  amount: number,
  abi: AbiItem[]
}

export const useContractActions = ({vaultAddress, amount, abi}: useContractActionsProps) => {
  const amountBN = ethers.utils.parseEther(String(amount))
  const {config: depositConfig} = usePrepareContractWrite({
    address: vaultAddress,
    args: [amountBN],
    functionName: "deposit",
    abi
  })

  const {data: depositData, writeAsync: depositIntoVault} = useContractWrite(depositConfig)
  const {isLoading: isDepositLoading, isSuccess: isDepositSuccess} = useWaitForTransaction({
    hash: depositData?.hash,
  })

  const {config: withdrawConfig} = usePrepareContractWrite({
    address: vaultAddress,
    args: [amountBN],
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

  console.log('hm', {
    isLoading: isWithdrawLoading,
    isSuccess: isWithdrawSuccess,
    write: withdrawFromVault,
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
