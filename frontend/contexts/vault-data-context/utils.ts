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
import {LpPoolStrategy, SingleStakeStrategy, Strategy} from "../../lib/types/strategy-types";
import {
  getStrategyAbi,
  getStrategyInputToken,
  getVaultAbi,
  isLpPoolStrategy,
  isSingleStakeStrategy
} from "../../lib/utils";

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

  const additionalCalls = getStrategySpecificCalls(strategy)
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

const getExtraReturnData = (strategy: Strategy) => {
  if (isSingleStakeStrategy(strategy)) {
    return {
      tokenAddress: (strategy as SingleStakeStrategy).tokenAddress,
    }
  }

  if (isLpPoolStrategy(strategy)) {
    return {
      inputTokenAddress: (strategy as LpPoolStrategy).inputTokenAddress,
      lp0TokenAddress: (strategy as LpPoolStrategy).lp0TokenAddress,
      lp1TokenAddress: (strategy as LpPoolStrategy).lp1TokenAddress,
    }
  }
}

export const getVaultMultiCallData = (strategies: Strategy[], userAddress: Address) => {
  const erc20VaultCallData = strategies
    .filter(strategy => getStrategyInputToken(strategy) !== ADDRESS_ZERO)
    .map((strategy: Strategy) => {
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

export const getStrategySpecificCalls = (strategy: Strategy) => {
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

export const extractStrategySpecificData = (strategy: Strategy, data: StructuredMulticallResult) => {
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

export const extractLpPoolStrategySpecificData = (strategy: Strategy, data: StructuredMulticallResult) => {
  if (isLpPoolStrategy(strategy)) {
    const strategyAsLpPoolStrategy = strategy as LpPoolStrategy;
    return {
      lp0TokenBalance: data[strategyAsLpPoolStrategy.strategyAddress][strategyAsLpPoolStrategy.lp0TokenAddress as Address]['balanceOf'],
      lp1TokenBalance: data[strategyAsLpPoolStrategy.strategyAddress][strategyAsLpPoolStrategy.lp1TokenAddress as Address]['balanceOf'],
      lp0TokenAllowance: data[strategyAsLpPoolStrategy.strategyAddress][strategyAsLpPoolStrategy.lp0TokenAddress as Address]['allowance'],
      lp1TokenAllowance: data[strategyAsLpPoolStrategy.strategyAddress][strategyAsLpPoolStrategy.lp1TokenAddress as Address]['allowance'],
    }
  }
}
