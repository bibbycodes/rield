import { SingleStakeStrategy } from "../model/strategy";
import Image from "next/image"
import React from "react";

export const StrategyLogos = ({strategy}: { strategy: Strategy }) => {
  const {tokenLogoUrl, tokenSymbol} = strategy
  const backgroundPrimaryDarker = 'bg-gradient-to-r from-backgroundPrimary to-[#10141F]'
  return (
    <div className={`flex flex-col justify-around w-48`}>
      <div className={`flex flex-row items-center`}>
        <Image alt={'Token Logo'} width={60} height={60} src={tokenLogoUrl} className="inline mr-3 h-10 w-10"/>
        <div className={`flex flex-col`}>
          <p
            className="inline text-xl text-tPrimary">{tokenSymbol}
          </p>
          <a
            className={`inline-flex items-center`}
            href={strategy.protocolUrl}>
            {/*<Image alt={'Protocol Logo'} width={25} height={25} src={strategy.protocolLogoUrl} className="font-thin	mr-3"/>*/}
            <p className={`text-xs text-tSecondary slim-text`}>{strategy.protocol}</p>
          </a>
        </div>

      </div>
      {/*<div className={`flex mt-1`}>*/}
      {/*  <a*/}
      {/*    className={`inline-flex items-center`}*/}
      {/*    href={strategy.protocolUrl}>*/}
      {/*    /!*<Image alt={'Protocol Logo'} width={25} height={25} src={strategy.protocolLogoUrl} className="font-thin	mr-3"/>*!/*/}
      {/*    <p className={`text-xs text-tPrimary slim-text`}>{strategy.protocol}</p>*/}
      {/*  </a>*/}
      {/*</div>*/}

    </div>
  )
}
