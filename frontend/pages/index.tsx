import Head from 'next/head'
import Link from "next/link";
import React from "react";
import {Typography} from "@mui/material";
import {availableStrategies} from "../model/strategy";
import ApyCard from "../components/ApyCard";

export default function Home() {
  const bgGradient = `bg-gradient-to-tl from-fuchsia-500 to-cyan-500`
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
              <Typography className={`text-center text-white text-5xl md:text-7xl leading-relaxed`}>
                Yield Generation, <br/> Automated.
              </Typography>
            </div>
            <div className={`mt-[20vh]`}>
              <Link href='/strategies'>
                <button className={`p-8 text-white rounded-xl text-4xl md:text-7xl shadow-2xl bg-gray-900 hover:bg-backgroundPrimaryGradient`}>
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className={`bg-white w-full flex items-center justify-center p-8 min-h-screen flex-col md:flex-row gap-4`}>
          <div className={`md:w-1/2 flex flex-col items-center justify-center`}>
            <Typography className={"text-center text-black text-6xl md:text-7xl leading-relaxed md:mb-0"}>
              High Yield, Low Fees.
            </Typography>

            <Typography className={"text-center mt-4 text-tSecondary text-xl w-90 leading-relaxed"}>
              Investing in crypto made simple, affordable and rewarding for all. High yield and low fees, always on autopilot.
            </Typography>
          </div>
          <div className={`max-w-[400px] w-[90vw]`}>
            <div className={`w-full shadow-2xl mb-4`}>
              <ApyCard
                key={availableStrategies[0].vaultAddress}
                strategy={availableStrategies[1]}
              />
            </div>

            <div className={`w-full shadow-2xl md:block `}>
              <ApyCard
                key={availableStrategies[1].vaultAddress}
                strategy={availableStrategies[0]}
              />
            </div>
          </div>
        </div>

        <div className={`${bgGradient} w-full flex flex-col items-center justify-center p-8 min-h-screen`}>
          <div className={`flex flex-col items-center`}>
            <Typography className={"text-center text-white text-4xl md:text-7xl leading-relaxed"}>
              Real Yield, Passive Earnings.
            </Typography>

            <Typography className={"text-center mt-4 text-stone-200 text-xl max-w-2xl leading-relaxed"}>
              Sit back and relax while your tokens work for you. Enjoy a curated selection of high yield strategies. Always with blue chip and #RealYield earning tokens.
            </Typography>
          </div>

          {/*<div className={'h-20'}>*/}
          <div className="max-w-[600px] relative">
            <img className="absolute h-full w-auto right-[7%] animate-spin"
                 src="/arrow-rotating.png" alt="arrow illustration"/>
            <img className="relative z-10" src="/compound-illustration.png" alt="compounding illustration"/>
          </div>
          {/*</div>*/}

          {/*<div className={`flex flex-col mt-20 w-full`}>*/}

          {/*  <div className="flex h-full max-h-[12rem] items-center*/}
          {/*  justify-center flex-row my-2*/}
          {/*  [&>*]:h-full [&>*]:w-full">*/}
          {/*    <div className="hidden md:visible flex-grow"></div>*/}
          {/*    <div className="max-w-[6rem]"/>*/}
          {/*    <div className="max-w-[12rem] mr-5">*/}
          {/*      <img alt={"Token Logo"} className={`h-full w-full`} src={'/eth-token.svg'}/>*/}
          {/*    </div>*/}
          {/*    <div className="max-w-[12rem] ml-5">*/}
          {/*      <img alt={"Token Logo"} className={`h-full w-full`} src={'/usdc-logo.svg'}/>*/}
          {/*    </div>*/}
          {/*    <div className="max-w-[6rem]"/>*/}
          {/*    <div className="hidden md:visible flex-grow"></div>*/}
          {/*  </div>*/}

          {/*  <div className="flex h-full max-h-[12rem] items-center*/}
          {/*  justify-center flex-row my-2 gap-10*/}
          {/*  [&>*]:h-full [&>*]:w-full">*/}
          {/*    <div className="hidden md:visible flex-grow"></div>*/}
          {/*    <div className="max-w-[12rem]">*/}
          {/*      <img alt={"Token Logo"} className={`h-full w-full`} src={'/cap.svg'}/>*/}
          {/*    </div>*/}
          {/*    <div className="max-w-[12rem]">*/}
          {/*      <img alt={"Token Logo"} className={`h-full w-full`} src={'/gmx-logo.svg'}/>*/}
          {/*    </div>*/}
          {/*    <div className="max-w-[12rem]">*/}
          {/*      <img alt={"Token Logo"} className={`h-full w-full`} src={'/dai-logo.png'}/>*/}
          {/*    </div>*/}
          {/*    <div className="hidden md:visible flex-grow"></div>*/}
          {/*  </div>*/}
          {/*</div>*/}
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
