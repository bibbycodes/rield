import React from "react";
import {LpPoolVault, SingleStakeVault, RldVault} from "../lib/types/strategy-types";
import {isLpPoolStrategy, isSingleStakeStrategy} from "../lib/utils";
import {TokenLogos} from "./TokenLogos";

const getTokenLogoUrls = (strategy: RldVault): string[] => {
  if (isSingleStakeStrategy(strategy.type)) {
    return [(strategy as SingleStakeVault).tokenLogoUrl]
  }
  if (isLpPoolStrategy(strategy.type)) {
    const strategyAsLpPoolStrategy = strategy as LpPoolVault
    const {lp0TokenLogoUrl, lp1TokenLogoUrl} = strategyAsLpPoolStrategy
    return [lp0TokenLogoUrl, lp1TokenLogoUrl]
  }
  return []
}

const getTokenSymbol = (strategy: RldVault) => {
  if (isSingleStakeStrategy(strategy.type)) {
    return (strategy as SingleStakeVault).tokenSymbol
  }
  if (isLpPoolStrategy(strategy.type)) {
    const {lp0TokenSymbol, lp1TokenSymbol} = strategy as LpPoolVault
    return `${lp0TokenSymbol}/${lp1TokenSymbol}`
  }
}

export const StrategyLogos = ({strategy}: { strategy: RldVault }) => {
  const backgroundPrimaryDarker = 'bg-gradient-to-r from-backgroundPrimary to-[#10141F]'
  const tokenLogoUrls = getTokenLogoUrls(strategy)
  return (
    <div className={`flex flex-col justify-around w-48`}>
      <div className={`flex flex-row items-center`}>
        <TokenLogos logoUrls={tokenLogoUrls}></TokenLogos>
        <div className={`flex flex-col`}>
          <p
            className="inline text-xl text-tPrimary">{getTokenSymbol(strategy)}
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
