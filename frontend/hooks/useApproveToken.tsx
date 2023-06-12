import {Address, useContractWrite, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import {BigNumber} from "ethers";
import ERC20Abi from '../resources/abis/erc20.json';
import {useState} from 'react';
import {usePostHog} from "posthog-js/react";
import {RldVault} from "../lib/types/strategy-types";

export function useApproveToken(
  tokenAddress: string,
  contractAddress: string,
  userAddress: Address | undefined,
  strategy: RldVault,
  refetchForStrategy: (strategy: RldVault, userAddress: Address) => Promise<void>
) {
  const posthog = usePostHog()
  const abi = Array.from(ERC20Abi)
  const maxInt = BigNumber.from(2).pow(BigNumber.from(255))
  const {config} = usePrepareContractWrite({
    address: tokenAddress as Address,
    args: [contractAddress, maxInt],
    functionName: "approve",
    abi
  })
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const {data: approveRes, writeAsync} = useContractWrite(config)
  const {isSuccess} = useWaitForTransaction({
    hash: approveRes?.hash,
  })

  async function handleApprove() {
    setIsLoading(true)
    try {
      const tx = await writeAsync?.()
      await tx?.wait()
      if (userAddress) {
        await refetchForStrategy(strategy, userAddress)
      }
      posthog?.capture('TX_MODAL:APPROVE', {strategy: strategy.name})
    } catch (e) {
      console.error(e)
    }
    setIsLoading(false)
  }

  return {
    approve: handleApprove,
    isSuccess,
    isLoading
  }
}
