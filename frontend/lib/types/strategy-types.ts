import {Address} from "wagmi";

export enum StrategyStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
  SOON = 'SOON',
  HIDDEN = 'HIDDEN',
}

export enum StrategyType {
  AUTO_COMPOUND = 'AUTO_COMPOUND',
  SINGLE_STAKE = 'SINGLE_STAKE',
  LP_POOL = 'LP_POOL',
  YGI = 'YGI',
}
export interface BaseVault {
  id: number;
  name: string;
  protocol: string;
  vaultAddress: Address;
  strategyAddress: Address;
  protocolLogoUrl: string;
  description: string;
  status: StrategyStatus;
  abi: any;
  type: StrategyType[];
  performanceFee: number
  protocolUrl: string;
  hasWithdrawalSchedule?: boolean;
}
export interface SingleStakeVault extends BaseVault {
  decimals: number;
  tokenAddress: Address;
  tokenLogoUrl: string;
  coolDownPeriod: number;
  tokenUrl: string;
  coinGeckoId: string;
  tokenSymbol: string;
}

export interface tokenAddressToCoinGeckoIdMap {
  [tokenAddress: Address]: string;
}

export interface LpPoolVault extends BaseVault {
  inputTokenDecimals: number,
  lp0TokenDecimals: number,
  lp1TokenDecimals: number,
  lp0TokenAddress: Address;
  lp1TokenAddress: Address;
  inputTokenAddress: Address;
  rewardTokenAddresses: Address[];
  inputTokenSymbol: string;
  inputTokenLogoUrl: string;
  inputTokenUrl: string;
  lp0TokenSymbol: string;
  lp1TokenSymbol: string;
  lp0TokenLogoUrl: string;
  lp1TokenLogoUrl: string;
  lp0TokenUrl: string;
  lp1TokenUrl: string;
  lp0CoinGeckoId: string;
  lp1CoinGeckoId: string;
  tokenAddressToCoinGeckoIdMap: tokenAddressToCoinGeckoIdMap;
}

export type RldVault = SingleStakeVault | LpPoolVault
