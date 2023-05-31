import { SingleStakeStrategy } from '../../model/strategy';
import { Address } from 'wagmi';
import * as HopPoolAbi from "../../resources/abis/HopPoolAbi.json";
import * as HopTrackerAbi from "../../resources/abis/HopTrackerAbi.json";
import { StructuredMulticallResult } from './multicall-structured-result';

export const getHopVaultContextData = (hopOutput: { hopPool: string, hopTracker: string },
                                       strategy: Strategy) => {
  const pool = {
    abi: HopPoolAbi.abi,
    address: hopOutput.hopPool as Address
  }

  const tracker = {
    abi: HopTrackerAbi.abi,
    address: hopOutput.hopTracker as Address
  }

  const poolBalance = {
    ...pool,
    functionName: 'balanceOf',
    args: [strategy.strategyAddress]
  }

  const virtualPrice = {
    ...tracker,
    functionName: 'getVirtualPrice',
  }

  return [
    poolBalance,
    virtualPrice
  ]
}

export const extractHopAdditionalData = (hopOutput: { hopPool: string, hopTracker: string },
                                         strategy: Strategy,
                                         data: StructuredMulticallResult) => {
  return {
    hopPoolBalance: data[strategy.strategyAddress][hopOutput.hopPool as Address]['balanceOf'],
    hopVirtualPrice: data[strategy.strategyAddress][hopOutput.hopTracker as Address]['getVirtualPrice'],
  }
}
