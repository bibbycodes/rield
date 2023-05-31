import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Address, useNetwork} from "wagmi";
import {calculateApyWithFee} from "../utils/calculator";
import {ApyGetter} from "../lib/apy-getter/apy-getter";
import {singleStakeStrategies} from "../model/strategy";
import {TokenPricesContext} from "./TokenPricesContext";
import {staticArbProvider} from '../utils/static-provider';

const APYsContext = createContext<{ apys: { [strategy: Address]: number }, isLoading: boolean }>({
  apys: {},
  isLoading: true,
})

const APYsContextProvider = ({children}: {
  children: ReactNode;
}) => {
  const {chain} = useNetwork()
  const [apys, setApys] = useState<{ [strategy: Address]: number }>({});
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const {prices} = useContext(TokenPricesContext)
  const apyGetter = new ApyGetter(staticArbProvider, prices)

  useEffect(() => {
    Object.keys(prices).length ?
      apyGetter.getApyForAllStrategies().then(
        (APYs) => {
          const apysWithFees = Object.keys(APYs).reduce((acc, strategyAddress) => {
            return {...acc, [strategyAddress]: calculateApyWithFee(APYs[strategyAddress] as number, 2, 365)}
          }, {})
          setApys(apysWithFees)
          setIsLoading(false)
        }
      )
      : setApys(singleStakeStrategies
        .filter(strategy => strategy.status !== 'DISABLED')
        .reduce((acc, strategy) => {
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
