import {createContext, ReactNode, useEffect, useState,} from "react";
import {availableStrategies} from "../model/strategy";
import axios from "axios";

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
  const [prices, setPrices] = useState<CoinGeckoPrices>({});
  const [lastUpdated, setLastUpdated] = useState<number>(0);

  const updatePrices = async () => {
    // update prices only if last update was more than 5 minutes ago
    if (Date.now() - lastUpdated > 5 * 60 * 1000) {
      const coinGeckoIds = availableStrategies.map(strategy => strategy.coinGeckoId)
      const coinGeckoIdsString = coinGeckoIds.join(',')
      const {data} = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoIdsString}&vs_currencies=usd`)
      const transformedData = coinGeckoIds.reduce((acc, id) => {
        acc[id] = data[id].usd
        return acc
      }, {} as any)
      setPrices(transformedData)
      setLastUpdated(Date.now())
    }
  }
  
  useEffect(() => {
    updatePrices()
  }, [])
  

  return (
    <TokenPricesContext.Provider value={{prices, updatePrices}}>
      {children}
    </TokenPricesContext.Provider>
  );
};

export {TokenPricesContext, TokenPricesContextProvider};
