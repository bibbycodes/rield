import {SelectedStrategyContextProvider} from "../contexts/SelectedStrategyContext";
import {TokenPricesContextProvider} from "../contexts/TokenPricesContext";
import {ReactNode} from "react";
import {APYsContextProvider} from "../contexts/ApyContext";
import {ThemeProvider} from "@mui/material";
import {muiTheme} from "../styles/theme";
import {ToastContextProvider} from "../contexts/ToastContext";
import {VaultDataContextProvider} from "../contexts/vault-data-context/VaultDataContext";

export const Providers = ({children}: { children: ReactNode }) => {
  return (
    <ThemeProvider theme={muiTheme}>
      <VaultDataContextProvider>
        <ToastContextProvider>
          <TokenPricesContextProvider>
            <APYsContextProvider>
              <SelectedStrategyContextProvider>
                {children}
              </SelectedStrategyContextProvider>
            </APYsContextProvider>
          </TokenPricesContextProvider>
        </ToastContextProvider>
      </VaultDataContextProvider>
    </ThemeProvider>
  );
}
