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

export const getHopApr = async (token: string) => {
  const poolStats = await getHopPoolStats()
  const chain = 'arbitrum'
  // HOP this HOP protocol is returning different APRs for the optimalYield and pools field depending
  // on if the stakingRewards field is present or not
  if (!poolStats?.stakingRewards?.[token]) {
    return poolStats?.pools?.[token]?.[chain]?.apr * 100;
  }
  return poolStats?.optimalYield?.[token]?.[chain]?.apr * 100 + poolStats?.pools?.[token]?.[chain]?.apr * 100
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
