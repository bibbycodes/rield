import { createContext, ReactNode, } from "react";
import { useFetchPrices } from "../hooks/useFetchPrices";

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
  const {prices, updatePrices} = useFetchPrices()

  return (
    <TokenPricesContext.Provider value={{prices, updatePrices}}>
      {children}
    </TokenPricesContext.Provider>
  );
};

export { TokenPricesContext, TokenPricesContextProvider };
