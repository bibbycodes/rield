import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { AbiItem } from "web3-utils";
import { ethers } from 'ethers';

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

  const {data: depositData, write: depositIntoVault} = useContractWrite(depositConfig)
  const {isLoading: isDepositLoading, isSuccess: isDepositSuccess} = useWaitForTransaction({
    hash: depositData?.hash,
  })

  const {config: withdrawConfig} = usePrepareContractWrite({
    address: vaultAddress,
    args: [amountBN],
    functionName: "withdraw",
    abi
  })

  const {data: withdrawData, write: withdrawFromVault} = useContractWrite(withdrawConfig)
  const {isLoading: isWithdrawLoading, isSuccess: isWithdrawSuccess} = useWaitForTransaction({
    hash: withdrawData?.hash,
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
    }
  }

}
