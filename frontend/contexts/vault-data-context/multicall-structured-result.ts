import { multicall, MulticallConfig } from '@wagmi/core';
import { Abi } from 'abitype';
import { Address } from 'wagmi';

export type StructuredMulticallResult = { [address: Address]: { [functionName: string]: unknown } }

export async function structuredMulticall<TAbi extends Abi | readonly unknown[],
  TFunctionName extends string, TContracts extends {
  abi: TAbi;
  functionName: TFunctionName;
}[]>({
       allowFailure,
       chainId,
       contracts,
       overrides,
     }: MulticallConfig<TContracts>): Promise<StructuredMulticallResult> {

  const data = await multicall({contracts})

  let i = 0
  return contracts.reduce((acc, contract) => {
    if (!acc[contract.address]) {
      acc[contract.address] = {}
    }
    acc[contract.address][contract.functionName] = data[i]
    contract.address
    i++
    return acc
  }, {} as StructuredMulticallResult)
}
