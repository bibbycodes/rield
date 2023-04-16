import '../styles/globals.css'
import type {AppProps} from 'next/app'
import Layout from '../components/Layout';
import {Providers} from "../lib/Providers";
import {ReactElement} from 'react';
import {NextPage} from 'next';
import {Analytics} from '@vercel/analytics/react';

export type NextPageWithProviders<P = {}, IP = P> = NextPage<P, IP> & {
  getLayoutAndProvider?: (page: ReactElement) => ReactElement<any, any> | null
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithProviders
}

function getDefaultLayoutAndProvider(page: ReactElement) {
  return(
    <>
      <Providers>
        <Layout>
          {page}
        </Layout>
      </Providers>
      <Analytics/>
    </>
    ) 
}

export default function App({Component, pageProps}: AppPropsWithLayout) {
  const getProviders = Component.getLayoutAndProvider ?? getDefaultLayoutAndProvider
  return (
    <div className={`bg-backgroundPrimary h-full`}>
      {getProviders(<Component {...pageProps} />)}
    </div>
  )
}
