import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { abi } from '../../artifacts/contracts/token/GMD.sol/GMD.json';

export function useApproveToken(tokenAddress: string, contractAddress: string, userAddress: string | undefined) {
  const maxInt = BigNumber.from(2).pow(BigNumber.from(255))
  const [isApproved, setIsApproved] = useState(false);
  const {config} = usePrepareContractWrite({
    address: tokenAddress,
    args: [contractAddress, maxInt],
    functionName: "approve",
    abi
  })
  const {data: depositData, writeAsync} = useContractWrite(config)
  const {isSuccess} = useWaitForTransaction({
    hash: depositData?.hash,
  })
  const {data}: any = useContractRead({
    abi,
    address: tokenAddress,
    functionName: 'allowance',
    args: [userAddress, contractAddress]
  });

  useEffect(() => {
    setIsApproved(data && data.eq(maxInt));
  }, [data])

  async function handleApprove() {
    const tx = await writeAsync?.()
    await tx?.wait()
    setIsApproved(true)
  }

  return {
    isApproved,
    approve: handleApprove,
    isSuccess
  }
}
