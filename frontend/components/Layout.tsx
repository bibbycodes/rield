import Link from 'next/link';
import Head from 'next/head';
import {PropsWithChildren} from 'react';
import {ConnectKitButton} from 'connectkit';
import NonSSRWrapper from './NonSSRWrapper';

export default function Layout({children}: PropsWithChildren) {
  return (
    <>
      <Head>
        <title>Real Yield Dashboard</title>
        <meta name="description" content="Real Yield Auto Compounder"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main>
        <nav className="text-white w-full bg-backgroundSecondary">
          <div className="flex flex-row w-full">
            
            <ul className="flex items-center px-10 w-full">
              <a href='/'>
                <div className={`flex items-center mr-16 w-full`}>
                  <img src="logo.png" alt="Logo" className="w-14 mr-1 my-2 mr-0 ml-0 rounded-lg p-2 font-bold"></img>
                  <p className={`ml-0 text-4xl`}>RLD</p>
                </div>
              </a>
              <li className="px-5"><Link href='/strategies'>Strategies</Link></li>
              <li className="ml-auto">
                <NonSSRWrapper>
                  <ConnectKitButton/>
                </NonSSRWrapper>
              </li>
            </ul>
          </div>
        </nav>

        <div className="pt-5 px-10">
          <main>{children}</main>
        </div>
      </main>
    </>
  )
}
