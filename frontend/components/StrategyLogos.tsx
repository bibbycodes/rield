import {Typography} from "@mui/material";
import {Strategy} from "../model/strategy";
import Image from "next/image"

export const StrategyLogos = ({strategy}: { strategy: Strategy }) => {
  const {tokenLogoUrl, tokenSymbol} = strategy
  return (
    <div className={`flex`}>
      <div className={`flex flex-grow flex-row items-center`}>
        <Image alt={'Token Logo'} width={50} height={50} src={tokenLogoUrl} className="inline mr-3 h-12 w-12"/>
        <Typography
          className="inline text-2xl font-bold text-tPrimary hover:text-accentPrimary hover:underline">{tokenSymbol}
        </Typography>
      </div>
      <div>
        <a
          className="inline-flex flex-row rounded-lg bg-backgroundPrimary p-2 border-solid border-backgroundPrimary border-2 hover:border-accentSecondary"
          href={strategy.protocolUrl}>
          <Image alt={'Protocol Logo'} width={25} height={25} src={strategy.protocolLogoUrl} className="font-thin	mr-3"/>
          <Typography className={`text-sm text-tPrimary`}>{strategy.protocol}</Typography>
        </a>
      </div>
    </div>
  )
}
