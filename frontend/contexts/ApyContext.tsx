import {createContext, ReactNode, useEffect, useState} from "react";
import {useSigner} from "wagmi";
import {getCapAPY} from "../lib/cap";
import {calculateApyWithFee} from "../utils/calculator";

const APYsContext = createContext<{
  apys: {[strategy: string]: number},
}>({apys: {}})

const APYsContextProvider = ({children}: {
  children: ReactNode;
}) => {
  const {data: signer} = useSigner()
  const [APYs, setAPYs] = useState<{[strategy: string]: number}>({});
  useEffect(() => {
    getCapAPY('weth', signer).then(
      (apy) => {
        const apyWithFee = calculateApyWithFee(apy, 5, 365)
        setAPYs({...APYs, 'weth': apyWithFee})
      }
    )
  }, [signer])
  
  return (
    <APYsContext.Provider value={{APYs}}>
      {children}
    </APYsContext.Provider>
  )
}

export {APYsContext, APYsContextProvider}
