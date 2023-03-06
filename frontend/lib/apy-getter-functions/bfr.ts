import {BigNumber} from "ethers";
import {getContract} from "./utils";
import glpManagerAbi from '../../resources/abis/gmx/glp-manager.json'
import stakedBfr from '../../resources/abis/gmx/staked-gmx.json'
import glpFeeTracker from '../../resources/abis/gmx/fee-glp-tracker.json'
import axios from "axios";
//
// const stakedBfrTrackerAnnualRewardsUsd = stakedBfrTrackerTokensPerInterval.mul(SECONDS_PER_YEAR).mul(bfrPrice)
// const bfrAprForEsBfr = gt(multiply(stakedBFRTrakerSupply, bfrPrice), '0')
//   ? divide(
//     multiply(stakedBfrTrackerAnnualRewardsUsd, BASIS_POINTS_DIVISOR),
//     fromWei(multiply(stakedBFRTrakerSupply, bfrPrice))
//   )
//   : '0';
// const feeBfrTrackerAnnualRewardsUsd = fromWei(
//   multiply(feeBfrTrackerTokensPerInterval, SECONDS_PER_YEAR),
//   usd_decimals
// );
// const bfrAprForRewardToken =
//   feeBfrSupply > 0
//     ? divide(
//       multiply(feeBfrTrackerAnnualRewardsUsd, BASIS_POINTS_DIVISOR),
//       fromWei(multiply(feeBfrSupply, bfrPrice))
//     )
//     : '0';
//
// const bfrBoostAprForRewardToken = divide(
//   multiply(bfrAprForRewardToken, boostBasisPoints),
//   BASIS_POINTS_DIVISOR
// );
// const bfrAprTotalWithBoost = add(
//   add(bfrAprForRewardToken, bfrBoostAprForRewardToken),
//   bfrAprForEsBfr
// );


export const calculateAPR = (tokensPerInterval: BigNumber, aum: BigNumber, ethPrice: number): number => {
  const secondsPerYear = 3600 * 24 * 365;
  const tenTo18 = BigNumber.from(10).pow(18);
  const tenTo12 = BigNumber.from(10).pow(12);
  const tpi = tokensPerInterval.div(tenTo12).toNumber() / 10e5;
  return (tpi * ethPrice * secondsPerYear) /  aum.div(tenTo18).toNumber();
}

export const getBfrBlpApr = async (provider: any, token: 'BLP' | 'BFR', ethPrice?: number): Promise<number> => {
  return 30;
  // const aum = await getBfrAum(provider);
  // const tokensPerInterval = token === 'BFR' ? await getBfrTokensPerInterval(provider) : await getBLPTokensPerInterval(provider);
  // return calculateAPR(tokensPerInterval.bn, aum.bn, ethPrice ?? (await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`)).data.ethereum.usd) * 100;
}

export interface result {
  bn: BigNumber,
  asNumber: number
}

export const getBfrAum = async (provider: any): Promise<result> => {
  const contract = getContract('0x6Ec7B10bF7331794adAaf235cb47a2A292cD9c7e', glpManagerAbi, provider)
  const result = (await contract.getAumInUsdg(false)) as BigNumber
  return {bn: result, asNumber: result.div(BigNumber.from(10).pow(16)).toNumber() / 10e2}
}

export const getBlpPrice = async (provider: any): Promise<result> => {
  const contract = getContract('0x6Ec7B10bF7331794adAaf235cb47a2A292cD9c7e', glpManagerAbi, provider)
  const result = (await contract.getPrice(false)) as BigNumber
  return {bn: result, asNumber: result.div(BigNumber.from(10).pow(18)).toNumber() / 10e11}
}

export const getBfrTokensPerInterval = async (provider: any): Promise<result> => {
  const contract = getContract('0x173817F33f1C09bCb0df436c2f327B9504d6e067', stakedBfr, provider)
  const result = (await contract.tokensPerInterval()) as BigNumber
  return {bn: result, asNumber: result.div(BigNumber.from(10).pow(18)).toNumber()}
}

export const getBLPTokensPerInterval = async (provider: any): Promise<result> => {
  const contract = getContract('0xCCFd47cCabbF058Fb5566CC31b552b21279bd89a', glpFeeTracker, provider)
  const result = (await contract.tokensPerInterval()) as BigNumber
  return {bn: result, asNumber: result.div(BigNumber.from(10).pow(18)).toNumber()}
}
