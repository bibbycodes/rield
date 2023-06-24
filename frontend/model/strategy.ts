import {abi} from '../resources/abis/RldTokenVault.json';
import {abi as ethVaultAbi} from '../resources/abis/BeefyETHVault.json';
import {abi as solidlyLpVaultAbi} from '../resources/abis/RldSolidlyLpVault.json';
import {Address} from "wagmi";
import {ADDRESS_ZERO} from "../lib/apy-getter-functions/cap";
import {LpPoolVault, SingleStakeVault, RldVault, StrategyStatus, StrategyType} from "../lib/types/strategy-types";
import {
  bfr,
  capEth,
  capUSDC,
  glp,
  gmx,
  gns,
  hopDai,
  hopEth,
  hopUsdc,
  hopUsdt,
  ramArbUsdc
} from '../lib/strategy-details';

export const singleStakeStrategies: SingleStakeVault[] = [
  {
    id: 2,
    name: "RLD-CAP-USDC",
    protocol: "Cap.finance",
    tokenSymbol: "USDC",
    tokenAddress: capUSDC.tokenAddress as Address,
    vaultAddress: capUSDC.vaultAddress as Address,
    strategyAddress: capUSDC.strategyAddress as Address,
    protocolLogoUrl: "/cap-logo.svg",
    tokenLogoUrl: "/usdc-logo.svg",
    description: "Cap is a decentralized protocol that allows users to earn interest on their crypto assets. The protocol is designed to be as simple as possible, while still providing the best possible interest rates.",
    protocolUrl: "https://www.cap.finance",
    tokenUrl: `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${capUSDC.tokenAddress}`,
    decimals: 6,
    status: StrategyStatus.ACTIVE,
    abi: abi,
    coinGeckoId: "usd-coin",
    type: [StrategyType.AUTO_COMPOUND, StrategyType.SINGLE_STAKE],
    performanceFee: 5,
    hasWithdrawalSchedule: true,
    coolDownPeriod: 3600000
  },
  {
    id: 3,
    name: "RLD-CAP-ETH",
    protocol: "Cap.finance",
    tokenSymbol: "ETH",
    tokenAddress: capEth.tokenAddress as Address,
    vaultAddress: capEth.vaultAddress as Address,
    strategyAddress: capEth.strategyAddress as Address,
    protocolLogoUrl: "/cap-logo.svg",
    tokenLogoUrl: "/eth-token.svg",
    description: "Cap is a decentralized protocol that allows users to earn interest on their crypto assets. The protocol is designed to be as simple as possible, while still providing the best possible interest rates.",
    protocolUrl: "https://www.cap.finance",
    tokenUrl: `https://app.uniswap.org/#/swap?inputCurrency=USDC&outputCurrency=eth`,
    decimals: 18,
    status: StrategyStatus.ACTIVE,
    abi: ethVaultAbi,
    coinGeckoId: "ethereum",
    type: [StrategyType.AUTO_COMPOUND, StrategyType.SINGLE_STAKE],
    performanceFee: 5,
    hasWithdrawalSchedule: true,
    coolDownPeriod: 3600000
  },
  {
    id: 0,
    name: "RLD-GMX",
    tokenSymbol: "GMX",
    tokenAddress: gmx.tokenAddress as Address,
    vaultAddress: gmx.vaultAddress as Address,
    protocol: "GMX.io",
    strategyAddress: gmx.strategyAddress as Address,
    protocolLogoUrl: "/gmx-logo.svg",
    tokenLogoUrl: "/gmx-logo.svg",
    description: "GMX Token is a governance token for the GMD protocol. It is used to vote on protocol changes and to earn rewards from the GMD protocol.",
    protocolUrl: "https://gmx.io/#/",
    tokenUrl: `https://app.gmx.io/#/buy_gmx`,
    decimals: 18,
    status: StrategyStatus.ACTIVE,
    abi: abi,
    coinGeckoId: "gmx",
    type: [StrategyType.AUTO_COMPOUND, StrategyType.SINGLE_STAKE],
    performanceFee: 5,
    coolDownPeriod: 0
  },
  {
    id: 1,
    name: "RLD-GLP",
    tokenSymbol: "GLP",
    tokenAddress: glp.tokenAddress as Address,
    vaultAddress: glp.vaultAddress as Address,
    protocol: "GMX.io",
    strategyAddress: glp.strategyAddress as Address,
    protocolLogoUrl: "/gmx-logo.svg",
    tokenLogoUrl: "/glp-logo.svg",
    description: "GLP is an index token consisting of multiple blue-chip cryptos that is used as liquidity on GMX.",
    protocolUrl: "https://gmx.io/#/",
    tokenUrl: `https://app.gmx.io/#/buy_glp/`,
    decimals: 18,
    status: StrategyStatus.ACTIVE,
    abi: abi,
    coinGeckoId: "glp",
    type: [StrategyType.AUTO_COMPOUND, StrategyType.SINGLE_STAKE],
    performanceFee: 5,
    coolDownPeriod: 0,
  },

  {
    id: 0,
    name: "GNS",
    protocol: "Gains Network",
    tokenSymbol: "GNS",
    tokenAddress: gns.tokenAddress as Address,
    vaultAddress: gns.vaultAddress as Address,
    strategyAddress: gns.strategyAddress as Address,
    protocolLogoUrl: "/gns-logo.png",
    tokenLogoUrl: "/gns-logo.png",
    description: "Gains network is a decentralized perpetual platform built on arbitrum.",
    protocolUrl: "https://gains.trade/",
    tokenUrl: `https://traderjoexyz.com/arbitrum/trade?inputCurrency=ETH&outputCurrency=0x18c11fd286c5ec11c3b683caa813b77f5163a122`,
    decimals: 18,
    status: StrategyStatus.ACTIVE,
    abi: abi,
    coinGeckoId: "gains-network",
    type: [StrategyType.AUTO_COMPOUND, StrategyType.SINGLE_STAKE],
    performanceFee: 5,
    coolDownPeriod: 0
  },
  {
    id: 5,
    name: "BFR",
    protocol: "Buffer Finance",
    tokenSymbol: "BFR",
    tokenAddress: bfr.tokenAddress as Address,
    vaultAddress: bfr.vaultAddress as Address,
    strategyAddress: bfr.strategyAddress as Address,
    protocolLogoUrl: "/bfr-logo.png",
    tokenLogoUrl: "/bfr-logo.png",
    description: "Buffer",
    protocolUrl: "https://app.buffer.finance/ARBITRUM/earn",
    tokenUrl: `https://app.uniswap.org/#/tokens/arbitrum/0x1a5b0aaf478bf1fda7b934c76e7692d722982a6d`,
    decimals: 18,
    status: StrategyStatus.ACTIVE,
    coolDownPeriod: 0,
    hasWithdrawalSchedule: false,
    abi: abi,
    coinGeckoId: "ibuffer-token",
    type: [StrategyType.AUTO_COMPOUND, StrategyType.SINGLE_STAKE],
    performanceFee: 5
  },
  {
    id: 6,
    name: "HOP-USDC",
    protocol: "HOP",
    tokenSymbol: "USDC",
    tokenAddress: hopUsdc.tokenAddress as Address,
    vaultAddress: hopUsdc.vaultAddress as Address,
    strategyAddress: hopUsdc.strategyAddress as Address,
    protocolLogoUrl: "/hop-logo.svg",
    tokenLogoUrl: "/usdc-logo.svg",
    description: "HOP",
    protocolUrl: "https://app.hop.exchange/#/pools?token=USDC",
    tokenUrl: `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${hopUsdc.tokenAddress}`,
    decimals: 6,
    status: StrategyStatus.ACTIVE,
    coolDownPeriod: 0,
    hasWithdrawalSchedule: false,
    abi: abi,
    coinGeckoId: "usd-coin",
    type: [StrategyType.AUTO_COMPOUND, StrategyType.SINGLE_STAKE],
    performanceFee: 5
  },
  {
    id: 7,
    name: "HOP-USDT",
    protocol: "HOP",
    tokenSymbol: "USDT",
    tokenAddress: hopUsdt.tokenAddress as Address,
    vaultAddress: hopUsdt.vaultAddress as Address,
    strategyAddress: hopUsdt.strategyAddress as Address,
    protocolLogoUrl: "/hop-logo.svg",
    tokenLogoUrl: "/usdt-logo.svg",
    description: "HOP",
    protocolUrl: "https://app.hop.exchange/#/pools?token=USDT",
    tokenUrl: `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${hopUsdt.tokenAddress}`,
    decimals: 6,
    status: StrategyStatus.ACTIVE,
    coolDownPeriod: 0,
    hasWithdrawalSchedule: false,
    abi: abi,
    coinGeckoId: "tether",
    type: [StrategyType.AUTO_COMPOUND, StrategyType.SINGLE_STAKE],
    performanceFee: 5
  },
  {
    id: 8,
    name: "HOP-ETH",
    protocol: "HOP",
    tokenSymbol: "ETH",
    tokenAddress: hopEth.tokenAddress as Address,
    vaultAddress: hopEth.vaultAddress as Address,
    strategyAddress: hopEth.strategyAddress as Address,
    protocolLogoUrl: "/hop-logo.svg",
    tokenLogoUrl: "/eth-token.svg",
    description: "HOP",
    protocolUrl: "https://app.hop.exchange/#/pools?token=ETH",
    tokenUrl: `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${hopEth.tokenAddress}`,
    decimals: 18,
    status: StrategyStatus.ACTIVE,
    coolDownPeriod: 0,
    hasWithdrawalSchedule: false,
    abi: ethVaultAbi,
    coinGeckoId: "ethereum",
    type: [StrategyType.AUTO_COMPOUND, StrategyType.SINGLE_STAKE],
    performanceFee: 5
  },
  {
    id: 9,
    name: "HOP-DAI",
    protocol: "HOP",
    tokenSymbol: "DAI",
    tokenAddress: hopDai.tokenAddress as Address,
    vaultAddress: hopDai.vaultAddress as Address,
    strategyAddress: hopDai.strategyAddress as Address,
    protocolLogoUrl: "/hop-logo.svg",
    tokenLogoUrl: "/dai-logo.png",
    description: "HOP",
    protocolUrl: "https://app.hop.exchange/#/pools?token=DAI",
    tokenUrl: `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${hopDai.tokenAddress}`,
    decimals: 18,
    status: StrategyStatus.ACTIVE,
    coolDownPeriod: 0,
    hasWithdrawalSchedule: false,
    abi: abi,
    coinGeckoId: "dai",
    type: [StrategyType.AUTO_COMPOUND, StrategyType.SINGLE_STAKE],
    performanceFee: 5
  },
]

