import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ConnectKitButton, ConnectKitProvider, getDefaultClient } from 'connectkit';
import { createClient, WagmiConfig } from 'wagmi';
import Layout from '../components/Layout';

const alchemyId = process.env.ALCHEMY_ID;

const client = createClient(
  getDefaultClient({
    appName: "Your App Name",
    alchemyId,
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
