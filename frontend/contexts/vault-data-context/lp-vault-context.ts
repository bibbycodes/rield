import {Strategy} from "../../lib/types/strategy-types";
import * as HopPoolAbi from "../../resources/abis/HopPoolAbi.json";
import {Address} from "wagmi";
import * as HopTrackerAbi from "../../resources/abis/HopTrackerAbi.json";

export const getLpVaultDataContext = (hopOutput: { hopPool: string, hopTracker: string },
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
