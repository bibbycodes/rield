import { SelectedStrategyContextProvider } from "../contexts/SelectedStrategyContext";
import { TokenPricesContextProvider } from "../contexts/TokenPricesContext";
import { ReactNode } from "react";
import { APYsContextProvider } from "../contexts/ApyContext";
import { ThemeProvider } from "@mui/material";
import { muiTheme } from "../styles/theme";
import { ToastContextProvider } from "../contexts/ToastContext";
import { VaultDataContextProvider } from "../contexts/vault-data-context/VaultDataContext";
import { ConnectKitProvider } from 'connectkit';
import { WagmiConfig } from 'wagmi';
import { getDefaultClient} from 'connectkit';
import {createClient} from 'wagmi';
import {arbitrum, hardhat} from "wagmi/chains";

let chains = process.env.ENV === 'dev' ? [arbitrum, hardhat] : [arbitrum];

export const client = createClient(
  getDefaultClient({
    appName: "RLD",
    chains
  }),
);

export const Providers = ({children}: { children: ReactNode }) => {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
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
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
