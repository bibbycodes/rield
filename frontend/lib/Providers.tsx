import { SelectedStrategyContextProvider } from "../contexts/SelectedStrategyContext";
import { TokenPricesContextProvider } from "../contexts/TokenPricesContext";
import React, { ReactNode, useEffect } from "react";
import { APYsContextProvider } from "../contexts/ApyContext";
import { ThemeProvider } from "@mui/material";
import { muiTheme } from "../styles/theme";
import { ToastContextProvider } from "../contexts/ToastContext";
import { VaultDataContextProvider } from "../contexts/vault-data-context/VaultDataContext";
import { ConnectKitProvider, getDefaultClient } from 'connectkit';
import { createClient, WagmiConfig } from 'wagmi';
import { arbitrum, hardhat } from "wagmi/chains";
import { useRouter } from "next/router";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { SelectedYgiContextProvider } from '../contexts/SelectedYgiContext';
import { YgiDataContextProvider } from "../contexts/vault-data-context/YgiDataContext";

let chains = process.env.ENV === 'dev' ? [arbitrum, hardhat] : [arbitrum];

export const client = createClient(
  getDefaultClient({
    appName: "RLD",
    chains
  }),
);

export const Providers = ({children}: { children: ReactNode }) => {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (route: any) => {
      posthog?.capture('PAGE_VIEW:' + route)
    }
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: 'https://app.posthog.com',
      autocapture: true,
    })
  }

  return (
    <PostHogProvider client={posthog}>
      <WagmiConfig client={client}>
        <ConnectKitProvider>
          <ThemeProvider theme={muiTheme}>
            <ToastContextProvider>
              <TokenPricesContextProvider>
                <VaultDataContextProvider>
                  <YgiDataContextProvider>
                    <APYsContextProvider>
                      <SelectedStrategyContextProvider>
                        <SelectedYgiContextProvider>
                          {children}
                        </SelectedYgiContextProvider>
                      </SelectedStrategyContextProvider>
                    </APYsContextProvider>
                  </YgiDataContextProvider>
                </VaultDataContextProvider>
              </TokenPricesContextProvider>
            </ToastContextProvider>
          </ThemeProvider>
        </ConnectKitProvider>
      </WagmiConfig>
    </PostHogProvider>
  );
}
