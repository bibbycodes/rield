import Link from 'next/link';
import Head from 'next/head';
import React, {PropsWithChildren} from 'react';
import {ConnectKitButton} from 'connectkit';
import NonSSRWrapper from './NonSSRWrapper';
import Image from "next/image";
import BurgerMenu from './BurgerMenu';
import {useRouter} from 'next/router'
import {usePostHog} from "posthog-js/react";
import {Address} from "wagmi";

export default function Layout({children}: PropsWithChildren) {
  const router = useRouter()
  const isLandingPage = router.pathname === '/'
  const navHeight = isLandingPage ? 'h-16' : 'h-64'
  const outerDivStyle = isLandingPage ? 'bg-backgroundPrimary' : `pt-2 pb-10 px-3 sm:px-10`
  // const navGradient = "bg-gradient-to-r from-[#0E1420] to-[#1A1C48]"
  const navGradient = "bg-gradient-to-r from-[#3F37AA] to-[#8F18F7]"
  const posthog = usePostHog()
  
  const onClick = (event: string) => {
    posthog?.capture('PRESSED:' + event)
  }
  
  const onConnect = (address: Address | string) => {
    onClick('CONNECT')
    posthog?.identify(address.toString())
  }
  
  const isSameRoute = (route: string) => {
    return router.pathname === route
  }
  return (
    <>
      <Head>
        <title>RLD Finance</title>
        <meta name="description" content="Real Yield Auto Compounder"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <div className={`text-white w-full ${navGradient} ${navHeight} absolute`}>
        <div className={`w-[45vw] ${navHeight} absolute top left-0 z-1`}/>

        <div className={`w-[120vw] ${navHeight} ${navGradient} absolute top right-0 z-1`}/>

      </div>
      <main className="relative z-10">
        {!isLandingPage && (<nav className="text-white w-full py-0">
          <div className="flex flex-row w-full">
            <ul className={`flex items-center px-3 sm:px-10 w-full`}>
              <div>
                <Link href='/'>
                  <div className={`flex items-center mr-16 w-full`}>
                    <Image height={70} width={80} src="/logo-new.svg" alt="RLD Logo"
                           className="w-14 mr-1 mr-0 ml-0 rounded-lg p-2 sm:pl-0 font-bold"></Image>
                    <p className={`ml-0 text-3xl logo text-white`}>RLD</p>
                  </div>
                </Link>
              </div>
              <div className={`flex flex-row justify-center items-center ml-auto`}>
                <div 
                  className="px-5 hidden md:block"
                  onClick={() => onClick('DOCS')}
                ><Link target="_blank" rel="noopener noreferrer"
                                                            href='https://rld-1.gitbook.io/rld/'>Docs</Link></div>
                {!isSameRoute('/strategies') && <div className="px-5 hidden md:block"><Link href='/strategies'>Strategies</Link></div>}
                <div className="ml-auto">
                  <NonSSRWrapper>
                    <ConnectKitButton.Custom>
                      {({isConnected, show, truncatedAddress, address, ensName}) => {
                        if (isConnected) onConnect(address as Address)
                        return (
                          <button className={`bg-backgroundPrimary rounded-lg p-3 text-sm hover:bg-accentPrimary`}
                                  onClick={show}>
                            {isConnected ? ensName ?? truncatedAddress : "Connect Wallet"}
                          </button>
                        );
                      }}
                    </ConnectKitButton.Custom>
                  </NonSSRWrapper>
                </div>
                <BurgerMenu/>
              </div>
            </ul>
          </div>
        </nav>)}

        <div className={outerDivStyle}>
          <main>{children}</main>
        </div>
      </main>
    </>
  )
}
