import {BigNumber, ethers} from "ethers";
import {formatUnits} from "ethers/lib/utils";
import {Address} from "wagmi";
import {VaultsData} from "../../contexts/vault-data-context/VaultDataContext";
import {structuredMulticall} from "../../contexts/vault-data-context/multicall-structured-result";
import * as HopPoolAbi from "../../resources/abis/HopPoolAbi.json";
import * as HopTracker from "../../resources/abis/HopTrackerAbi.json";
import * as hopUsdc from "../../resources/vault-details/deploy_hop_usdc-output.json";

export interface HopPoolStats {
  optimalYield: {
    [token: string]: {
      [chain: string]: {
        apr: number
      }
    }
  },
  pools: {
    [token: string]: {
      [chain: string]: {
        apr: number
      }
    }
  },
  stakingRewards: {
    [token: string]: {
      [chain: string]: {
        apr: number
      }
    }
  }
}

export const getHopApr = async (token: string, hopPrice: number, usdcPrice: number) => {
  const poolStats = await getHopPoolStats()
  const chain = 'arbitrum'
  const {rewardRate, rewardPerToken, totalSupply, virtualPrice} = await getHOPMulticallData()
  const {apr} = await getHOPRewardsAprAndApy(rewardRate, rewardPerToken, totalSupply, virtualPrice, hopPrice, usdcPrice)
  return apr + poolStats?.pools?.[token]?.[chain]?.apr * 100
}

export const extractPoolVaultsData = (vaultsData: VaultsData, vaultAddress: Address): {
  rewardRate: BigNumber,
  rewardPerToken: BigNumber,
  totalSupply: BigNumber,
  token: string
} => {
  const vaultData = vaultsData[vaultAddress]
  const additionalData = vaultData?.additionalData
  const {rewardRate, rewardPerToken, totalSupply} = additionalData
  return {rewardRate, rewardPerToken, totalSupply, token: vaultData?.tokenSymbol}
}

async function getHopPoolStats() {
  const cacheKey = 'poolStats:v000'
  try {
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      const json = JSON.parse(cached)
      if (json.timestamp > Date.now() - (10 * 60 * 1000)) {
        if (json.data) {
          console.log('returning cached poolStats')
          return json.data
        }
      }
    }
  } catch (err: any) {
  }

  const json = await getPoolStatsFile()

  try {
    localStorage.setItem(cacheKey, JSON.stringify({data: json, timestamp: Date.now()}))
  } catch (err: any) {
  }

  return json
}

async function getPoolStatsFile(): Promise<HopPoolStats> {
  const url = 'https://assets.hop.exchange/v1.1-pool-stats.json'
  const res = await fetch(url)
  const json = await res.json()
  console.log('pool stats data response:', json)
  if (!json?.data) {
    throw new Error('expected data')
  }
  return json.data
}

async function getHOPMulticallData(): Promise<{[key: string] :BigNumber}> {
  const pool = {
    abi: HopPoolAbi.abi,
    address: hopUsdc.hopPool as Address
  }

  const tracker = {
    abi: HopTracker.abi,
    address: hopUsdc.hopTracker as Address
  }

  const rewardRateFn = {
    ...pool,
    functionName: 'rewardRate',
  }

  const rewardPerTokenFn = {
    ...pool,
    functionName: 'rewardPerToken',
  }

  const totalSupplyFn = {
    ...pool,
    functionName: 'totalSupply',
  }


  const virtualPriceFn = {
    ...tracker,
    functionName: 'getVirtualPrice',
  }

  const data = await structuredMulticall(hopUsdc.hopPool as Address, [rewardRateFn, rewardPerTokenFn, totalSupplyFn, virtualPriceFn])
  const {
    rewardRate,
    rewardPerToken,
    totalSupply,
  } = data[hopUsdc.hopPool as Address][hopUsdc.hopPool as Address] as { [key: string]: BigNumber }
  
  const {
    getVirtualPrice: virtualPrice,
  } = data[hopUsdc.hopPool as Address][hopUsdc.hopTracker as Address]
  return {rewardRate, rewardPerToken, totalSupply, virtualPrice} as {[key: string] :BigNumber}
}

async function getHOPRewardsAprAndApy(
  rewardRate: BigNumber, 
  rewardPerToken: BigNumber, 
  totalSupply: BigNumber, 
  virtualPrice: BigNumber, 
  hopPrice: number, 
  usdcPrice: number
): Promise<{apy: number, apr: number}> {
  const precision = BigNumber.from(10).pow(18)
  const totalRewardsPerDay = rewardRate.mul(86400) // multiply by 1 day
  const rewardTokenUsdPriceBn = ethers.utils.parseUnits(hopPrice.toString(), 18)
  const usdcPriceBn = ethers.utils.parseUnits(usdcPrice.toString(), 18)
  
  const lpTokenPrice = usdcPriceBn.mul(virtualPrice).div(precision)

  const rateBn = totalRewardsPerDay
    .mul(rewardTokenUsdPriceBn)
    .mul(precision)
    .div(totalSupply.mul(lpTokenPrice))

  const rate = Number(formatUnits(rateBn.toString(), 18))
  const apr = rate * 365 * 100
  const apy = ((1 + rate) ** 365 - 1) * 100
  return {apr, apy}
}
