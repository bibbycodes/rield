import {createContext, useEffect, useState} from "react";
import {Address, useAccount} from "wagmi";
import {availableStrategies, Strategy} from '../../model/strategy'
import {ADDRESS_ZERO} from "../../lib/apy-getter-functions/cap";
import {multicall} from "@wagmi/core";
import {getVaultMultiCallData, refetchSingle, VaultData} from "./utils";

export interface VaultContextData {
  vaultsData: { [vaultAddress: Address]: Strategy & VaultData}
  isLoading: boolean
  refetchSingle: (strategy: Strategy, userAddress: Address) => Promise<VaultData>
  refetchAll: () => Promise<void>
}

const VaultDataContext = createContext<VaultContextData>({
  vaultsData: {},
  isLoading: true,
  refetchSingle: () => Promise.resolve({} as VaultData),
  refetchAll: () => Promise.resolve()
})


const VaultDataContextProvider = ({children}: {
  children: React.ReactNode;
}) => {
  const {address} = useAccount();
  const [vaultsData, setVaultsData] = useState<{ [vaultAddress: Address]: any }>({})
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const erc20Vaults = availableStrategies.filter(strategy => strategy.tokenAddress !== ADDRESS_ZERO)
  const ethVaults = availableStrategies.filter(strategy => strategy.tokenAddress === ADDRESS_ZERO)
  
  const getVaultData = async () => {
    if (address) {
      const {
        erc20VaultCallData,
        ethVaultCallData
      } = getVaultMultiCallData(availableStrategies, address)
      const erc20DVaultDataCalls = multicall({
        contracts: erc20VaultCallData
      })

      const ethVaultDataCalls = multicall({
        contracts: ethVaultCallData
      })

      Promise.all([erc20DVaultDataCalls, ethVaultDataCalls]).then(data => {
        const erc20VaultData = erc20Vaults.reduce((acc, strategy, index) => {
          const strategyData = data[0].slice(index * 4, index * 4 + 4)
          return {
            ...acc,
            [strategy.vaultAddress]: {
              ...strategy,
              vaultBalance: strategyData[0],
              vaultPricePerFullShare: strategyData[1],
              allowance: strategyData[2],
              tokenBalance: strategyData[3],
            }
          }
        }, {} as any)

        const ethVaultData = ethVaults.reduce((acc, strategy, index) => {
          const strategyData = data[1].slice(index * 2, index * 2 + 2)
          return {
            ...acc,
            [strategy.vaultAddress]: {
              ...strategy,
              vaultBalance: strategyData[0],
              vaultPricePerFullShare: strategyData[1],
            }
          }
        }, {} as any)


        setVaultsData({
          ...erc20VaultData,
          ...ethVaultData
        })
        setIsLoading(false)
      })
    }
  }
  
  useEffect(() => {
    getVaultData()
  }, [address])


  return (
    <VaultDataContext.Provider value={{vaultsData, isLoading, refetchSingle, refetchAll: getVaultData}}>
      {children}
    </VaultDataContext.Provider>
  )
}

export {VaultDataContext, VaultDataContextProvider}
