import {useContext, useEffect, useState} from "react";
import {VaultDataContext} from "../contexts/vault-data-context/VaultDataContext";
import {TokenPricesContext} from "../contexts/TokenPricesContext";
import {VaultData} from "../contexts/vault-data-context/utils";
import {Address} from "wagmi";
import {BigNumber} from 'ethers';
import {formatUnits} from 'ethers/lib/utils';
import {TvlGetter} from "../lib/get-tvl";
import {SingleStakeVault, RldVault} from "../lib/types/strategy-types";
import {isSingleStakeStrategy} from "../lib/utils";

export const useGetTVL = () => {
  const {vaultsData} = useContext(VaultDataContext)
  const {prices} = useContext(TokenPricesContext)
  const stringifiedVaultsData = JSON.stringify(vaultsData)
  const stringifiedPrices = JSON.stringify(prices)
  const [tvl, setTvl] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [tvlMap, setTvlMap] = useState<{ [address: string]: number }>({})
  const tvlGetter = new TvlGetter(prices)

  //  TODO some repeated code in this file and the tvl-getter file
  const getTvl = async (): Promise<number> => {
    return await tvlGetter.getTvl()
  }
  
  const getTvlForSingleStakeVault = (strategyVaultData: SingleStakeVault & VaultData): number => {
    const {
      vaultWantBalance,
      coinGeckoId,
      decimals,
      additionalData,
      name
    }: SingleStakeVault & VaultData = strategyVaultData as SingleStakeVault & VaultData
    const price = prices[coinGeckoId]
    let vaultTvl = parseFloat(vaultWantBalance.toString()) / (10 ** decimals)
    if (additionalData) {
      if (name === 'HOP-USDC' || name === 'HOP-USDT') {
        vaultTvl = parseFloat(formatUnits(additionalData.hopPoolBalance.mul(additionalData.hopVirtualPrice).div(BigNumber.from(10).pow(18)).div(BigNumber.from(10).pow(12)), 6));
      }
      if (name === 'HOP-ETH' || name === 'HOP-DAI') {
        vaultTvl = parseFloat(formatUnits(additionalData.hopPoolBalance.mul(additionalData.hopVirtualPrice).div(BigNumber.from(10).pow(18)), 18));
      }
    }
    return vaultTvl * price
  }

  const getTvlMap = () => {
    const tvlMap = {}
    if (Object.keys(prices).length > 0 && Object.keys(vaultsData).length > 0) {
      return Object.keys(vaultsData)
        .reduce((acc: { [address: string]: number }, curr: string) => {
          const {type, vaultAddress} = vaultsData[curr as Address] as RldVault
          if (isSingleStakeStrategy(type)) {
            acc[vaultAddress]  = getTvlForSingleStakeVault(vaultsData[curr as Address] as SingleStakeVault & VaultData)
          } else {
            // TODO add lpVaultsTvl getter
            acc[vaultAddress] = 0
          }
          return acc
        }, tvlMap)
    }
    return {}
  }

  const updateTvl = () => {
    getTvl().then(tvl => {
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
