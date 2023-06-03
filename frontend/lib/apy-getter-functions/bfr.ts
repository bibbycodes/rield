import { BigNumber, ethers } from "ethers";
import { getContract } from "./utils";
import stakedBfr from '../../resources/abis/gmx/staked-gmx.json'

export const BASIS_POINTS_DIVISOR = '10000';
export const SECONDS_PER_YEAR = '31536000';
export const TEN_POW_18 = BigNumber.from(10).pow(18);
export const TEN_POW_6 = BigNumber.from(10).pow(6);

function calculateAPR(bfrPrice: BigNumber,
                                 stakedBfrTrackerTokensPerInterval: BigNumber,
                                 stakedBFRTrackerSupply: BigNumber,
                                 feeBfrTrackerTokensPerInterval: BigNumber,
                                 feeBfrSupply: BigNumber) {
  const stakedBfrTrackerAnnualRewardsUsd = stakedBfrTrackerTokensPerInterval
    .mul(SECONDS_PER_YEAR)
    .mul(bfrPrice)
    .div(TEN_POW_18)
  
  const bfrAprForEsBfr = stakedBFRTrackerSupply.mul(bfrPrice).gt(0)
    ? stakedBfrTrackerAnnualRewardsUsd.mul(BASIS_POINTS_DIVISOR).div(stakedBFRTrackerSupply.mul(bfrPrice).div(TEN_POW_18))
    : BigNumber.from(0);
  
  const feeBfrTrackerAnnualRewardsUsd = feeBfrTrackerTokensPerInterval.mul(SECONDS_PER_YEAR).div(TEN_POW_6);
  const bfrAprForRewardToken = feeBfrSupply.gt(0)
    ? feeBfrTrackerAnnualRewardsUsd.mul(BASIS_POINTS_DIVISOR).div(feeBfrSupply.mul(bfrPrice).div(TEN_POW_18).div(TEN_POW_18))
    : BigNumber.from(0);
  // const boostBasisPoints = bonusBfrInFeeBfr > 0 ? bnBfrInFeeBfr.mul(BASIS_POINTS_DIVISOR).div(bonusBfrInFeeBfr)
  //     : '0';

  // const bfrBoostAprForRewardToken = bfrAprForRewardToken.mul(boostBasisPoints).div(BASIS_POINTS_DIVISOR);
  const bfrAprTotalWithBoost = bfrAprForRewardToken
    // .add(bfrBoostAprForRewardToken)
    .add(bfrAprForEsBfr);
  return bfrAprTotalWithBoost;
}

export const getBfrBlpApr = async (provider: any, token: 'BLP' | 'BFR', ethPrice?: number): Promise<number> => {
  let {
    tokensPerInterval: stakedBfrTrackerTokensPerInterval,
    totalSupply: stakedBFRTrakerSupply
  } = await getBfrTokensPerInterval(provider);
  let {
    tokensPerInterval: feeBfrTrackerTokensPerInterval,
    totalSupply: feeBfrSupply
  } = await getFeeBfrTrackerTokensPerInterval(provider);
  return calculateAPR(
    ethers.utils.parseUnits((ethPrice ?? 0).toString(), 18),
    stakedBfrTrackerTokensPerInterval.bn,
    stakedBFRTrakerSupply.bn,
    feeBfrTrackerTokensPerInterval.bn,
    feeBfrSupply.bn)
    .toNumber() / 100;
}

export interface result {
  bn: BigNumber,
  asNumber: number
}

export const getBfrTokensPerInterval = async (provider: any): Promise<{ tokensPerInterval: result, totalSupply: result }> => {
  const contract = getContract('0x173817F33f1C09bCb0df436c2f327B9504d6e067', stakedBfr, provider)
  const result = (await contract.tokensPerInterval()) as BigNumber
  const totalSupply = (await contract.totalSupply()) as BigNumber
  return {
    tokensPerInterval: {bn: result, asNumber: result.div(BigNumber.from(10).pow(18)).toNumber()},
    totalSupply: {bn: totalSupply, asNumber: totalSupply.div(BigNumber.from(10).pow(18)).toNumber()}
  }
}

export const getFeeBfrTrackerTokensPerInterval = async (provider: any): Promise<{ tokensPerInterval: result, totalSupply: result }> => {
  const contract = getContract('0xBABF696008DDAde1e17D302b972376B8A7357698', stakedBfr, provider)
  const result = (await contract.tokensPerInterval()) as BigNumber
  const totalSupply = (await contract.totalSupply()) as BigNumber
  return {
    tokensPerInterval: {bn: result, asNumber: result.div(BigNumber.from(10).pow(18)).toNumber()},
    totalSupply: {bn: totalSupply, asNumber: totalSupply.div(BigNumber.from(10).pow(18)).toNumber()}
  }
}
