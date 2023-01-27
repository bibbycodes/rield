import {Address, useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import ERC20Abi from '../resources/abis/erc20.json';

export function useApproveToken(tokenAddress: string, contractAddress: string, userAddress: string | undefined) {
  const abi = Array.from(ERC20Abi)
  const maxInt = BigNumber.from(2).pow(BigNumber.from(255))
  const [isApproved, setIsApproved] = useState(false);
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
  const {data, refetch}: any = useContractRead({
    abi,
    address: tokenAddress as Address,
    functionName: 'allowance',
    args: [userAddress, contractAddress]
  });

  const fetchAllowance = async () => {
    const {data} = await refetch()
    setIsApproved(data?.gt(0))
  }

  useEffect(() => {
    const fetch = async () => {
      await fetchAllowance()
    }
    fetch()
  }, [data])

  async function handleApprove() {
    const tx = await writeAsync?.()
    await tx?.wait()
    await fetchAllowance()
  }

  return {
    isApproved,
    approve: handleApprove,
    isSuccess,
    fetchAllowance
  }
}
