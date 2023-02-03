import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {ConnectKitProvider, getDefaultClient} from 'connectkit';
import {createClient, WagmiConfig} from 'wagmi';
import {arbitrum, hardhat} from "wagmi/chains";
import Layout from '../components/Layout';
import {Providers} from "../lib/Providers";

const alchemyId = process.env.ALCHEMY_ID;
let chains = process.env.ENV === 'dev' ? [arbitrum, hardhat] : [arbitrum];

const client = createClient(
  getDefaultClient({
    appName: "RLD",
    alchemyId,
    chains
  }),
);

export default function App({Component, pageProps}: AppProps) {
  return (
    <div className={`bg-backgroundPrimary h-full`}>
      <WagmiConfig client={client}>
        <ConnectKitProvider>
          <Providers>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Providers>
        </ConnectKitProvider>
      </WagmiConfig>
    </div>
  )
}
