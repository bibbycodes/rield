import { createContext, useEffect, useState } from "react";
import { Address, useAccount } from "wagmi";
import { availableStrategies, Strategy } from '../../model/strategy'
import { ADDRESS_ZERO } from "../../lib/apy-getter-functions/cap";
import {
  extractStrategySpecificData,
  getMultiCallDataForErc20Vault,
  getMultiCallDataForEthVault,
  getVaultMultiCallData,
  MultiCallInput,
  VaultData
} from "./utils";
import { structuredMulticall } from './multicall-structured-result';

export interface VaultContextData {
  vaultsData: { [vaultAddress: Address]: Strategy & VaultData }
  isLoading: boolean
  refetchForStrategy: (strategy: Strategy, userAddress: Address) => Promise<void>
  refetchAll: () => Promise<void>
}

const VaultDataContext = createContext<VaultContextData>({
  vaultsData: {},
  isLoading: true,
  refetchForStrategy: () => Promise.resolve(),
  refetchAll: () => Promise.resolve()
})

const VaultDataContextProvider = ({children}: {
  children: React.ReactNode;
}) => {
  const {address} = useAccount();
  const [vaultsData, setVaultsData] = useState<{ [vaultAddress: Address]: any }>({})
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const erc20Vaults = availableStrategies
    .filter(strategy => strategy.tokenAddress !== ADDRESS_ZERO)
    .filter(strategy => strategy.status !== 'DISABLED')
  const ethVaults = availableStrategies
    .filter(strategy => strategy.tokenAddress === ADDRESS_ZERO)
    .filter(strategy => strategy.status !== 'DISABLED')


  const refetchForStrategy = async (strategy: Strategy, userAddress: Address) => {
    const isEthVault = strategy.tokenAddress === ADDRESS_ZERO
    const multiCallData: MultiCallInput[] = isEthVault ? getMultiCallDataForEthVault(strategy, userAddress) : getMultiCallDataForErc20Vault(strategy, userAddress)
    const data = await structuredMulticall({contracts: multiCallData})

    const vaultDataForStrategy = {
      ...strategy,
      vaultBalance: data[strategy.vaultAddress]['balanceOf'],
      vaultPricePerFullShare: data[strategy.vaultAddress]['getPricePerFullShare'],
      allowance: data[strategy.tokenAddress]['allowance'],
      tokenBalance: data[strategy.tokenAddress]['balanceOf'],
      vaultWantBalance: data[strategy.vaultAddress]['balance'],
      paused: data[strategy.strategyAddress]['paused'],
      lastHarvest: data[strategy.strategyAddress]['lastHarvest'],
      lastPoolDepositTime: data[strategy.strategyAddress]['lastPoolDepositTime'],
      lastPauseTime: data[strategy.strategyAddress]['lastPauseTime'],
      additionalData: extractStrategySpecificData(strategy, data)
    };
    setVaultsData({
      ...vaultsData,
      [strategy.vaultAddress]: vaultDataForStrategy
    })
  }


  const getVaultData = async () => {
    if (address) {
      const {
        erc20VaultCallData,
        ethVaultCallData
      } = getVaultMultiCallData(availableStrategies, address)
      const erc20DVaultDataCalls = structuredMulticall({contracts: erc20VaultCallData})

      const ethVaultDataCalls = structuredMulticall({contracts: ethVaultCallData})

      Promise.all([erc20DVaultDataCalls, ethVaultDataCalls]).then(data => {
        const erc20VaultData = erc20Vaults.reduce((acc, strategy) => {
          return {
            ...acc,
            [strategy.vaultAddress]: {
              ...strategy,
              vaultBalance: data[0][strategy.vaultAddress]['balanceOf'],
              vaultPricePerFullShare: data[0][strategy.vaultAddress]['getPricePerFullShare'],
              allowance: data[0][strategy.tokenAddress]['allowance'],
              tokenBalance: data[0][strategy.tokenAddress]['balanceOf'],
              vaultWantBalance: data[0][strategy.vaultAddress]['balance'],
              paused: data[0][strategy.strategyAddress]['paused'],
              lastHarvest: data[0][strategy.strategyAddress]['lastHarvest'],
              lastPoolDepositTime: data[0][strategy.strategyAddress]['lastPoolDepositTime'],
              lastPauseTime: data[0][strategy.strategyAddress]['lastPauseTime'],
              additionalData: extractStrategySpecificData(strategy, data[0])
            }
          }
        }, {} as any)

        const ethVaultData = ethVaults.reduce((acc, strategy) => {
          return {
            ...acc,
            [strategy.vaultAddress]: {
              ...strategy,
              vaultBalance: data[1][strategy.vaultAddress]['balanceOf'],
              vaultPricePerFullShare: data[1][strategy.vaultAddress]['getPricePerFullShare'],
              vaultWantBalance: data[1][strategy.vaultAddress]['balance'],
              paused: data[1][strategy.strategyAddress]['paused'],
              lastHarvest: data[1][strategy.strategyAddress]['lastHarvest'],
              lastPoolDepositTime: data[1][strategy.strategyAddress]['lastPoolDepositTime'],
              lastPauseTime: data[1][strategy.strategyAddress]['lastPauseTime'],
              additionalData: extractStrategySpecificData(strategy, data[1])
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
    <VaultDataContext.Provider value={{vaultsData, isLoading, refetchForStrategy, refetchAll: getVaultData}}>
      {children}
    </VaultDataContext.Provider>
  )
}

export { VaultDataContext, VaultDataContextProvider }
