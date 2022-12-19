import {useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import {BigNumber} from "ethers";
import {useEffect, useState} from "react";
import {Address} from "abitype";
import {abi} from '../../artifacts/contracts/token/GMD.sol/GMD.json';
import {QueryObserverLoadingResult} from "@tanstack/react-query";

export function useApproveToken(tokenAddress: Address, contractAddress: Address, userAddress: Address) {
  const maxInt = BigNumber.from(2).pow(BigNumber.from(255))
  const [isApproved, setIsApproved] = useState(false);
  const [allowance, setAllowance] = useState<BigNumber>(BigNumber.from(0));

  const {data}: any = useContractRead({
    abi,
    address: tokenAddress,
    functionName: 'allowance',
    args: [userAddress, contractAddress]
  });
  
  useEffect(() => {
    setIsApproved(data && data.eq(maxInt));  
  }, [])
  
  function handleApprove() {
    write?.()
    setIsApproved(data && data.eq(maxInt));
    console.log('isApproved', isApproved)
  }

  const {config} = usePrepareContractWrite({
    address: tokenAddress,
    args: [contractAddress, maxInt],
    functionName: "approve",
    abi
  })

  const {data: depositData, write} = useContractWrite(config)
  const {isSuccess} = useWaitForTransaction({
    hash: depositData?.hash,
  })

  return {
    isApproved,
    approve: handleApprove,
    allowance,
    isSuccess
  }
}
