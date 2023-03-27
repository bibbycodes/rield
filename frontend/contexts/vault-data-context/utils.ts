import { Strategy } from "../../model/strategy";
import { Address } from "wagmi";
import * as RldVault from "../../resources/abis/RldTokenVault.json";
import { ADDRESS_ZERO } from "../../lib/apy-getter-functions/cap";
import * as RldEthVault from "../../resources/abis/BeefyETHVault.json";
import * as genericStrategy from "../../resources/abis/CapSingleStakeStrategy.json";
import * as erc20 from "../../resources/abis/erc20.json";
import * as hopUsdc from "../../resources/vault-details/deploy_hop_usdc-output.json";
import { BigNumber } from "ethers";
import { extractHopAdditionalData, getHopVaultContextData } from './hop-vault-context';
import { StructuredMulticallResult } from './multicall-structured-result';

const erc20Abi = Array.from(erc20)

export interface VaultData {
  vaultBalance: BigNumber
  totalSupply: BigNumber
  vaultPricePerFullShare: BigNumber
  allowance?: BigNumber
  tokenBalance?: BigNumber
  vaultWantBalance: BigNumber
  paused: boolean
  lastHarvest: BigNumber
  lastPoolDepositTime: BigNumber
  lastPauseTime: BigNumber
  additionalData?: any
}

export type MultiCallInput = {
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

  const strategyContract = {
    abi: genericStrategy.abi,
    address: strategy.strategyAddress,
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

  const vaultTotalSupply = {
    ...vault,
    functionName: 'totalSupply'
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

  const vaultWantBalance = {
    ...vault,
    functionName: 'balance',
  }

  const paused = {
    ...strategyContract,
    functionName: 'paused',
  }

  const lastHarvest = {
    ...strategyContract,
    functionName: 'lastHarvest',
  }

  const lastPoolDepositTime = {
    ...strategyContract,
    functionName: 'lastPoolDepositTime',
  }

  const lastPauseTime = {
    ...strategyContract,
    functionName: 'lastPauseTime',
  }


  const additionalCalls = getStrategySpecificCalls(strategy)
  return [
    vaultBalance,
    vaultTotalSupply,
    vaultPricePerFullShare,
    allowance,
    tokenBalance,
    vaultWantBalance,
    paused,
    lastHarvest,
    lastPoolDepositTime,
    lastPauseTime,
    ...additionalCalls
  ]
}

export const getMultiCallDataForEthVault = (strategy: Strategy, userAddress: Address) => {
  const vault = {
    abi: RldEthVault.abi,
    address: strategy.vaultAddress,
  }

  const strategyContract = {
    abi: genericStrategy.abi,
    address: strategy.strategyAddress,
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

  const vaultWantBalance = {
    ...vault,
    functionName: 'balance',
  }

  const paused = {
    ...strategyContract,
    functionName: 'paused',
  }

  const lastHarvest = {
    ...strategyContract,
    functionName: 'lastHarvest',
  }

  const lastPoolDepositTime = {
    ...strategyContract,
    functionName: 'lastPoolDepositTime',
  }

  const lastPauseTime = {
    ...strategyContract,
    functionName: 'lastPauseTime',
  }

  return [
    vaultBalance,
    vaultPricePerFullShare,
    vaultWantBalance,
    paused,
    lastHarvest,
    lastPoolDepositTime,
    lastPauseTime
  ]
}

export const getVaultMultiCallData = (strategies: Strategy[], userAddress: Address) => {
  const erc20VaultCallData = strategies
    .filter(strategy => strategy.tokenAddress !== ADDRESS_ZERO)
    .map((strategy: Strategy) => {
      const calls = getMultiCallDataForErc20Vault(strategy, userAddress)
      return {
        calls,
        tokenAddress: strategy.tokenAddress,
      }
    })

  const ethVaultCallData = strategies
    .filter(strategy => strategy.tokenAddress === ADDRESS_ZERO)
    .map((strategy) => {
      const calls = getMultiCallDataForEthVault(strategy, userAddress)
      return {
        calls,
        tokenAddress: strategy.tokenAddress,
      }
    })

  return {
    erc20VaultCallData: erc20VaultCallData.reduce((acc, strategy) => {
      return [...acc, ...strategy.calls]
    }, [] as any),
    ethVaultCallData: ethVaultCallData.reduce((acc, strategy) => {
      return [...acc, ...strategy.calls]
    }, [] as any),
  }
}

export const getStrategySpecificCalls = (strategy: Strategy) => {
  switch (strategy.strategyAddress) {
    case hopUsdc.strategyAddress:
      return getHopVaultContextData(hopUsdc, strategy);
    default:
      return []
  }
}

export const extractStrategySpecificData = (strategy: Strategy, data: StructuredMulticallResult) => {
  switch (strategy.strategyAddress) {
    case hopUsdc.strategyAddress:
      return {...extractHopAdditionalData(hopUsdc, data)};
    default:
      return null
  }
}
