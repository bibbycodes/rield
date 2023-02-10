import Head from 'next/head'
import Link from "next/link";
import React from "react";
import {Typography} from "@mui/material";
import {availableStrategies} from "../model/strategy";
import StrategyCard from "../components/StrategyCard";

export default function Home() {
  const bgGradient = `bg-gradient-to-tl from-fuchsia-500 to-cyan-500`
  return (
    <>
      <Head>
      </Head>
      <main className={``}>
        <div
          className={`${bgGradient} w-full flex flex-col items-center justify-center min-h-screen`}>
          <div>
            <Typography className={`text-center text-white text-5xl md:text-7xl leading-relaxed`}>
              Compound More #RealYield
            </Typography>
          </div>
          <div className={`mt-[20vh]`}>
            <Link href='/strategies'>
              <button className={`p-8 text-white rounded-xl text-4xl md:text-7xl bg-gray-900`}>
                Enter App
              </button>
            </Link>
          </div>
        </div>

        <div className={`bg-white w-full flex items-center justify-center p-8 min-h-screen flex-col md:flex-row`}>
          <div className={`md:w-1/2`}>
            <Typography className={"text-center text-black text-4xl md:text-7xl leading-relaxed mb-[10vh]"}>
              Earn more on the assets you want
            </Typography>
          </div>
          <div>
            <div className={`m-2 w-full`}>
              <StrategyCard
                key={availableStrategies[0].vaultAddress}
                strategy={availableStrategies[1]}
                openModal={() => false}
              />
            </div>

            <div className={`m-2 w-full hidden md:block`}>
              <StrategyCard
                key={availableStrategies[1].vaultAddress}
                strategy={availableStrategies[0]}
                openModal={() => false}
              />
            </div>
          </div>
        </div>

        <div className={`${bgGradient} w-full flex flex-col items-center justify-center p-8 min-h-screen`}>
          <div>
            <Typography className={"text-center text-white text-4xl md:text-7xl leading-relaxed"}>
              Curated List of Real Yield Pools, Always on AutoPilot
            </Typography>
          </div>

          <div className={`flex flex-col mt-20 w-full`}>

            <div className="flex h-full max-h-[12rem] items-center
            justify-center flex-row my-2
            [&>*]:h-full [&>*]:w-full">
              <div className="hidden md:visible flex-grow"></div>
              <div className="max-w-[6rem]"/>
              <div className="max-w-[12rem] mr-5">
                <img alt={"Token Logo"} className={`h-full w-full`} src={'/eth-token.svg'}/>
              </div>
              <div className="max-w-[12rem] ml-5">
                <img alt={"Token Logo"} className={`h-full w-full`} src={'/usdc-logo.svg'}/>
              </div>
              <div className="max-w-[6rem]"/>
              <div className="hidden md:visible flex-grow"></div>
            </div>

            <div className="flex h-full max-h-[12rem] items-center
            justify-center flex-row my-2 gap-10
            [&>*]:h-full [&>*]:w-full">
              <div className="hidden md:visible flex-grow"></div>
              <div className="max-w-[12rem]">
                <img alt={"Token Logo"} className={`h-full w-full`} src={'/cap.svg'}/>
              </div>
              <div className="max-w-[12rem]">
                <img alt={"Token Logo"} className={`h-full w-full`} src={'/gmx-logo.svg'}/>
              </div>
              <div className="max-w-[12rem]">
                <img alt={"Token Logo"} className={`h-full w-full`} src={'/dai-logo.png'}/>
              </div>
              <div className="hidden md:visible flex-grow"></div>
            </div>
          </div>
        </div>

        <div className={`bg-white w-full flex  flex-col items-center justify-center p-8 min-h-screen`}>
          <div className="md:w-1/2 mb-[10vh]">
            <Typography className={"text-center text-black text-4xl md:text-7xl"}>
              Join The Community
            </Typography>
          </div>

          <div className="flex h-full max-h-[12rem] items-center
            justify-center flex-row my-2 gap-10
            [&>*]:h-full [&>*]:w-full">
            <div className="hidden md:visible flex-grow"></div>
            <div className="max-w-[12rem]">
              <img alt={"Token Logo"} className={`h-full w-full`} src={'/telegram-logo.png'}/>
            </div>
            <div className="max-w-[12rem]">
              <img alt={"Token Logo"} className={`h-full w-full`} src={'/discord-logo.png'}/>
            </div>
            <div className="max-w-[12rem]">
              <img alt={"Token Logo"} className={`h-full w-full`} src={'/github-logo.png'}/>
            </div>
          </div>
          <div className="hidden md:visible flex-grow"></div>
        </div>
      </main>
    </>
  )
}
