import Head from 'next/head'
import Link from "next/link";
import React from "react";
import {Typography} from "@mui/material";
import {availableStrategies} from "../model/strategy";
import StrategyCard from "../components/StrategyCard";
import Image from "next/image";

export default function Home() {
  const bgGradient = `bg-gradient-to-tr from-green-300 via-blue-500 to-purple-600`
  return (
    <>
      <Head>
      </Head>
      <main className={``}>
        <div
          className={`${bgGradient} w-full flex flex-col items-center justify-center m-0 h-screen`}>
          <div>
            <Typography className={"text-center text-white text-7xl"}>
              Compound More #RealYield
            </Typography>
          </div>
          <div className={`mt-96`}>
            <Link href='/strategies'>
              <button className={`p-10 text-white rounded-xl p-2 text-7xl bg-gray-900`}>
                Enter App
              </button>
            </Link>
          </div>
        </div>

        <div className={`bg-white w-full flex items-center justify-center m-0 h-screen`}>
          <div className={`w-1/2`}>
            <Typography className={"text-center text-black text-7xl"}>
              Earn more on the assets you want
            </Typography>
          </div>
          <div className={``}>
            {availableStrategies.slice(0, 2).map((strategy, index) =>
              <div className={`m-2 w-full`}>
                <StrategyCard
                  key={strategy.vaultAddress}
                  strategy={strategy}
                  openModal={() => false}
                />
              </div>
            )}
          </div>
        </div>

        <div className={`${bgGradient} w-full flex  flex-col items-center justify-center m-0 h-screen`}>
          <div className={`w-1/2`}>
            <Typography className={"text-center text-white text-7xl"}>
              Curated List of Real Yield Pools, Always on AutoPilot
            </Typography>
          </div>
        
          <div className={`flex flex-col mt-20`}>
            <div className={`flex items-center justify-center flex-row my-2`}>
              <Image alt={"Token Logo"} height={190} width={190} src={'/eth-token.svg'} className={`mx-10`}/>              
              <Image alt={"Token Logo"} height={190} width={190} src={'/usdc-logo.svg'} className={`mx-10`}/>
            </div>
            <div className={`flex items-center justify-center flex-row my-2`}>
              <Image alt={"Token Logo"} height={190} width={190} className={`mx-12`} src={'/cap.svg'}/>
              <Image alt={"Token Logo"} height={190} width={190} className={`mx-12`} src={'/gmx-logo.svg'}/>
              <Image alt={"Token Logo"} height={190} width={190} className={`mx-12`} src={'/dai-logo.png'}/>
            </div>
          </div>
        </div>

        <div className={`bg-white w-full flex  flex-col items-center justify-center m-0 h-screen`}>
          <div className={`w-1/2`}>
            <Typography className={"text-center text-black text-7xl"}>
              Join The Community
            </Typography>
          </div>
          <div className={`flex mt-10`}>
            <Image alt={"Token Logo"} height={120} width={120} className={`mx-12`} src={'/telegram-logo.png'}/>
            <Image alt={"Token Logo"} height={120} width={120} className={`mx-12`} src={'/discord-logo.png'}/>
            <Image alt={"Token Logo"} height={120} width={120} className={`mx-12`} src={'/github-logo.png'}/>
          </div>
        </div>
      </main>
    </>
  )
}
