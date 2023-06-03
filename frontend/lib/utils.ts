import {BigNumber, ethers} from "ethers";
import {SingleStakeStrategy, Strategy, StrategyType} from "./types/strategy-types";
import * as RldVault from "../resources/abis/RldTokenVault.json";
import * as rldEthVault from '../resources/abis/BeefyETHVault.json';
import * as SolidlyLpVault from "../resources/abis/RldSolidlyLpVault.json";
import * as genericStrategy from "../resources/abis/CapSingleStakeStrategy.json";
import * as SolidlyLpPoolStrategy from "../resources/abis/RldSolidlyStrategy.json";
import {Address} from "wagmi";
import {ADDRESS_ZERO} from "./apy-getter-functions/cap";

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

export const isSingleStakeStrategy = (strategy: Strategy) => {
  return strategy.type.includes(StrategyType.SINGLE_STAKE);
}

export const isLpPoolStrategy = (strategy: Strategy) => {
  return strategy.type.includes(StrategyType.LP_POOL);
}

export const getStrategyInputToken = (strategy: Strategy): Address => {
  if (strategy.type.includes(StrategyType.SINGLE_STAKE)) {
    return (strategy as SingleStakeStrategy).tokenAddress;
  }
  return (strategy as SingleStakeStrategy).tokenAddress;

}

export const isEthVault = (inputTokenAddress: Address) => {
  return inputTokenAddress === ADDRESS_ZERO;
}

export const getVaultAbi = (strategy: Strategy) => {
  if (isLpPoolStrategy(strategy)) {
    return SolidlyLpVault.abi
  }
  if (isEthVault(getStrategyInputToken(strategy))) {
    return rldEthVault.abi
  }
  return RldVault.abi
}

export const getStrategyAbi = (strategy: Strategy) => {
  if (isSingleStakeStrategy(strategy)) {
    return genericStrategy.abi
  }

  if (isLpPoolStrategy(strategy)) {
    return SolidlyLpPoolStrategy.abi
  }
}
