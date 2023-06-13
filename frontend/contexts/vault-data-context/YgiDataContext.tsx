import { createContext, useEffect, useState } from "react";
import { Address, useAccount } from "wagmi";
import { ADDRESS_ZERO } from "../../lib/apy-getter-functions/cap";
import {
  getFollowUpMultiCallDataForYgi,
  getMultiCallDataForYgi,
  getUserToVaultToAmount,
  getYgiMultiCallData,
  MultiCallInput,
  YgiData
} from "./utils";
import {
  structuredMulticall,
  structuredMulticallFromCallInfo,
  transformYgiMultiCallData
} from './multicall-structured-result';
import { Ygi, ygis } from '../../model/ygi';
import ygi from '../../pages/ygi';

export interface YgiContextData {
  ygisData: YgiData
  isLoading: boolean
  refetchForYgi: (ygi: Ygi, userAddress: Address) => Promise<void>
  refetchAll: () => Promise<void>
}

const YgiDataContext = createContext<YgiContextData>({
  ygisData: {},
  isLoading: true,
  refetchForYgi: () => Promise.resolve(),
  refetchAll: () => Promise.resolve()
})

const YgiDataContextProvider = ({children}: {
  children: React.ReactNode;
}) => {
  const {address} = useAccount();
  const [ygisData, setYgisData] = useState<{ [ygiAddress: Address]: any }>({})
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const refetchForYgi = async (ygi: Ygi, userAddress: Address) => {
    const isEthYgi = ygi.tokenAddress === ADDRESS_ZERO
    const multiCallData: MultiCallInput[] = getMultiCallDataForYgi(ygi, userAddress)
    const data = await structuredMulticall(ygi.vaultAddress, multiCallData)
    const structuredData = {
      ygiInputToken: data[ygi.vaultAddress][ygi.vaultAddress]['ygiInputToken'],
      ygiComponents: data[ygi.vaultAddress][ygi.vaultAddress]['ygiComponents']
    };

    const vaultAddresses = (structuredData.ygiComponents as { vault: Address }[]).map(vaultInfo => vaultInfo.vault);
    const vaultToAmount = getUserToVaultToAmount(ygi, vaultAddresses, userAddress)
    setYgisData({
      ...ygisData,
      [ygi.vaultAddress]: {structuredData, vaultToAmount}
    })
  }

  const getYgiData = async () => {
    if (address) {
      const callData = getYgiMultiCallData(ygis, address)
      const erc20DVaultDataCalls = structuredMulticallFromCallInfo(callData)

      const data = await Promise.all([erc20DVaultDataCalls])
      let transformedVaultData = {...transformYgiMultiCallData(data[0], ygis)};
      const followUpCalls = new Map<Address, MultiCallInput[]>()
      ygis.forEach(ygi => {
        transformedVaultData[ygi.vaultAddress].ygiComponents.forEach((component: any) => {
          if (!followUpCalls.has(component.vault)) {
            followUpCalls.set(component.vault, [])
          }
          followUpCalls.get(component.vault)?.push(...getFollowUpMultiCallDataForYgi(
            ygi,
            address,
            component.vault
          ))
        })
      })

      const followUpDataCalls = structuredMulticallFromCallInfo(followUpCalls)
      const [followUpData] = await Promise.all([followUpDataCalls])
      console.log(followUpData)
      for (const ygiComponentVaultAddress in followUpData) {
        for (const ygiVaultAddress in (followUpData as any)[ygiComponentVaultAddress]) {
          transformedVaultData[ygiVaultAddress]['userDeposits'] = {
            ...transformedVaultData[ygiVaultAddress]['userDeposits'],
            [ygiComponentVaultAddress]: (followUpData as any)[ygiComponentVaultAddress][ygiVaultAddress]['userToVaultToAmount']
          }
        }
      }

      setYgisData(transformedVaultData)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getYgiData()
  }, [address])


  return (
    <YgiDataContext.Provider value={{ygisData, isLoading, refetchForYgi: refetchForYgi, refetchAll: getYgiData}}>
      {children}
    </YgiDataContext.Provider>
  )
}

export { YgiDataContext, YgiDataContextProvider }
