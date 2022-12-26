import {SelectedStrategyContextProvider} from "../contexts/SelectedStrategyContext";
import {TokenPricesContextProvider} from "../contexts/TokenPricesContext";
import {ReactNode} from "react";
import {APYsContextProvider} from "../contexts/ApyContext";

export const Providers = ({children}: { children: ReactNode }) => {
  return (
    <APYsContextProvider>
      <TokenPricesContextProvider>
        <SelectedStrategyContextProvider>
          {children}
        </SelectedStrategyContextProvider>
      </TokenPricesContextProvider>
    </APYsContextProvider>
  );
}
