import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {Address, useNetwork, useProvider} from "wagmi";
import {calculateApyWithFee} from "../utils/calculator";
import {ApyGetter} from "../lib/apy-getter/apy-getter";
import {availableStrategies} from "../model/strategy";
import {TokenPricesContext} from "./TokenPricesContext";

const APYsContext = createContext<{ [strategy: Address]: number }>({})

const APYsContextProvider = ({children}: {
  children: ReactNode;
}) => {
  const provider = useProvider()
  const {chain} = useNetwork()
  const [APYs, setAPYs] = useState<{ [strategy: Address]: number }>({});
  const {prices} = useContext(TokenPricesContext)
  const apyGetter = new ApyGetter(provider, prices)

  
  useEffect(() => {
    chain?.id === 42161 &&  Object.keys(prices).length ?
      apyGetter.getApyForAllStrategies().then(
        (APYs) => {
          const apysWithFees = Object.keys(APYs).reduce((acc, strategyAddress) => {
            return {...acc, [strategyAddress]: calculateApyWithFee(APYs[strategyAddress] as number, 5, 365)}
          }, {})
          setAPYs(apysWithFees)
        }
      )
      : setAPYs(availableStrategies.reduce((acc, strategy) => {
        return {...acc, [strategy.strategyAddress]: 0}
      }, {}))

  }, [chain?.id, prices])

  return (
    <APYsContext.Provider value={APYs}>
      {children}
    </APYsContext.Provider>
  )
}

export {APYsContext, APYsContextProvider}
