import Link from "next/link";
import React, {ReactElement} from "react";
import {availableStrategies} from "../model/strategy";
import ApyCard from "../components/ApyCard";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssuredWorkloadOutlinedIcon from '@mui/icons-material/AssuredWorkloadOutlined';
import VerifiedIcon from '@mui/icons-material/VerifiedOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import {KeyFeatureCard} from "../components/KeyFeatureCard";
import Layout from '../components/Layout';
import {WagmiConfig} from 'wagmi';
import {APYsContextProvider} from '../contexts/ApyContext';
import {client} from '../lib/Providers';
import {TokenPricesContextProvider} from '../contexts/TokenPricesContext';
import Image from 'next/image'


export const bgGradient = `bg-gradient-to-b from-[#3F37AA] to-[#8F18F7]`
export const cardGradient = 'bg-gradient-to-b from-[#191F30] to-[#101625]'
export default function Home() {
  return (
    <>
      <main>
        <div className={`${bgGradient}`}>
          <div
            className={`w-full min-h-full flex flex-col min-h-[50vh] items-center z-10 relative pb-40`}>
            <div className ={'mt-[7vh] order-1'}>
              <p className={`text-center text-white text-4xl sm:text-5xl leading-snug p-2`}>
                Real Yield <span className={`text-[#E9CAFF]`}>Optimized</span>
              </p>
            </div>

            <div className="order-5 sm:order-3">
              <Link href='/strategies'>
                <button
                  className={`slim-text p-3 px-10 text-white mt-10 rounded-3xl text-l sm:text-xl shadow-2xl bg-gray-900 hover:bg-backgroundPrimaryGradient`}>
                  Get Started
                </button>
              </Link>
            </div>

            <div className="order-2">
              <p className={`slim-text text-white text-center mt-10 text-xl sm:text-2xl sm:text-3xl leading-snug`}>
                Grow Your Crypto Investments Like a Pro, <br/> Hassle-Free.
              </p>
            </div>
            
            <div className={`p-2 order-4 sm:mt-10`}>
              <p className={`slim-text text-[#E9CAFF] text-center max-w-2xl hidden sm:flex`}>
                RLD (💯,💰) is your ultimate partner for boosting yields on Arbitrum. <br/>
                Our platform helps you grow your bags with top Real Yield tokens, fantastic vaults, <br/>
                and popular assets like $ETH, $USDC, $BFR, $GMX, and $GLP.
              </p>
            </div>
          </div>
        </div>

        <div className={`bg-[#232736] w-full flex items-center justify-center p-8 h-[70vw] max-h-[70rem] sm:h-[60vw] sm:max-h-[50rem] flex-col relative`}>
          <Image 
            quality={100} 
            src={'/interface.jpeg'} 
            height={1000} 
            width={1000} 
            alt={'Interface preview'} 
            className={'border border-solid border-4 w-[70vw] max-w-[60rem] shadow-lg rounded-3xl border-backgroundPrimary absolute top-[-7em]'}>
          </Image>
        </div>

        <div className={`bg-white w-full flex items-center justify-center p-8 min-h-screen flex-col md:flex-row gap-4`}>
          <div className={`md:w-1/2 flex flex-col items-center justify-center mb-4`}>
            <p className={"text-center text-black text-5xl sm:text-7xl leading-snug sm:mb-0"}>
              High Yield Low Fees
            </p>

            <p className={"text-center mt-4 slim-text text-tSecondary text-xl w-90 leading-snug"}>
              Investing in crypto made simple, affordable and rewarding for all. High yield and low fees, always on
              autopilot.
            </p>
          </div>
          <div className={`max-w-[400px] w-[90vw]`}>
            <div className={`w-full shadow-2xl rounded-2xl mb-8`}>
              <ApyCard
                key={availableStrategies[3].vaultAddress}
                strategy={availableStrategies[3]}
              />
            </div>

            <div className={`w-full shadow-2xl md:block mt-8`}>
              <ApyCard
                key={availableStrategies[5].vaultAddress}
                strategy={availableStrategies[5]}
              />
            </div>
          </div>
        </div>

        <div className={`${bgGradient} w-full flex flex-col items-center px-2 py-4 min-h-screen justify-center`}>
          <div className={`flex flex-col items-center`}>
            <p className={"text-center text-white text-5xl sm:text-7xl leading-snug"}>
              Key Features
            </p>
          </div>
          <div className={`grid mt-11 grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10`}>
            <KeyFeatureCard
              title={'Real Yield'}
              description={'Rely on RLD\'s expert team to handpick the best Real Yield tokens for your investments, offering you the most promising DeFi opportunities.'}
              IconComponent={AttachMoneyIcon}
            />

            <KeyFeatureCard
              title={'Auto-compounding'}
              description={'Harness compound interest, our smart contracts reinvest your earnings and maximize returns without any extra effort.'}
              IconComponent={TrendingUpOutlinedIcon}
            />

            <KeyFeatureCard
              title={'Single Stake'}
              description={'Deposit one asset, and we\'ll handle the rest, ensuring top-notch returns without juggling multiple tokens.'}
              IconComponent={AssuredWorkloadOutlinedIcon}
            />

            <KeyFeatureCard
              title={'Trustless'}
              description={'Our permissionless, trustless approach safeguards your assets using cutting-edge technology and protocols.'}
              IconComponent={VerifiedIcon}
            ></KeyFeatureCard>
          </div>
        </div>

        <div className={`bg-white w-full flex  flex-col items-center justify-center p-8 min-h-screen`}>
          <div className="md:w-1/2 mb-[10vh]">
            <p className={"text-center text-black text-4xl sm:text-7xl"}>
              Join The Community
            </p>
          </div>

          <div className="flex h-full max-h-[12rem] items-center
            justify-center flex-row my-2 gap-10
            [&>*]:h-full [&>*]:w-full">
            <div className="hidden md:visible flex-grow"></div>
            <div className="max-w-[12rem]">
              <a target="_blank" rel="noopener noreferrer" href={'https://t.me/rldfinance'}>
                <img alt={"Telegram"} className={`h-full w-full`} src={'/telegram-logo.png'}/>
              </a>
            </div>
            <div className="max-w-[12rem]">
              <a target="_blank" rel="noopener noreferrer" href={'https://discord.gg/uMuzHWVPzR'}>
                <img alt={"Discord"} className={`h-40 w-42`} src={'/discord-logo.png'}/>
              </a>
            </div>            
            <div className="max-w-[12rem]">
              <a target="_blank" rel="noopener noreferrer" href={'https://twitter.com/RldFinance'}>
                <img height={100} width={100} alt={"Twitter"} className={`h-32 w-32`} src={'/twitter-logo.png'}/>
              </a>
            </div>
          </div>
          <div className="hidden md:visible flex-grow"></div>
        </div>
      </main>
    </>
  )
}

Home.getLayoutAndProvider = function getLayoutAndProvider(page: ReactElement) {
  return <WagmiConfig client={client}>
    <TokenPricesContextProvider>
      <APYsContextProvider>
        <Layout>{page}</Layout>
      </APYsContextProvider>
    </TokenPricesContextProvider>
  </WagmiConfig>
}
