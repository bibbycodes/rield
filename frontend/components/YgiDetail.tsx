import {Ygi} from '../model/ygi';
import Image from "next/image"
import React, {useContext} from 'react';
import {APYsContext} from "../contexts/ApyContext";

export default function YgiDetail({ygi}: { ygi: Ygi }) {
  const totalAllocation = ygi.components.reduce((acc, component) => acc + component.allocation, 0);
  const {apys, isLoading} = useContext(APYsContext)

  const allocationPercentage = (allocation: number) => {
    return (allocation / totalAllocation * 100).toFixed(0);
  }

  return (
    <div
      className={`bg-gradient-to-b from-[#20273a] to-[#121829] border-[#181E2F]
      border-solid border-2 rounded-2xl max-w-md -z-10 -ml-6 p-6 pl-12`}>

      <div className="flex flex-col justify-between h-full">
        <div className="flex flex-col w-full">
          <div className="grid grid-cols-3 text-center font-bold">
            <div className="text-left">Token</div>
            <div>APY</div>
            <div className="text-right">Allocation</div>
          </div>
          {ygi.components.map((item, index) => (
            <div key={index} className="grid grid-cols-3 text-center py-1 slim-text">
              <div className="text-left">
                <Image src={item.tokenLogoUrl} alt={'Logo'} width={25} height={25} className="font-thin mr-2 inline"/>
                <span>{item.inputToken}</span>
              </div>
              <div>{apys[item.strategyAddress]}%</div>
              <div className="text-right">{allocationPercentage(item.allocation)}%</div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-sm text-gray-400 slim-text">
          Perpetual decentralized exchanges (DEXs) transform crypto trading with leveraged trading, offering secure,
          transparent, and anonymous transactions on decentralized networks.
        </div>
      </div>
    </div>
  )
}
