import {createContext, ReactNode, useEffect, useState} from "react";
import {Address, useNetwork, useProvider} from "wagmi";
import {calculateApyWithFee} from "../utils/calculator";
import {ApyGetter} from "../lib/apy-getter/apy-getter";
import {availableStrategies} from "../model/strategy";

const APYsContext = createContext<{ [strategy: Address]: number }>({})

const APYsContextProvider = ({children}: {
  children: ReactNode;
}) => {
  const provider = useProvider()
  const apyGetter = new ApyGetter(provider)
  const {chain} = useNetwork()
  const [APYs, setAPYs] = useState<{ [strategy: Address]: number }>({});
  useEffect(() => {
    chain?.id === 42161 ?
      apyGetter.getApyForAllStrategies().then(
        (APYs) => {
          const apysWithFees = Object.keys(APYs).reduce((acc, strategyAddress) => {
            return {...acc, [strategyAddress]: calculateApyWithFee(APYs[strategyAddress] as number, 1, 365)}
          }, {})
          setAPYs(apysWithFees)
        }
      )
      : setAPYs(availableStrategies.reduce((acc, strategy) => {
        return {...acc, [strategy.strategyAddress]: 10}
      }, {}))

  }, [chain?.id])

  return (
    <APYsContext.Provider value={APYs}>
      {children}
    </APYsContext.Provider>
  )
}

export {APYsContext, APYsContextProvider}
