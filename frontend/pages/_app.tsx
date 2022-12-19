import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {ConnectKitProvider, getDefaultClient} from 'connectkit';
import {createClient, WagmiConfig} from 'wagmi';
import {arbitrum, goerli, mainnet} from "wagmi/chains";
import Layout from '../components/Layout';

const alchemyId = process.env.ALCHEMY_ID;

const chains = [mainnet, goerli, arbitrum];

const client = createClient(
  getDefaultClient({
    appName: "Your App Name",
    alchemyId,
    chains
  }),
);

export default function App({Component, pageProps}: AppProps) {
  return (
    <WagmiConfig client={client}>
      <ConnectKitProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ConnectKitProvider>
    </WagmiConfig>
  )
}
