import {SingleStakeVault} from '../model/strategy';
import {StrategyLogos} from "./StrategyLogos";
import React, {useContext} from "react";
import {APYsContext} from "../contexts/ApyContext";
import {WithLoader} from "./WithLoader";
import {cardGradient} from "../pages";

export default function ApyCard({strategy}: { strategy: Strategy }) {
  const {apys, isLoading} = useContext(APYsContext)
  const apy = apys[strategy.strategyAddress]

  return (
    <div className={`${cardGradient} rounded-2xl p-2`}>
      <div className="p-3 sm:p-7">
        <StrategyLogos strategy={strategy}></StrategyLogos>
        <div className={`flex items-center justify-center`}>
          <div className="flex my-6">
            <WithLoader className={`min-w-[5rem] h-full w-full`} height={'15rem'} width={'60rem'} type={`text`} isLoading={isLoading}>
              <p className={`text-4xl sm:text-5xl text-tPrimary`}>{apy}% APY</p>
            </WithLoader>
          </div>
        </div>
      </div>
    </div>
  )
}
