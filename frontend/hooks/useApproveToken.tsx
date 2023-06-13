import { Address, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { BigNumber } from "ethers";
import ERC20Abi from '../resources/abis/erc20.json';
import { useState } from 'react';

export function useApproveToken(tokenAddress: string,
                                contractAddress: string,
                                postApprove: () => Promise<void>,) {
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
      await postApprove()
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
