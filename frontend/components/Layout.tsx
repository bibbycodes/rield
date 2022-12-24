import Link from 'next/link';
import Head from 'next/head';
import {PropsWithChildren} from 'react';
import {ConnectKitButton} from 'connectkit';
import NonSSRWrapper from './NonSSRWrapper';

const isSSR = () => typeof window === 'undefined';

export default function Layout({children}: PropsWithChildren) {
  return (
    <>
      <Head>
        <title>Real Yield Dashboard</title>
        <meta name="description" content="Real Yield Auto Compounder"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main>
        <nav className="text-white py-2 w-full bg-backgroundSecondary">
          <div className="flex flex-row w-full">
            <ul className="flex items-center py-3 px-20 w-full">
              <img src="logo.png" alt="Logo" className="w-12"/>
              <li className="px-5"><Link href='/'>Home</Link></li>
              <li className="px-5"><Link href='/compound'>Strategies</Link></li>
              <li className="ml-auto">
                <NonSSRWrapper>
                  <ConnectKitButton/>
                </NonSSRWrapper>
              </li>
            </ul>
          </div>
        </nav>

        {/* Dynamic content */}
        <div className="pt-20 px-20">
          <main>{children}</main>
        </div>
      </main>
    </>
  )
}
