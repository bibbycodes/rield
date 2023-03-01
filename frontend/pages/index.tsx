import Head from 'next/head'
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

export const bgGradient = `bg-gradient-to-tl from-fuchsia-500 to-cyan-500`
export default function Home() {
  return (
    <>
      <Head>
      </Head>
      <main>
        <div className={`${bgGradient}`}>
          {/*<img alt={'fluffy'} src={'/1.png'} height={200} width={200} className={'absolute'}></img>*/}
          <div
            className={`w-full min-h-screen flex flex-col items-center justify-center z-10 relative`}>
            <div>
              <p className={`text-center text-white text-5xl sm:text-7xl leading-snug`}>
                Yield Generation <br/> Automated
              </p>
            </div>

            <div>
              <p className={`text-center mt-24 text-zinc-300 text-3xl sm:text-3xl leading-snug`}>
                RLD is a yield optimizer with a focus on projects generating #RealYield.
              </p>
            </div>
            <div className={`mt-[20vh]`}>
              <Link href='/strategies'>
                <button
                  className={`p-8 text-white rounded-xl text-4xl sm:text-7xl shadow-2xl bg-gray-900 hover:bg-backgroundPrimaryGradient`}>
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className={`bg-white w-full flex items-center justify-center p-8 min-h-screen flex-col md:flex-row gap-4`}>
          <div className={`md:w-1/2 flex flex-col items-center justify-center`}>
            <p className={"text-center text-black text-5xl sm:text-7xl leading-snug sm:mb-0"}>
              High Yield, Low Fees.
            </p>

            <p className={"text-center mt-4 text-tSecondary text-xl w-90 leading-snug"}>
              Investing in crypto made simple, affordable and rewarding for all. High yield and low fees, always on
              autopilot.
            </p>
          </div>
          <div className={`max-w-[400px] w-[90vw]`}>
            <div className={`w-full shadow-2xl mb-4`}>
              <ApyCard
                key={availableStrategies[1].vaultAddress}
                strategy={availableStrategies[1]}
              />
            </div>

            <div className={`w-full shadow-2xl md:block `}>
              <ApyCard
                key={availableStrategies[0].vaultAddress}
                strategy={availableStrategies[0]}
              />
            </div>
          </div>
        </div>

        <div className={`${bgGradient} w-full flex flex-col items-center px-2 py-8 min-h-screen justify-center`}>
          <div className={`flex flex-col items-center`}>
            <p className={"text-center text-white text-5xl sm:text-7xl leading-snug"}>
              Key Features
            </p>
          </div>
          <div className={`grid mt-11 grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10`}>
            <KeyFeatureCard
              title={'Real Yield'}
              description={'Stake the most promising tokens offering real yield.'}
              IconComponent={AttachMoneyIcon}
            />

            <KeyFeatureCard
              title={'Compounding'}
              description={'Passive earnings, just connect, deposit and earn.'}
              IconComponent={TrendingUpOutlinedIcon}
            />

            <KeyFeatureCard
              title={'Single Stake'}
              description={'Forget impermanent loss, simple yields on low risk strategies.'}
              IconComponent={AssuredWorkloadOutlinedIcon}
            />

            <KeyFeatureCard
              title={'Trustless'}
              description={'Decentralized, transparent and verifiable.'}
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
                <img alt={"Token Logo"} className={`h-full w-full`} src={'/telegram-logo.png'}/>
              </a>
            </div>
            <div className="max-w-[12rem]">
              <a target="_blank" rel="noopener noreferrer" href={'https://discord.gg/uMuzHWVPzR'}>
                <img alt={"Token Logo"} className={`h-full w-full`} src={'/discord-logo.png'}/>
              </a>
            </div>
            {/*<div className="max-w-[12rem]">*/}
            {/*  <img alt={"Token Logo"} className={`h-full w-full`} src={'/github-logo.png'}/>*/}
            {/*</div>*/}
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
