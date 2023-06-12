import {BigNumber, ethers} from "ethers";
import {LpPoolVault, SingleStakeVault, RldVault, StrategyType} from "./types/strategy-types";
import * as RldVaultContract from "../resources/abis/RldTokenVault.json";
import * as rldEthVault from '../resources/abis/BeefyETHVault.json';
import * as SolidlyLpVault from "../resources/abis/RldSolidlyLpVault.json";
import * as genericStrategy from "../resources/abis/CapSingleStakeStrategy.json";
import * as SolidlyLpPoolStrategy from "../resources/abis/RldSolidlyStrategy.json";
import {Address} from "wagmi";
import {ADDRESS_ZERO} from "./apy-getter-functions/cap";
import {VaultData} from "../contexts/vault-data-context/utils";

export function convertToEther(amount: BigNumber): string {
  return ethers.utils.formatEther(amount);
}

export function shortenAddress(address: string) {
  return (
    address.slice(0, 5) +
    "..." +
    address.slice(address.length - 4, address.length)
  );
}

export const convertMillisToSeconds = (timestampInMillis: number): number => {
  return Math.floor(timestampInMillis / 1000);
};

export const sortArrayOfDictsByKey = (
  arrayOfDicts: any[],
  sortBy: string,
  order: "asc" | "desc" = "desc"
) => {
  let orderInt = 1;
  if (order === "desc") {
    orderInt = -orderInt;
  }
  const sortFunction = (itemA: any, itemB: any) => {
    if (itemA[sortBy] > itemB[sortBy]) return orderInt;
    return -orderInt;
  };
  return arrayOfDicts.sort(sortFunction);
};

export const isSingleStakeStrategy = (type: StrategyType[]) => {
  return type.includes(StrategyType.SINGLE_STAKE);
}

export const isTokenApproved = (tokenKey: string, visibleAmount: string, vaultData: RldVault & VaultData, decimals: number): boolean => {
  switch(tokenKey) {
    case 'inputTokenAddress':
    case 'tokenAddress':
      return visibleAmount < '0' || (vaultData?.allowance?.gte(ethers.utils.parseUnits(visibleAmount, decimals)) ?? false)
    case 'lp0TokenAddress':
      return visibleAmount < '0' || (vaultData?.lp0TokenAllowance?.gte(ethers.utils.parseUnits(visibleAmount, decimals)) ?? false)
    case 'lp1TokenAddress':
      return visibleAmount < '0' || (vaultData?.lp1TokenAllowance?.gte(ethers.utils.parseUnits(visibleAmount, decimals)) ?? false)
    default:
      return false
  }
}

export const isLpPoolStrategy = (type: StrategyType[]) => {
  return type.includes(StrategyType.LP_POOL);
}

export const getStrategyInputToken = (strategy: RldVault): Address => {
  if (strategy.type.includes(StrategyType.LP_POOL)) {
    return (strategy as LpPoolVault).inputTokenAddress;
  }
  
  return (strategy as SingleStakeVault).tokenAddress;
}

export const isEthVault = (inputTokenAddress: Address) => {
  return inputTokenAddress === ADDRESS_ZERO;
}

export const getVaultAbi = (strategy: RldVault) => {
  if (isLpPoolStrategy(strategy.type)) {
    return SolidlyLpVault.abi
  }
  if (isEthVault(getStrategyInputToken(strategy))) {
    return rldEthVault.abi
  }
  return RldVaultContract.abi
}

export const getStrategyAbi = (strategy: RldVault) => {
  if (isSingleStakeStrategy(strategy.type)) {
    return genericStrategy.abi
  }

  if (isLpPoolStrategy(strategy.type)) {
    return SolidlyLpPoolStrategy.abi
  }
}
