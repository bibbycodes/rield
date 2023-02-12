import {Typography} from '@mui/material';
import {Strategy} from '../model/strategy';
import {StrategyLogos} from "./StrategyLogos";
import React, {useContext} from "react";
import {APYsContext} from "../contexts/ApyContext";
import {WithLoader} from "./WithLoader";

export default function ApyCard({strategy}: { strategy: Strategy }) {
  const {apys, isLoading} = useContext(APYsContext)
  const apy = apys[strategy.strategyAddress]

  return (
    <div className={`bg-gray-900 rounded-lg p-2`}>
      <div className="p-7">
        <StrategyLogos strategy={strategy}></StrategyLogos>
        <div className={`flex items-center justify-center`}>
          <div className="flex my-6">
            <WithLoader className={`min-w-[5rem]`} height={'8rem'} width={'20rem'} type={`text`} isLoading={isLoading}>
              <Typography className={`text-5xl text-tPrimary`}>{apy}% APY</Typography>
            </WithLoader>
          </div>
        </div>
      </div>
    </div>
  )
}
