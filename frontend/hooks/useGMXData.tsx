import glpManagerAbi from '../resources/abis/gmx/glp-manager.json'
import stakedGmxAbi from '../resources/abis/gmx/staked-gmx.json'
import feeGlpTracker from '../resources/abis/gmx/fee-glp-tracker.json'
import {Address, useContractReads} from "wagmi";
import {useEffect, useState} from "react";
import {BigNumber} from "ethers";
import {AbiItem} from "web3-utils";

export interface ContractCall {
  address: Address;
  abi: AbiItem[];
}

export const useGMXData = () => {
  const [gmxData, setGmxData] = useState<{ [key: string]: BigNumber }>()
  const [gmxDataAsNumbers, setGmxDataAsNumbers] = useState<{ [key: string]: number }>()
  const glpManager = {
    address: "0x3963FfC9dff443c2A94f21b129D429891E32ec18",
    abi: glpManagerAbi
  } as ContractCall

  const stakedGmx = {
    address: '0xd2D1162512F927a7e282Ef43a362659E4F2a728F',
    abi: stakedGmxAbi
  } as ContractCall
  
  const glpFeetracker = {
    address:'0x4e971a87900b931ff39d1aad67697f49835400b6',
    abi: feeGlpTracker
  } as ContractCall

  const {data, isError, isLoading, refetch} = useContractReads({
    contracts: [
      {
        ...glpManager,
        functionName: 'getAumInUsdg',
        args: [false]
      },
      {
        ...glpManager,
        functionName: 'getPrice',
        args: [false]
      },
      {
        ...glpFeetracker,
        functionName: 'tokensPerInterval'
      },
      {
        ...stakedGmx,
        functionName: 'tokensPerInterval'
      }
    ]
  })

  useEffect(() => {
    const [aum, glpPrice, glpTokensPerInterval, gmxTokensPerInterval] = data as BigNumber[]
    setGmxDataAsNumbers({
      aum: aum.div(BigNumber.from(String(10**18))).toNumber(),
      glpPrice: parseFloat(glpPrice.div(BigNumber.from(10).pow(18)).toNumber().toString()) / 10 ** 12,
      gmxTokensPerInterval: gmxTokensPerInterval.toNumber(),
      glpTokensPerInterval: glpTokensPerInterval.toNumber(),
    } as { [key: string]: number })
    setGmxData({aum, glpPrice, glpTokensPerInterval, gmxTokensPerInterval} as { [key: string]: BigNumber })
  }, [])

  return {
    data: gmxData,
    asNumbers: gmxDataAsNumbers,
    isLoading,
    isError,
    refetch
  }
}
