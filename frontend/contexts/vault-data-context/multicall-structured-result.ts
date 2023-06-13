import { multicall } from '@wagmi/core';
import { Abi } from 'abitype';
import { Address } from 'wagmi';
import { Strategy } from "../../model/strategy";
import { extractStrategySpecificData } from "./utils";
import { Ygi } from '../../model/ygi';

export type StructuredMulticallResult = {
  [address: Address]: {
    [address: Address]: { [functionName: string]: unknown }
  }
}

export async function structuredMulticall<TAbi extends Abi | readonly unknown[],
  TFunctionName extends string, TContracts extends {
  abi: TAbi;
  functionName: TFunctionName;
}[]>(prefix: Address, contracts: any): Promise<StructuredMulticallResult> {
  const data = await multicall({contracts} as any)

  let collisionObjects: any = {}
  let i = 0
  return contracts.reduce((acc: any, contract: any) => {
    if (!acc[prefix][contract.address]) {
      acc[prefix][contract.address] = {}
    }
    if (acc[prefix][contract.address][contract.functionName]) {
      if (collisionObjects[prefix + contract.address + contract.functionName]) {
        acc[prefix][contract.address][contract.functionName] =
          [...acc[prefix][contract.address][contract.functionName] as any, data[i]]
      } else {
        acc[prefix][contract.address][contract.functionName] =
          [acc[prefix][contract.address][contract.functionName], data[i]]
        collisionObjects[prefix + contract.address + contract.functionName] = true
      }
    } else {
      acc[prefix][contract.address][contract.functionName] = data[i]
    }
    i++
    return acc
  }, {[prefix]: {}} as StructuredMulticallResult)
}

export async function structuredMulticallFromCallInfo<TAbi extends Abi | readonly unknown[],
  TFunctionName extends string, TContracts extends {
  abi: TAbi;
  functionName: TFunctionName;
}[]>(callInfos: Map<Address, any>): Promise<StructuredMulticallResult> {
  const data = await multicall(
    {
      contracts: Array.from(callInfos.values()).reduce((acc, curr) => [...acc, ...curr], [])
    }
  );

  let collisionObjects: any = {}
  let i = 0
  return Array.from(callInfos.entries())
    .reduce((acc: StructuredMulticallResult, callInfo) => {
      const strategyAddr = callInfo[0];
      const calls = callInfo[1];
      if (!acc[strategyAddr]) {
        acc[strategyAddr] = {}
      }
      calls.forEach((contract: any) => {
        if (!acc[strategyAddr][contract.address]) {
          acc[strategyAddr][contract.address] = {}
        }
        if (acc[strategyAddr][contract.address][contract.functionName]) {
          if (collisionObjects[strategyAddr + contract.address + contract.functionName]) {
            acc[strategyAddr][contract.address][contract.functionName] =
              [...acc[strategyAddr][contract.address][contract.functionName] as any, data[i]]
          } else {
            acc[strategyAddr][contract.address][contract.functionName] =
              [acc[strategyAddr][contract.address][contract.functionName], data[i]]
            collisionObjects[strategyAddr + contract.address + contract.functionName] = true
          }
        } else {
          acc[strategyAddr][contract.address][contract.functionName] = data[i]
        }
        i++
      });
      return acc;
    }, {} as StructuredMulticallResult)
}

export const transformStrategyMultiCallData = (data: any, strategies: Strategy[]) => {
  return strategies.reduce((acc, strategy) => {
    return {
      ...acc,
      [strategy.vaultAddress]: {
        ...strategy,
        vaultBalance: data[strategy.strategyAddress][strategy.vaultAddress]['balanceOf'],
        totalSupply: data[strategy.strategyAddress][strategy.vaultAddress]['totalSupply'],
        vaultPricePerFullShare: data[strategy.strategyAddress][strategy.vaultAddress]['getPricePerFullShare'],
        allowance: data[strategy.strategyAddress]?.[strategy.tokenAddress]?.['allowance'],
        tokenBalance: data[strategy.strategyAddress]?.[strategy.tokenAddress]?.['balanceOf'],
        vaultWantBalance: data[strategy.strategyAddress][strategy.vaultAddress]['balance'],
        paused: data[strategy.strategyAddress][strategy.strategyAddress]['paused'],
        lastHarvest: data[strategy.strategyAddress][strategy.strategyAddress]['lastHarvest'],
        lastPoolDepositTime: data[strategy.strategyAddress][strategy.strategyAddress]['lastDepositTime'],
        lastPauseTime: data[strategy.strategyAddress][strategy.strategyAddress]['lastPauseTime'],
        additionalData: extractStrategySpecificData(strategy, data)
      }
    }
  }, {} as any)
}

export const transformYgiMultiCallData = (data: any, ygis: Ygi[]) => {
  return ygis.reduce((acc, ygi) => {
    return {
      ...acc,
      [ygi.vaultAddress]: {
        ...ygi,
        inputToken: data[ygi.vaultAddress][ygi.vaultAddress]['ygiInputToken'],
        ygiComponents: data[ygi.vaultAddress][ygi.vaultAddress]['ygiComponents'],
        allowance: data[ygi.vaultAddress]?.[ygi.tokenAddress]?.['allowance'],
      }
    }
  }, {} as any)
}

export const transformMultiCallDataForTvl = (data: any, strategies: Strategy[]) => {
  return strategies.reduce((acc, strategy) => {
    return {
      ...acc,
      [strategy.vaultAddress]: {
        ...strategy,
        vaultWantBalance: data[strategy.strategyAddress][strategy.vaultAddress]['balance'],
        additionalData: extractStrategySpecificData(strategy, data)
      }
    }
  }, {} as any)
}
