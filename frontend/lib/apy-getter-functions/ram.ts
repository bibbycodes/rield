import {getContract} from "./utils";
import gauge from "../../resources/abis/ram/gauge.json";
import erc20Abi from "../../resources/abis/erc20.json";
import solidlyPairAbi from "../../resources/abis/solidlyPair.json";
import {Address} from "wagmi";
import {BigNumber, ethers} from "ethers";
import {LpPoolVault} from "../types/strategy-types";
import {Prices} from "../../contexts/TokenPricesContext";
import {vaultAddressToRldVault} from "../../model/strategy";

export const SECONDS_PER_YEAR = '31536000';
export const TEN_POW_18 = BigNumber.from(10).pow(18);

export interface SolidlyPoolVaultDetails {
  vaultAddress: Address;
  strategyAddress: Address;
  gaugeAddress: Address;
  lp0Address: Address;
  lp1Address: Address;
  inputTokenAddress: Address;
  routerAddress: Address;
  wantTokenAddress: Address;
  rewardTokenAddress: Address;
  isStable: string;
  rewardTokenAddresses: Address[];
}


export const  getSolidlyApr = async (provider: any, prices: Prices, vaultDetails: SolidlyPoolVaultDetails) => {
  const {
    rewardTokenAddress,
    gaugeAddress,
    lp1Address,
    lp0Address,
    wantTokenAddress
  } = vaultDetails;
  const lpVault = vaultAddressToRldVault[vaultDetails.vaultAddress] as LpPoolVault;
  
  if (!lpVault) {
    return 0;
  }
  
  const lp0Price = prices[lpVault.lp0CoinGeckoId as string];
  const lp1Price = prices[lpVault.lp1CoinGeckoId as string];
  
  const guageContract = getContract(gaugeAddress, gauge.abi, provider)
  const wantTokenContract = getContract(wantTokenAddress, solidlyPairAbi, provider)
  const lp0Contract = getContract(lp0Address, erc20Abi, provider)
  const lp1Contract = getContract(lp1Address, erc20Abi, provider)
  const rewardTokenContract = getContract(rewardTokenAddress, erc20Abi, provider)

  const lp0Decimals = await lp0Contract.decimals();
  const lp1Decimals = await lp1Contract.decimals();
  const decimalDifference = Math.abs(lp0Decimals - lp1Decimals);
  const rewardTokenDecimals = await rewardTokenContract.decimals();
  const lp0Multiplier = BigNumber.from(10).pow(lp0Decimals);
  const lp1Multiplier = BigNumber.from(10).pow(lp1Decimals);
  const decimalDifferenceMultiplier = BigNumber.from(10).pow(decimalDifference);
  const rewardTokenMultiplier = BigNumber.from(10).pow(rewardTokenDecimals);

  const lp0PriceBn = convertPriceToBigNumber(lp0Price, lp0Decimals);
  const lp1PriceBn = convertPriceToBigNumber(lp1Price, lp1Decimals)

  //  How many want tokens are staked in the gauge
  const totalSupplyGauge = (await guageContract.totalSupply())
  // How many want tokens are in circulation
  const totalSupplyUnderlying = (await wantTokenContract.totalSupply())
  // How much of each token is in the liquidity pool
  const reserve0 = (await wantTokenContract.reserve0())
  const reserve1 = (await wantTokenContract.reserve1())

  // Hoe much of each token is staked in the gauge
  const reserve0ForGauge = reserve0.mul(totalSupplyGauge).div(totalSupplyUnderlying)
  const reserve1ForGauge = reserve1.mul(totalSupplyGauge).div(totalSupplyUnderlying)

  // How much is the want token worth in USD
  // How many rewards are distributed per year in USD based on the current reward rate
  const annualUsdRewards = await getRewardsPerYearInUsd(provider, lpVault, guageContract, prices);
  //  Total amount staked in the gauge contract
  const reserve0ValueInUsd = reserve0ForGauge.mul(lp0PriceBn).div(lp0Multiplier)
  const reserve1ValueInUsd = reserve1ForGauge.mul(lp1PriceBn).div(lp1Multiplier)
  let totalAmountStakedInUsd;
  
  if (lp0Decimals < lp1Decimals) {
    totalAmountStakedInUsd = reserve0ValueInUsd.mul(decimalDifferenceMultiplier).add(reserve1ValueInUsd)
  } else {
    totalAmountStakedInUsd = reserve1ValueInUsd.mul(decimalDifferenceMultiplier).add(reserve0ValueInUsd)
  }

  const rewardsOverTotalStaked = ethers.utils.formatEther(annualUsdRewards.div(totalAmountStakedInUsd))
  return parseFloat(rewardsOverTotalStaked) * 100
}

const getRewardsPerYearInUsd = async (provider: any, lpVault: LpPoolVault, contract: any, prices: Prices) => {
  let runningTotal = BigNumber.from(0);
  for (let i = 0; i < lpVault.rewardTokenAddresses.length; i++) {
    const rewardTokenAddress = lpVault.rewardTokenAddresses[i];
    const rewardTokenContract = getContract(rewardTokenAddress, erc20Abi, provider)
    const rewardTokenDecimals = await rewardTokenContract.decimals();
    const multiplier = BigNumber.from(10).pow(rewardTokenDecimals);
    const coinGeckoId = lpVault.tokenAddressToCoinGeckoIdMap[rewardTokenAddress];
    const rewardRate = await contract.rewardRate(rewardTokenAddress as string);
    const rewardTokenPrice = convertPriceToBigNumber(prices[coinGeckoId as string])
    runningTotal = runningTotal.add(rewardRate.mul(SECONDS_PER_YEAR).mul(rewardTokenPrice).div(multiplier))
  }
  return runningTotal
}

const getWantTokenPrice = async (
  wantTokenContract: any,
  lp0Price: BigNumber,
  lp1Price: BigNumber,
  lp0Reserves: BigNumber,
  lp1Reserves: BigNumber,
  lp0Multiplier: BigNumber,
  lp1Multiplier: BigNumber
): Promise<BigNumber> => {
  const wantTokenSupply = await wantTokenContract.totalSupply();
  const lp0Value = lp0Price.mul(lp0Reserves).div(lp0Multiplier)
  const lp1Value = lp1Price.mul(lp1Reserves).div(lp1Multiplier)
  console.log({
    lp0Value: ethers.utils.formatEther(lp0Value),
    lp1Value: ethers.utils.formatEther(lp1Value),
  })
  //  Total value staked in liquidity pool
  const totalValue = lp0Value.add(lp1Value)
  //  One want token is worth the total value in the pool divided by the total supply of want tokens
  return totalValue.div(wantTokenSupply)
}

const getReserves = async (routerContract: any, lp0Address: Address, lp1Address: Address, isStable: boolean): Promise<{ lp0Reserves: BigNumber, lp1Reserves: BigNumber }> => {
  const {reserveA, reserveB} = await routerContract.getReserves(lp0Address, lp1Address, isStable);
  return {lp0Reserves: reserveA, lp1Reserves: reserveB};
}

const convertPriceToBigNumber = (price: number, decimals: number = 18): BigNumber => {
  return ethers.utils.parseUnits((price ?? 0).toString(), decimals)
}

const getBool = (value: string): boolean => {
  return value === 'true'
}
