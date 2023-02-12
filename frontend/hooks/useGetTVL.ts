import {useContext, useEffect, useState} from "react";
import {VaultDataContext} from "../contexts/vault-data-context/VaultDataContext";
import {TokenPricesContext} from "../contexts/TokenPricesContext";
import {Strategy} from "../model/strategy";
import {VaultData} from "../contexts/vault-data-context/utils";
import {Address} from "wagmi";

export const useGetTVL = () => {
  const {vaultsData} = useContext(VaultDataContext)
  const {prices} = useContext(TokenPricesContext)
  const stringifiedVaultsData = JSON.stringify(vaultsData)
  const stringifiedPrices = JSON.stringify(prices)
  const [tvl, setTvl] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [tvlMap, setTvlMap] = useState<{ [address: string]: number }>({})

  const getTvl = (): number => {
    if (Object.keys(prices).length > 0) {
      return Object.keys(vaultsData)
        .reduce((acc: number, curr: string) => {
          const {
            vaultWantBalance,
            coinGeckoId,
            decimals
          }: Strategy & VaultData = vaultsData[curr as Address] as Strategy & VaultData
          const price = prices[coinGeckoId]
          const vaultTvl = parseFloat(vaultWantBalance.toString()) / (10 ** decimals)
          const vaultTvlInDollars = vaultTvl * price
          return acc + vaultTvlInDollars
        }, 0 as number)
    } else {
      return 0
    }
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
            decimals
          }: Strategy & VaultData = vaultsData[curr as Address] as Strategy & VaultData
          const price = prices[coinGeckoId]
          const vaultTvl = parseFloat(vaultWantBalance.toString()) / (10 ** decimals)
          acc[vaultAddress] = vaultTvl * price
          return acc
        }, tvlMap)
    }
    return {}
  }

  const updateTvl = () => {
    const tvl = getTvl()
    setTvl(tvl)
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
