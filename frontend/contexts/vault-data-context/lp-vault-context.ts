import {LpPoolVault, RldVault} from "../../lib/types/strategy-types";
import ERC20Abi from "../../resources/abis/erc20.json";
import {Address} from "wagmi";
import {StructuredMulticallResult} from "./multicall-structured-result";
import {isLpPoolStrategy} from "../../lib/utils";

export const getLpVaultDataContext = (strategy: LpPoolVault, userAddress: Address) => {
  const lp0Token = {
    abi: ERC20Abi,
    address: strategy.lp0TokenAddress
  }
  
  const lp1Token = {
    abi: ERC20Abi,
    address: strategy.lp1TokenAddress
  }
  
  const lp1TokenAllowance = {
    ...lp1Token,
    functionName: 'allowance',
    args: [userAddress, strategy.vaultAddress]
  }
  
  const lp0TokenAllowance = {
    ...lp0Token,
    functionName: 'allowance',
    args: [userAddress, strategy.vaultAddress]
  }

  return [
    lp1TokenAllowance,
    lp0TokenAllowance
  ]
}

export const extractLpPoolStrategySpecificData = (strategy: RldVault, data: StructuredMulticallResult) => {
  if (isLpPoolStrategy(strategy.type)) {
    const strategyAsLpPoolStrategy = strategy as LpPoolVault;
    return {
      lp0TokenAllowance: data[strategyAsLpPoolStrategy.strategyAddress][strategyAsLpPoolStrategy.lp0TokenAddress as Address]['allowance'],
      lp1TokenAllowance: data[strategyAsLpPoolStrategy.strategyAddress][strategyAsLpPoolStrategy.lp1TokenAddress as Address]['allowance'],
    }
  }
}
