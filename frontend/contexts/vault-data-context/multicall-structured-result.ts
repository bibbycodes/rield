import { multicall } from '@wagmi/core';
import { Abi } from 'abitype';
import { Address } from 'wagmi';

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

  let i = 0
  return contracts.reduce((acc: any, contract: any) => {
    if (!acc[prefix][contract.address]) {
      acc[prefix][contract.address] = {}
    }
    acc[prefix][contract.address][contract.functionName] = data[i]
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
        acc[strategyAddr][contract.address][contract.functionName] = data[i]
        i++
      });
      return acc;
    }, {} as StructuredMulticallResult)
}
