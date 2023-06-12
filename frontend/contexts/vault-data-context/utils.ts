import {Address} from "wagmi";
import {ADDRESS_ZERO} from "../../lib/apy-getter-functions/cap";
import * as erc20 from "../../resources/abis/erc20.json";
import * as hopUsdc from "../../resources/vault-details/deploy_hop_usdc-output.json";
import * as hopUsdt from "../../resources/vault-details/deploy_hop_usdt-output.json";
import * as hopEth from "../../resources/vault-details/deploy_hop_eth-output.json";
import * as hopDai from "../../resources/vault-details/deploy_hop_dai-output.json";
import {BigNumber} from "ethers";
import {extractHopAdditionalData, getHopVaultContextData} from './hop-vault-context';
import {StructuredMulticallResult} from './multicall-structured-result';
import {LpPoolVault, SingleStakeVault, RldVault, StrategyType} from "../../lib/types/strategy-types";
import {
  getStrategyAbi,
  getStrategyInputToken,
  getVaultAbi,
  isLpPoolStrategy,
  isSingleStakeStrategy
} from "../../lib/utils";
import {getLpVaultDataContext} from "./lp-vault-context";

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
  lp0TokenAllowance?: BigNumber
  lp1TokenAllowance?: BigNumber
  lp0TokenBalance?: BigNumber
  lp1TokenBalance?: BigNumber
  additionalData?: any
}

export type MultiCallInput = {
  abi: any,
  address: Address,
  functionName: string,
  args?: any[]
}
export const getMultiCallDataForErc20Vault = (strategy: RldVault, userAddress: Address) => {
  const vault = {
    abi: getVaultAbi(strategy),
    address: strategy.vaultAddress,
  }

  const strategyContract = {
    abi: getStrategyAbi(strategy),
    address: strategy.strategyAddress,
  }

  const erc20Contract = {
    abi: erc20Abi,
    address: getStrategyInputToken(strategy),
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


  const additionalCalls = getHopSpecificCalls(strategy)
  const solidlyVaultCalls = getSolidlySpecificCalls(strategy, userAddress)
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
    ...additionalCalls,
    ...solidlyVaultCalls
  ]
}

export const getMultiCallDataForEthVault = (strategy: RldVault, userAddress: Address) => {
  const vault = {
    abi: getVaultAbi(strategy),
    address: strategy.vaultAddress,
  }

  const strategyContract = {
    abi: getStrategyAbi(strategy),
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

  const vaultTotalSupply = {
    ...vault,
    functionName: 'totalSupply'
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

  const additionalCalls = getHopSpecificCalls(strategy)
  return [
    vaultBalance,
    vaultTotalSupply,
    vaultPricePerFullShare,
    vaultWantBalance,
    paused,
    lastHarvest,
    lastPoolDepositTime,
    lastPauseTime,
    ...additionalCalls
  ]
}

const getExtraReturnData = (strategy: RldVault) => {
  if (isSingleStakeStrategy(strategy.type)) {
    return {
      tokenAddress: (strategy as SingleStakeVault).tokenAddress,
    }
  }

  if (isLpPoolStrategy(strategy.type)) {
    return {
      inputTokenAddress: (strategy as LpPoolVault).inputTokenAddress,
      lp0TokenAddress: (strategy as LpPoolVault).lp0TokenAddress,
      lp1TokenAddress: (strategy as LpPoolVault).lp1TokenAddress,
    }
  }
}

export const getVaultMultiCallData = (strategies: RldVault[], userAddress: Address) => {
  const erc20VaultCallData = strategies
    .filter(strategy => getStrategyInputToken(strategy) !== ADDRESS_ZERO)
    .map((strategy: RldVault) => {
      const calls = getMultiCallDataForErc20Vault(strategy, userAddress)
      return {
        strategyAddress: strategy.strategyAddress,
        calls,
        ...getExtraReturnData(strategy)
      }
    })

  const ethVaultCallData = strategies
    .filter(strategy => getStrategyInputToken(strategy) === ADDRESS_ZERO)
    .map((strategy) => {
      const calls = getMultiCallDataForEthVault(strategy, userAddress)
      return {
        strategyAddress: strategy.strategyAddress,
        calls,
        ...getExtraReturnData(strategy)
      }
    })

  return {
    erc20VaultCallData: erc20VaultCallData.reduce((acc, strategy) => {
      if (!acc.has(strategy.strategyAddress)) {
        acc.set(strategy.strategyAddress, []);
      }
      acc.set(strategy.strategyAddress, [...acc.get(strategy.strategyAddress)!, ...strategy.calls]);
      return acc;
    }, new Map<Address, any[]>()),
    ethVaultCallData: ethVaultCallData.reduce((acc, strategy) => {
      if (!acc.has(strategy.strategyAddress)) {
        acc.set(strategy.strategyAddress, []);
      }
      acc.set(strategy.strategyAddress, [...acc.get(strategy.strategyAddress)!, ...strategy.calls]);
      return acc;
    }, new Map<Address, any[]>()),
  }
}

export const getHopSpecificCalls = (strategy: RldVault) => {
  switch (strategy.strategyAddress) {
    case hopUsdc.strategyAddress:
      return getHopVaultContextData(hopUsdc, strategy);
    case hopUsdt.strategyAddress:
      return getHopVaultContextData(hopUsdt, strategy);
    case hopEth.strategyAddress:
      return getHopVaultContextData(hopEth, strategy);
    case hopDai.strategyAddress:
      return getHopVaultContextData(hopDai, strategy);
    default:
      return []
  }
}

export const getSolidlySpecificCalls = (strategy: RldVault, userAddress: Address) => {
  if (strategy.type.includes(StrategyType.LP_POOL)) {
    return getLpVaultDataContext(strategy as LpPoolVault, userAddress)
  }
  return []
}

export const extractStrategySpecificData = (strategy: RldVault, data: StructuredMulticallResult) => {
  switch (strategy.strategyAddress) {
    case hopUsdc.strategyAddress:
      return {...extractHopAdditionalData(hopUsdc, strategy, data)};
    case hopUsdt.strategyAddress:
      return {...extractHopAdditionalData(hopUsdt, strategy, data)};
    case hopEth.strategyAddress:
      return {...extractHopAdditionalData(hopEth, strategy, data)};
    case hopDai.strategyAddress:
      return {...extractHopAdditionalData(hopDai, strategy, data)};
    default:
      return null
  }
}