export const LpStrategies: LpPoolVault[] = [
  {
    id: 10,
    name: "ARB_USDC",
    protocol: "Solidlizard",
    lp0TokenSymbol: "ARB",
    lp0TokenAddress: ramArbUsdc.lp0Address as Address,
    lp1TokenSymbol: "USDC",
    lp1TokenAddress: ramArbUsdc.lp1Address as Address,
    inputTokenAddress: ramArbUsdc.inputTokenAddress as Address,
    vaultAddress: ramArbUsdc.vaultAddress as Address,
    strategyAddress: ramArbUsdc.strategyAddress as Address,
    protocolLogoUrl: "/lizard.png",
    inputTokenSymbol: 'USDC',
    inputTokenLogoUrl: "/usdc-logo.svg",
    lp0TokenLogoUrl: "/arb-logo.png",
    lp1TokenLogoUrl: "/usdc-logo.svg",
    description: "Ramses",
    inputTokenUrl: `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${ramArbUsdc.inputTokenAddress}`,
    lp0TokenUrl: `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${ramArbUsdc.lp0Address}`,
    lp1TokenUrl: `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${ramArbUsdc.lp1Address}`,
    inputTokenDecimals: 6,
    lp0TokenDecimals: 18,
    lp1TokenDecimals: 6,
    status: StrategyStatus.ACTIVE,
    lp0CoinGeckoId: "arbitrum",
    lp1CoinGeckoId: "usd-coin",
    tokenAddressToCoinGeckoIdMap: {
      [ramArbUsdc.lp0Address as Address]: "arbitrum",
      [ramArbUsdc.lp1Address as Address]: "usd-coin",
      [ramArbUsdc.rewardTokenAddress as Address]: "solidlizard"
    },
    rewardTokenAddresses: ramArbUsdc.rewardTokenAddresses as Address[],
    abi: solidlyLpVaultAbi,
    type: [StrategyType.AUTO_COMPOUND, StrategyType.LP_POOL],
    performanceFee: 2,
    protocolUrl: "https://solidlizard.finance/liquidity",
  }
]
export const erc20Strategies = singleStakeStrategies
  .filter(strategy => strategy.tokenAddress !== ADDRESS_ZERO)
  .filter(strategy => strategy.status !== 'DISABLED')
export const ethStrategies = singleStakeStrategies
  .filter(strategy => strategy.tokenAddress === ADDRESS_ZERO)
  .filter(strategy => strategy.status !== 'DISABLED')

export const erc20LpStrategies = LpStrategies
  .filter(strategy => strategy.lp0TokenAddress !== ADDRESS_ZERO && strategy.lp1TokenAddress !== ADDRESS_ZERO)
  .filter(strategy => strategy.status !== StrategyStatus.DISABLED)

export const ethLpStrategies = LpStrategies
  .filter(strategy => strategy.lp0TokenAddress === ADDRESS_ZERO || strategy.lp1TokenAddress === ADDRESS_ZERO)
  .filter(strategy => strategy.status !== StrategyStatus.DISABLED)

export const allErc20Strategies: RldVault[] = [...erc20Strategies, ...erc20LpStrategies]

export const allStrategies: RldVault[] = [...erc20Strategies, ...ethStrategies, ...erc20LpStrategies]

export const vaultAddressToRldVault = allStrategies.reduce((acc, strategy) => {
  acc[strategy.vaultAddress] = strategy
  return acc
}, {} as Record<string, RldVault>)

singleStakeStrategies.reverse()

