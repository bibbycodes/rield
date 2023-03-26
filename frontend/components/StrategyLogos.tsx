import {Strategy} from "../model/strategy";
import Image from "next/image"

export const StrategyLogos = ({strategy}: { strategy: Strategy }) => {
  const {tokenLogoUrl, tokenSymbol} = strategy
  const backgroundPrimaryDarker = 'bg-gradient-to-r from-backgroundPrimary to-[#10141F]'
  return (
    <div className={`flex`}>
      <div className={`flex flex-grow flex-row items-center`}>
        <Image alt={'Token Logo'} width={50} height={50} src={tokenLogoUrl} className="inline mr-3 h-12 w-12"/>
        <p
          className="inline text-2xl font-bold text-tPrimary">{tokenSymbol}
        </p>
      </div>
      <div>
        <a
          className={`inline-flex flex-row rounded-lg ${backgroundPrimaryDarker} p-2 border-solid border-backgroundPrimary border-2 hover:border-accentSecondary`}
          href={strategy.protocolUrl}>
          <Image alt={'Protocol Logo'} width={25} height={25} src={strategy.protocolLogoUrl} className="font-thin	mr-3"/>
          <p className={`text-sm text-tPrimary slim-text`}>{strategy.protocol}</p>
        </a>
      </div>
    </div>
  )
}
