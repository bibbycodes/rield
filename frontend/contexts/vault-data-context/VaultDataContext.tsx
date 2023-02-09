import { createContext, useEffect, useState } from "react";
import { Address, useAccount } from "wagmi";
import { availableStrategies, Strategy } from '../../model/strategy'
import { ADDRESS_ZERO } from "../../lib/apy-getter-functions/cap";
import { multicall } from "@wagmi/core";
import {
  getMultiCallDataForErc20Vault,
  getMultiCallDataForEthVault,
  getVaultMultiCallData,
  MultiCallInput,
  VaultData
} from "./utils";
import { BigNumber } from 'ethers';

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
    .filter(strategy => strategy.isActive)
  const ethVaults = availableStrategies
    .filter(strategy => strategy.tokenAddress === ADDRESS_ZERO)
    .filter(strategy => strategy.isActive)


  const refetchForStrategy = async (strategy: Strategy, userAddress: Address) => {
    const isEthVault = strategy.tokenAddress === ADDRESS_ZERO
    const multiCallData: MultiCallInput[] = isEthVault ? getMultiCallDataForEthVault(strategy, userAddress) : getMultiCallDataForErc20Vault(strategy, userAddress)
    const data = await multicall({contracts: multiCallData})
    let vaultBalance, vaultPricePerFullShare, allowance, tokenBalance, vaultWantBalance

    if (isEthVault) {
      ([vaultBalance, vaultPricePerFullShare, vaultWantBalance] = data as BigNumber[])
    } else {
      ([vaultBalance, vaultPricePerFullShare, allowance, tokenBalance, vaultWantBalance] = data as BigNumber[])
    }

    setVaultsData({
      ...vaultsData,
      [strategy.vaultAddress]: {
        ...strategy,
        vaultPricePerFullShare,
        vaultBalance,
        vaultWantBalance,
        allowance,
        tokenBalance
      }
    })
  }


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
          const strategyData = data[0].slice(index * 5, index * 5 + 5)
          return {
            ...acc,
            [strategy.vaultAddress]: {
              ...strategy,
              vaultBalance: strategyData[0],
              vaultPricePerFullShare: strategyData[1],
              allowance: strategyData[2],
              tokenBalance: strategyData[3],
              vaultWantBalance: strategyData[4],
            }
          }
        }, {} as any)

        const ethVaultData = ethVaults.reduce((acc, strategy, index) => {
          const strategyData = data[1].slice(index * 3, index * 3 + 3)
          return {
            ...acc,
            [strategy.vaultAddress]: {
              ...strategy,
              vaultBalance: strategyData[0],
              vaultPricePerFullShare: strategyData[1],
              vaultWantBalance: strategyData[2],
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
