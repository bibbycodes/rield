import {BigNumber} from "ethers";
import {getContract} from "./utils";
import glpManagerAbi from '../../resources/abis/gmx/glp-manager.json'
import stakedGmx from '../../resources/abis/gmx/staked-gmx.json'
import glpFeeTracker from '../../resources/abis/gmx/fee-glp-tracker.json'
import axios from "axios";

export const calculateAPR = (tokensPerInterval: BigNumber, aum: BigNumber, ethPrice: number): number => {
  const secondsPerYear = 3600 * 24 * 365;
  const tenTo18 = BigNumber.from(10).pow(18);
  const tenTo12 = BigNumber.from(10).pow(12);
  const tpi = tokensPerInterval.div(tenTo12).toNumber() / 10e5;
  console.log((tpi * ethPrice * secondsPerYear) /  aum.div(tenTo18).toNumber())
  return (tpi * ethPrice * secondsPerYear) /  aum.div(tenTo18).toNumber();
}

export const getGmxGlpApr = async (provider: any, token: 'GLP' | 'GMX'): Promise<number> => {
  const {data} = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`)
  const ethPrice = data.ethereum.usd;
  const aum = await getGmxAum(provider);
  const tokensPerInterval = token === 'GMX' ? await getGmxTokensPerInterval(provider) : await getGLPTokensPerInterval(provider);
  return calculateAPR(tokensPerInterval.bn, aum.bn, ethPrice) * 100;
}

export interface result {
  bn: BigNumber,
  asNumber: number
}

export const getGmxAum = async (provider: any): Promise<result> => {
  const contract = getContract('0x3963FfC9dff443c2A94f21b129D429891E32ec18', glpManagerAbi, provider)
  const result = (await contract.getAumInUsdg(false)) as BigNumber
  return {bn: result, asNumber: result.div(BigNumber.from(10).pow(16)).toNumber() / 10e2}
}

export const getGlpPrice = async (provider: any): Promise<result> => {
  const contract = getContract('0x3963FfC9dff443c2A94f21b129D429891E32ec18', glpManagerAbi, provider)
  const result = (await contract.getPrice(false)) as BigNumber
  return {bn: result, asNumber: result.div(BigNumber.from(10).pow(18)).toNumber() / 10e11}
}

export const getGmxTokensPerInterval = async (provider: any): Promise<result> => {
  const contract = getContract('0xd2D1162512F927a7e282Ef43a362659E4F2a728F', stakedGmx, provider)
  const result = (await contract.tokensPerInterval()) as BigNumber
  return {bn: result, asNumber: result.div(BigNumber.from(10).pow(18)).toNumber()}
}

export const getGLPTokensPerInterval = async (provider: any): Promise<result> => {
  const contract = getContract('0x4e971a87900b931ff39d1aad67697f49835400b6', glpFeeTracker, provider)
  const result = (await contract.tokensPerInterval()) as BigNumber
  return {bn: result, asNumber: result.div(BigNumber.from(10).pow(18)).toNumber()}
}
