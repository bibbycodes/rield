import {getContract} from "./utils";
import gauge from "../../resources/abis/ram/gauge.json";
import router from "../../resources/abis/ram/router.json";
import erc20Abi from "../../resources/abis/erc20.json";
import {Address} from "wagmi";
import {BigNumber, ethers} from "ethers";

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
}


export const getSolidlyApr = async (provider: any, lp0Price: number, lp1Price: number, rewardTokenPrice: number, vaultDetails: SolidlyPoolVaultDetails) => {
  const {
    rewardTokenAddress,
    gaugeAddress,
    routerAddress,
    isStable,
    lp1Address,
    lp0Address,
    wantTokenAddress
  } = vaultDetails;
  const guageContract = getContract(gaugeAddress, gauge.abi, provider)
  const routerContract = getContract(routerAddress, router.abi, provider)
  const wantTokenContract = getContract(wantTokenAddress, erc20Abi, provider)
  const lp0Contract = getContract(lp0Address, erc20Abi, provider)
  const lp1Contract = getContract(lp1Address, erc20Abi, provider)
  const rewardTokenContract = getContract(rewardTokenAddress, erc20Abi, provider)

  const lp0Decimals = await lp0Contract.decimals();
  const lp1Decimals = await lp1Contract.decimals();
  const rewardTokenDecimals = await rewardTokenContract.decimals();
  const lp0Multiplier = BigNumber.from(10).pow(lp0Decimals);
  const lp1Multiplier = BigNumber.from(10).pow(lp1Decimals);
  const rewardTokenMultiplier = BigNumber.from(10).pow(rewardTokenDecimals);

  const lp0PriceBn = convertPriceToBigNumber(lp0Price)
  const lp1PriceBn = convertPriceToBigNumber(lp1Price)
  const rewardTokenPriceBn = convertPriceToBigNumber(rewardTokenPrice)

  //  How many want tokens are staked in the gauge
  const totalSupply = await guageContract.totalSupply();
  // how many of each token is in the Liquidity Pool
  const {lp0Reserves, lp1Reserves} = await getReserves(routerContract, lp0Address, lp1Address, getBool(isStable));
  // How much is the want token worth in USD
  const wantTokenPriceInUsd = await getWantTokenPrice(wantTokenContract, lp0PriceBn, lp1PriceBn, lp0Reserves, lp1Reserves, lp0Multiplier, lp1Multiplier);
  // How many rewards are distributed per year in USD based on the current reward rate
  const annualUsdRewards = await getRewardsPerYearInUsd(provider, rewardTokenAddress, rewardTokenPriceBn, guageContract, rewardTokenMultiplier);
  //  Total amount staked in the gauge contract
  const totalAmountStakedInUsd = totalSupply.mul(wantTokenPriceInUsd)

  const rewardsOverTotalStaked = ethers.utils.formatEther(annualUsdRewards.mul(TEN_POW_18).div(totalAmountStakedInUsd))
  return parseFloat(rewardsOverTotalStaked) * 100
}

const getRewardsPerYearInUsd = async (provider: any, rewardTokenAddress: Address, rewardTokenPrice: BigNumber, contract: any, multiplier: BigNumber) => {
  const rewardRate = await contract.rewardRate(rewardTokenAddress as string);
  return rewardRate.mul(SECONDS_PER_YEAR).mul(rewardTokenPrice).div(multiplier)
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
