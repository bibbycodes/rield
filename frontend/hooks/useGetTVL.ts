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
  
  const getTvl = (): number => {
    if (Object.keys(prices).length > 0) {
      const result : number = Object.keys(vaultsData).reduce((acc: number, key: Address) => {
        const {vaultWantBalance, coinGeckoId, decimals}: Strategy & VaultData = vaultsData[key] as Strategy & VaultData
        const price = prices[coinGeckoId]
        const vaultTvl = parseFloat(vaultWantBalance.toString()) / (10 ** decimals)
        const vaultTvlInDollars = vaultTvl * price
        return acc + vaultTvlInDollars
      }, 0 as number)
      return result
    } else {
      return 0
    }
  }
  
  const updateTvl = () => {
    const tvl = getTvl()
    setTvl(tvl)
    setIsLoading(false)
  }
  
  useEffect(() => {
    updateTvl()
  }, [stringifiedVaultsData, stringifiedPrices])
  
  return {
    tvl,
    updateTvl,
    isLoading
  }
}
