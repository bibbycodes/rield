import {createContext, useEffect, useState} from "react";
import {Address, useAccount} from "wagmi";
import {erc20Strategies, ethStrategies, strategies, Strategy} from '../../model/strategy'
import {ADDRESS_ZERO} from "../../lib/apy-getter-functions/cap";
import {
  getMultiCallDataForErc20Vault,
  getMultiCallDataForEthVault,
  getVaultMultiCallData,
  MultiCallInput,
  VaultData
} from "./utils";
import {
  structuredMulticall,
  structuredMulticallFromCallInfo,
  transformMultiCallData
} from './multicall-structured-result';

export interface VaultsData { [vaultAddress: Address]: Strategy & VaultData }
export interface VaultContextData {
  vaultsData: VaultsData
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

  const refetchForStrategy = async (strategy: Strategy, userAddress: Address) => {
    const isEthVault = strategy.tokenAddress === ADDRESS_ZERO
    const multiCallData: MultiCallInput[] = isEthVault ? getMultiCallDataForEthVault(strategy, userAddress) : getMultiCallDataForErc20Vault(strategy, userAddress)
    const data = await structuredMulticall(strategy.strategyAddress, multiCallData)
    const vaultDataForStrategy = transformMultiCallData(data, [strategy])[strategy.vaultAddress]
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
      } = getVaultMultiCallData(strategies, address)
      const erc20DVaultDataCalls = structuredMulticallFromCallInfo(erc20VaultCallData)
      const ethVaultDataCalls = structuredMulticallFromCallInfo(ethVaultCallData)

      Promise.all([erc20DVaultDataCalls, ethVaultDataCalls]).then(data => {
        const erc20VaultData = transformMultiCallData(data[0], erc20Strategies)
        const ethVaultData = transformMultiCallData(data[1], ethStrategies)
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
