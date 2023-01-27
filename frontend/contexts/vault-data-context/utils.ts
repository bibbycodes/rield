import {Strategy} from "../../model/strategy";
import {Address} from "wagmi";
import * as RldVault from "../../resources/abis/BeefyVaultV7.json";
import {ADDRESS_ZERO} from "../../lib/apy-getter-functions/cap";
import * as RldEthVault from "../../resources/abis/BeefyETHVault.json";
import * as erc20 from "../../resources/abis/erc20.json";
import {multicall} from "@wagmi/core";
import {BigNumber} from "ethers";

const erc20Abi = Array.from(erc20)

export interface VaultData {
  vaultBalance: BigNumber
  vaultPricePerFullShare: BigNumber
  allowance?: BigNumber
  tokenBalance?: BigNumber
}

type MultiCallInput = {
  abi: any,
  address: Address,
  functionName: string,
  args?: any[]
}
export const getMultiCallDataForErc20Vault = (strategy: Strategy, userAddress: Address) => {
  const vault = {
    abi: RldVault.abi,
    address: strategy.vaultAddress,
  }

  const erc20Contract = {
    abi: erc20Abi,
    address: strategy.tokenAddress,
  }

  const vaultBalance = {
    ...vault,
    functionName: 'balanceOf',
    args: [userAddress]
  }

  const vaultPricePerFullShare = {
    ...vault,
    functionName: 'getPricePerFullShare',
  }

  const allowance = {
    ...erc20Contract,
    functionName: 'allowance',
    args: [userAddress, strategy.vaultAddress]
  }

  const tokenBalance = {
    ...erc20Contract,
    functionName: 'balanceOf',
    args: [userAddress]
  }

  return [
    vaultBalance,
    vaultPricePerFullShare,
    allowance,
    tokenBalance
  ]
}

export const getMultiCallDataForEthVault = (strategy: Strategy) => {
  const vault = {
    abi: RldEthVault.abi,
    address: strategy.vaultAddress,
  }

  const vaultBalance = {
    ...vault,
    functionName: 'balanceOf',
  }

  const vaultPricePerFullShare = {
    ...vault,
    functionName: 'getPricePerFullShare',
  }

  return [
    vaultBalance,
    vaultPricePerFullShare,
  ]
}

export const refetchSingle = async (strategy: Strategy, userAddress: Address): Promise<VaultData> => {
  const isEthVault = strategy.tokenAddress === ADDRESS_ZERO
  const multiCallData: MultiCallInput[] = isEthVault ? getMultiCallDataForEthVault(strategy) : getMultiCallDataForErc20Vault(strategy, userAddress)
  const data = await multicall({contracts: multiCallData})
  const [vaultBalance, vaultPricePerFullShare, allowance, tokenBalance] = data as BigNumber[]
  return {
    vaultBalance,
    vaultPricePerFullShare,
    allowance, 
    tokenBalance
  }
}

export const getVaultMultiCallData = (strategies: Strategy[], userAddress: Address) => {
  const erc20VaultCallData = strategies
    .map((strategy: Strategy) => {
      const calls = getMultiCallDataForErc20Vault(strategy, userAddress)
      return {
        calls,
        tokenAddress: strategy.tokenAddress,
      }
    })
    .filter(strategy => strategy.tokenAddress !== ADDRESS_ZERO)

  const ethVaultCallData = strategies
    .map((strategy) => {
      const calls = getMultiCallDataForEthVault(strategy)
      return {
        calls,
        tokenAddress: strategy.tokenAddress,
      }
    }).filter(strategy => strategy.tokenAddress === ADDRESS_ZERO)

  return {
    erc20VaultCallData: erc20VaultCallData.reduce((acc, strategy) => {
      return [...acc, ...strategy.calls]
    }, [] as any),
    ethVaultCallData: ethVaultCallData.reduce((acc, strategy) => {
      return [...acc, ...strategy.calls]
    }, [] as any),
  }
}