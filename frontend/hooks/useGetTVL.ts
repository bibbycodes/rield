import {useContext, useEffect, useState} from "react";
import {VaultDataContext} from "../contexts/vault-data-context/VaultDataContext";
import {TokenPricesContext} from "../contexts/TokenPricesContext";
import {Strategy} from "../model/strategy";
import {VaultData} from "../contexts/vault-data-context/utils";
import {Address} from "wagmi";
import {BigNumber} from 'ethers';
import {formatUnits} from 'ethers/lib/utils';
import {TvlGetter} from "../lib/get-tvl";

export const useGetTVL = () => {
  const {vaultsData} = useContext(VaultDataContext)
  const {prices} = useContext(TokenPricesContext)
  const stringifiedVaultsData = JSON.stringify(vaultsData)
  const stringifiedPrices = JSON.stringify(prices)
  const [tvl, setTvl] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [tvlMap, setTvlMap] = useState<{ [address: string]: number }>({})
  const tvlGetter = new TvlGetter(prices)

  const getTvl = async (): Promise<number> => {
    return await tvlGetter.getTvl()
  }

  const getTvlMap = () => {
    const tvlMap = {}
    if (Object.keys(prices).length > 0 && Object.keys(vaultsData).length > 0) {
      return Object.keys(vaultsData)
        .reduce((acc: { [address: string]: number }, curr: string) => {
          const {
            vaultWantBalance,
            coinGeckoId,
            vaultAddress,
            decimals,
            additionalData,
            name
          }: Strategy & VaultData = vaultsData[curr as Address] as Strategy & VaultData
          const price = prices[coinGeckoId]
          let vaultTvl = parseFloat(vaultWantBalance.toString()) / (10 ** decimals)
          if ((name === 'HOP-USDC' || name === 'HOP-USDT') && additionalData) {
            vaultTvl = parseFloat(formatUnits(additionalData.hopPoolBalance.mul(additionalData.hopVirtualPrice).div(BigNumber.from(10).pow(18)).div(BigNumber.from(10).pow(12)), 6));
          }
          acc[vaultAddress] = vaultTvl * price
          return acc
        }, tvlMap)
    }
    return {}
  }

  const updateTvl = () => {
    getTvl().then(tvl => {
      console.log({tvl})
      setTvl(tvl)
    })
    const tvlMap = getTvlMap()
    setTvlMap(tvlMap)
    setIsLoading(false)
  }

  useEffect(() => {
    updateTvl()
  }, [stringifiedVaultsData, stringifiedPrices])

  return {
    tvl,
    updateTvl,
    isLoading,
    tvlMap
  }
}
