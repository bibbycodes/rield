import { Address, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { BigNumber } from "ethers";
import ERC20Abi from '../resources/abis/erc20.json';
import { Strategy } from '../model/strategy';

export function useApproveToken(tokenAddress: string,
                                contractAddress: string,
                                userAddress: Address | undefined,
                                strategy: Strategy,
                                refetchForStrategy: (strategy: Strategy, userAddress: Address) => Promise<void>) {
  const abi = Array.from(ERC20Abi)
  const maxInt = BigNumber.from(2).pow(BigNumber.from(255))
  const {config} = usePrepareContractWrite({
    address: tokenAddress as Address,
    args: [contractAddress, maxInt],
    functionName: "approve",
    abi
  })
  const {data: approveRes, writeAsync} = useContractWrite(config)
  const {isSuccess} = useWaitForTransaction({
    hash: approveRes?.hash,
  })

  async function handleApprove() {
    const tx = await writeAsync?.()
    await tx?.wait()
    if (userAddress) {
      await refetchForStrategy(strategy, userAddress)
    }
  }

  return {
    approve: handleApprove,
    isSuccess,
  }
}
