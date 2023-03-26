import React from "react";
import {bgGradient, cardGradient} from "../pages";

export interface KeyFeatureCardProps {
  title: string
  description: string
  IconComponent: any
}

export const KeyFeatureCard = ({title, description, IconComponent}: KeyFeatureCardProps) =>
  <div className={`flex shadow-2xl ${cardGradient} rounded-2xl flex-col max-w-[400px] w-[90vw] sm:h-[330px]`}>
    <div
      className={`flex items-center slim-text justify-center rounded-t-2xl text-3xl text-center text-white w-full h-28`}>
      {title}
    </div>
    
    <div className={`flex items-center justify-center`}>
      <div className={`border-solid border-b-2 border-b-zinc-300 w-[80%]`}></div>
    </div>

    <div className={`flex flex-col h-full rounded-b-2xl items-center p-4`}>
      <IconComponent className={`${bgGradient} text-8xl mt-4 text-white text-center p-3 rounded-full`}></IconComponent>
      <div className="flex gap-5 flex-col mt-8">
        <p className={`text-center slim-text text-zinc-300`}>{description}</p>
      </div>
    </div>
  </div>
