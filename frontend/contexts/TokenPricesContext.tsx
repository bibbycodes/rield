import {createContext, ReactNode, useEffect, useState,} from "react";
import {useCoinGeckoPrices} from "../hooks/useCoinGeckoPrices";
import {useBlockChainPrices} from "../hooks/useBlockChainPrices";
import {isEmpty} from "../utils/formatters";

export type Prices = {
  [coinGeckoId: string]: number
}

interface TokenPrices {
  prices: Prices;
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
  const [prices, setPrices] = useState<Prices>(coinGeckoPrices);
  
  const mergePrices = async () => {
    if (!isEmpty(coinGeckoPrices) || !isEmpty(blockChainPrices)) {
      setPrices({...prices, ...coinGeckoPrices, ...blockChainPrices})
    }
  }
  
  const updatePrices = async () => {
    await updateCoinGeckoPrices()
    await updateBlockChainPrices()
    await mergePrices()
  }
  
  useEffect(() => {
    mergePrices().then()
  }, [coinGeckoPrices, blockChainPrices])
  

  return (
    <TokenPricesContext.Provider value={{prices, updatePrices}}>
      {children}
    </TokenPricesContext.Provider>
  );
};

export {TokenPricesContext, TokenPricesContextProvider};
