import Link from 'next/link';
import Head from 'next/head';
import React, {PropsWithChildren} from 'react';
import {ConnectKitButton} from 'connectkit';
import NonSSRWrapper from './NonSSRWrapper';
import Image from "next/image";
import BurgerMenu from './BurgerMenu';
import {useRouter} from 'next/router'

export default function Layout({children}: PropsWithChildren) {
  const router = useRouter()
  const isLandingPage = router.pathname === '/'
  const navHeight = isLandingPage ? 'h-16' : 'h-64'
  const outerDivStyle = isLandingPage ? 'bg-backgroundPrimary' : `pt-2 pb-10 px-3 sm:px-10`
  return (
    <>
      <Head>
        <title>Real Yield Dashboard</title>
        <meta name="description" content="Real Yield Auto Compounder"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <div className={`text-white w-full bg-gray-900 ${navHeight} absolute`}></div>
      <main className="relative z-10">
        <nav className="text-white w-full py-0">
          <div className="flex flex-row w-full">
            <ul className={`flex items-center px-3 sm:px-10 w-full`}>
              <div>
                <Link href='/'>
                  <div className={`flex items-center mr-16 w-full`}>
                    <Image height={70} width={70} src="/logo.png" alt="RLD Logo"
                           className="w-14 mr-1 mr-0 ml-0 rounded-lg p-2 sm:pl-0 font-bold"></Image>
                    <p className={`ml-0 text-3xl logo`}>RLD</p>
                  </div>
                </Link>
              </div>
              <div className={`flex flex-row justify-center items-center ml-auto`}>
                <div className="px-5 hidden md:block"><Link href='https://rld-1.gitbook.io/rld/'>Docs</Link></div>
                <div className="px-5 hidden md:block"><Link href='/strategies'>Strategies</Link></div>
                <div className="ml-auto">
                  {!isLandingPage ? (<NonSSRWrapper>
                    <ConnectKitButton.Custom>
                      {({isConnected, show, truncatedAddress, ensName}) => {
                        return (
                          <button className={`bg-backgroundPrimary rounded-lg p-3 text-sm hover:bg-accentPrimary`}
                                  onClick={show}>
                            {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
                          </button>
                        );
                      }}
                    </ConnectKitButton.Custom>
                  </NonSSRWrapper>) : (
                    <Link href='/strategies'>
                      <button className={`bg-accentPrimary rounded-lg p-2 text-md hover:bg-accentPrimary`}>
                        Enter App
                      </button>
                    </Link>
                  )}
                </div>
                <BurgerMenu/>
              </div>
            </ul>
          </div>
        </nav>

        <div className={outerDivStyle}>
          <main>{children}</main>
        </div>
      </main>
    </>
  )
}
