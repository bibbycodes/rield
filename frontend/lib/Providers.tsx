import {SelectedStrategyContextProvider} from "../contexts/SelectedStrategyContext";
import {TokenPricesContextProvider} from "../contexts/TokenPricesContext";
import {ReactNode} from "react";
import {APYsContextProvider} from "../contexts/ApyContext";
import {ThemeProvider} from "@mui/material";
import {muiTheme} from "../styles/theme";
import {ToastContextProvider} from "../contexts/ToastContext";

export const Providers = ({children}: { children: ReactNode }) => {
  return (
    <ThemeProvider theme={muiTheme}>
      <ToastContextProvider>
        <APYsContextProvider>
          <TokenPricesContextProvider>
            <SelectedStrategyContextProvider>
              {children}
            </SelectedStrategyContextProvider>
          </TokenPricesContextProvider>
        </APYsContextProvider>
      </ToastContextProvider>
    </ThemeProvider>
  );
}
