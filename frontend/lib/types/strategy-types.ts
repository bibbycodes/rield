import {Address} from "wagmi";

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

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
export interface BaseStrategy {
  id: number;
  name: string;
  protocol: string;
  vaultAddress: Address;
  strategyAddress: Address;
  protocolLogoUrl: string;
  description: string;
  decimals: number;
  status: StrategyStatus;
  abi: any;
  type: StrategyType[];
  performanceFee: number
}
export interface SingleStakeStrategy extends BaseStrategy {
  tokenAddress: Address;
  tokenLogoUrl: string;
  coolDownPeriod: number;
  protocolUrl: string;
  tokenUrl: string;
  coinGeckoId: string;
  tokenSymbol: string;
  hasWithdrawalSchedule?: boolean;
}

export interface LpPoolStrategy extends BaseStrategy {
  lp0TokenAddress: Address;
  lp1TokenAddress: Address;
  lp0TokenSymbol: string;
  lp1TokenSymbol: string;
  lp0TokenLogoUrl: string;
  lp1TokenLogoUrl: string;
  lp0TokenUrl: string;
  lp1TokenUrl: string;
  lp0CoinGeckoId: string;
  lp1CoinGeckoId: string;
}

export type Strategy = SingleStakeStrategy | LpPoolStrategy
