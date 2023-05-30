import { createContext, useEffect, useState } from "react";
import { Address, useAccount } from "wagmi";
import { ADDRESS_ZERO } from "../../lib/apy-getter-functions/cap";
import { getMultiCallDataForYgi, getUserToVaultToAmount, getYgiMultiCallData, MultiCallInput, YgiData } from "./utils";
import { structuredMulticall } from './multicall-structured-result';
import { Ygi, ygis } from '../../model/ygi';

export interface YgiContextData {
  ygisData: YgiData | {}
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
    const multiCallData: MultiCallInput[] = getMultiCallDataForYgi(ygi)
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
      console.log('AAAAAAAAAAAAAAAAaa')
      const callData = getYgiMultiCallData(ygis)

      Promise.all(callData).then(data => {
        console.log('AAAAAAAAAAAAAAAAaa', data)
        // for (let singleYgiData of data) {
        // }

        // setYgisData({
        //   ...ygisData,
        //   [ygi.vaultAddress]: {structuredData, vaultToAmount}
        // })
        setIsLoading(false)
      })
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
