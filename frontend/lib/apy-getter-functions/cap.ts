/* eslint-disable */
//@ts-nocheck


import axios from "axios";
import {ethers} from "ethers";
import {Address} from "wagmi";
import capRouterAbi from '../../resources/abis/cap/cap-router.json';
import ERC20Abi from '../../resources/abis/erc20.json';
import {formatUnits} from "ethers/lib/utils";
import {getContract} from "./utils";

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
/* eslint-disable */

// Router: 0x5ABFF8F8D5b13253dCAB1e427Fdb3305cA620119
// Trading: 0xbEd32937D8A5D1421241F52809908f1a17D75bDb
// Oracle: 0xE195a15533c01c8cD6b28f09066842486f80F8f2
// Treasury: 0x283C41b726634fBD6B72aA22741B202DB7E56aaC
// Pool ETH: 0xE0cCd451BB57851c1B2172c07d8b4A7c6952a54e
// Pool USDC: 0x958cc92297e6F087f41A86125BA8E121F0FbEcF2
// Pool Rewards ETH: 0x29163356bBAF0a3bfeE9BA5a52a5C6463114Cb5f
// Pool Rewards USDC: 0x10f2f3B550d98b6E51461a83AD3FE27123391029
// Pool CAP: 0xC8CDd2Ea6A5149ced1F2d225D16a775ee081C67D
// CAP Rewards ETH: 0x1E91F67a5aa0137aD86eEbAD64E2C2a1B6ae30E5
// CAP Rewards USDC: 0xCEFFAc2522b837012B576770b6F5DD75a3F75C38

const chainData = {
  label: 'Arbitrum',
  router: '0x5ABFF8F8D5b13253dCAB1e427Fdb3305cA620119',
  explorer: 'https://arbiscan.io',
  rpc: 'https://arb1.arbitrum.io/rpc', // for walletconnect
  currencies: {
    weth: ADDRESS_ZERO,
    usdc: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8'
  },
  pools: {
    weth: "0xE0cCd451BB57851c1B2172c07d8b4A7c6952a54e",
    usdc: "0x958cc92297e6F087f41A86125BA8E121F0FbEcF2",
  },
  rewards: {
    weth: "0x29163356bBAF0a3bfeE9BA5a52a5C6463114Cb5f",
    usdc: "0x10f2f3B550d98b6E51461a83AD3FE27123391029"
  },
  poolInception: {
    weth: 1637154307000,
    usdc: 1637154307000,
    cap: 1637154307000
  },
  cap: '0x031d35296154279DC1984dCD93E392b1f946737b'
}

export type capTokens = 'weth' | 'usdc' 

export interface CapPoolStats {
  id: string;
  cumulativeFees: string;
  cumulativePnl: string;
  cumulativeVolume: string;
  cumulativeMargin: string;
  openInterest: string;
  openInterestLong: string;
  openInterestShort: string;
  positionCount: string;
  tradeCount: string;
}

export const fetchCapPoolStats = async (tokenAddress: string): Promise<CapPoolStats> => {
  const query = `
    query {
      datas(where: {id: "${tokenAddress}"}) {
      id,
      cumulativeFees,
      cumulativePnl,
      cumulativeVolume,
      cumulativeMargin,
      openInterest,
      openInterestLong,
      openInterestShort
      positionCount,
      tradeCount
    }
  }
`;

  const res = await axios({
    url: 'https://api.thegraph.com/subgraphs/name/0xcap/cap3',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      query,
      variables: {
        currency: tokenAddress
      }
    }
  })
  return res.data.data.datas[0];
}

export const capFormatUnits = (amount: string, decimals?: number) => {
  return parseInt(formatUnits(amount || 0, decimals || 8))
}

export function formatToDisplay(amount: number, maxPrecision?: number, fixPrecision?: number) {
  if (amount == undefined || isNaN(amount)) return 0;
  if (!maxPrecision) maxPrecision = 100;
  if (!fixPrecision && amount * 1 <= 100 && (amount * 1).toFixed(6)*1 == Math.round(amount * 1)) return Math.round(amount);
  if (amount * 1 >= 100000 || amount * 1 <= -100000) {
    return Math.round(amount*1).toLocaleString();
  } else if (amount * 1 >= 10 || amount * 1 <= -10) {
    return (amount * 1).toFixed(2);
  } else if (amount * 1 >= 1 || amount * 1 <= -1) {
    return +(amount * 1).toFixed(Math.min(maxPrecision,2));
  } else if (amount * 1 >= 0.1 || amount * 1 <= -0.1) {
    return +(amount * 1).toFixed(Math.min(maxPrecision,4));
  } else {
    return +(amount * 1).toFixed(Math.min(maxPrecision,6));
  }
}

export async function getCapApr(token: capTokens, provider: any): Promise<number> {
  // let {cumulativeFees, cumulativePnl} = await fetchCapPoolStats(chainData.currencies[token]);
  // [cumulativeFees, cumulativePnl] = [capFormatUnits(cumulativeFees), capFormatUnits(cumulativePnl)];
  // const poolInception = chainData.poolInception[token];
  // const currency = chainData.currencies[token] as Address;
  // const poolShare = await getPoolShare(currency, provider);
  // const timeSinceInception = Date.now() - poolInception;
  // const timeInAYear = 365 * 24 * 3600 * 1000;
  // const timeScaler = timeInAYear / timeSinceInception;
  // const tvl = await getPoolTVL(token, provider);
  // let apy = timeScaler * 100 * (cumulativeFees * poolShare / 100 - 1 * cumulativePnl) / tvl;
  // return formatToDisplay(apy)
  // TODO Monitor situation while cap has hardcoded their values
  return 20;
}

export const getRouterContract = (provider: any): ethers.Contract => {
  const contractAddress = chainData.router;
  return new ethers.Contract(contractAddress, capRouterAbi, provider);
}


export const getPoolShare = async (address: Address, provider: any) => {
  const contract = getRouterContract(provider);
  const poolShare = await contract.getPoolShare(address);
  return capFormatUnits(poolShare, 2);
}

export const getBalance = async (currency: capTokens, provider: any, poolAddress: Address) => {
  if (currency === 'weth') {
    return await provider.getBalance(poolAddress)
  }
  else {
    const contract = getContract(chainData.currencies[currency], ERC20Abi, provider);
    return contract.balanceOf(poolAddress);
  }
}

export const getPoolTVL = async (currency: capTokens, provider: any): Promise<number> => {
  const tokenAddress = chainData.currencies[currency];
  const token = getContract(tokenAddress, ERC20Abi, provider);
  const poolAddress = chainData.pools[currency] as Address;
  const decimals = currency === 'weth' ? 18 : await token.decimals();
  const balance = await getBalance(currency, provider, poolAddress);
  return capFormatUnits(balance, decimals);
}
