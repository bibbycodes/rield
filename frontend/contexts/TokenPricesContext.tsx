import {createContext, ReactNode, useEffect, useState,} from "react";
import {availableStrategies} from "../model/strategy";
import {useCoinGeckoPrices} from "../hooks/useCoinGeckoPrices";
import {useBlockChainPrices} from "../hooks/useBlockChainPrices";

export type CoinGeckoPrices = {
  [coinGeckoId: string]: number
}

interface TokenPrices {
  prices: CoinGeckoPrices;
  updatePrices: () => Promise<void>;
}

const TokenPricesContext = createContext<TokenPrices>({
  prices: {},
  updatePrices: () => Promise.resolve()
});

const TokenPricesContextProvider = ({children}: {
  children: ReactNode;
}) => {
  const {coinGeckoPrices, updateCoinGeckoPrices} = useCoinGeckoPrices()
  const {blockChainPrices, updateBlockChainPrices} = useBlockChainPrices()
  const [prices, setPrices] = useState<CoinGeckoPrices>(coinGeckoPrices);
  
  const mergePrices = async () => {
    setPrices({...prices, ...coinGeckoPrices, ...blockChainPrices})
  }
  
  const updatePrices = async () => {
    await updateCoinGeckoPrices()
    await updateBlockChainPrices()
    await mergePrices()
  }
  
  useEffect(() => {
    mergePrices().then(() => {
      console.log("merged prices", prices)
    })
  }, [availableStrategies])
  

  return (
    <TokenPricesContext.Provider value={{prices, updatePrices}}>
      {children}
    </TokenPricesContext.Provider>
  );
};

export {TokenPricesContext, TokenPricesContextProvider};
