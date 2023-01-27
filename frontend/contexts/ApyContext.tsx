import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Address, useNetwork, useProvider} from "wagmi";
import {calculateApyWithFee} from "../utils/calculator";
import {ApyGetter} from "../lib/apy-getter/apy-getter";
import {availableStrategies} from "../model/strategy";
import {TokenPricesContext} from "./TokenPricesContext";

const APYsContext = createContext<{ apys: { [strategy: Address]: number }, isLoading: boolean }>({
  apys: {},
  isLoading: true,
})

const APYsContextProvider = ({children}: {
  children: ReactNode;
}) => {
  const provider = useProvider()
  const {chain} = useNetwork()
  const [apys, setApys] = useState<{ [strategy: Address]: number }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const {prices} = useContext(TokenPricesContext)
  const apyGetter = new ApyGetter(provider, prices)

  
  useEffect(() => {
    chain?.id === 42161 &&  Object.keys(prices).length ?
      apyGetter.getApyForAllStrategies().then(
        (APYs) => {
          const apysWithFees = Object.keys(APYs).reduce((acc, strategyAddress) => {
            return {...acc, [strategyAddress]: calculateApyWithFee(APYs[strategyAddress] as number, 5, 365)}
          }, {})
          setApys(apysWithFees)
          setIsLoading(false)
        }
      )
      : setApys(availableStrategies.reduce((acc, strategy) => {
        return {...acc, [strategy.strategyAddress]: 0}
      }, {}))

  }, [chain?.id, prices])

  return (
    <APYsContext.Provider value={{apys, isLoading}}>
      {children}
    </APYsContext.Provider>
  )
}

export {APYsContext, APYsContextProvider}
