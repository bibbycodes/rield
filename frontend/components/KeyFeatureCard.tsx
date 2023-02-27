import React from "react";
import { bgGradient } from "../pages";

export interface KeyFeatureCardProps {
  title: string
  description: string
  IconComponent: any
}

export const KeyFeatureCard = ({title, description, IconComponent}: KeyFeatureCardProps) =>
  <div className={`bg-gray-900 shadow-2xl rounded-lg p-8 justify-center max-w-[400px] w-[90vw] slim-text sm:h-[230px]`}>
    <div className={'flex items-center flex-col sm:flex-row h-full gap-6'}>
      <IconComponent className={`${bgGradient} text-7xl text-center p-2 rounded-full`}></IconComponent>
      <div className="flex gap-5 flex-col">
        <p className={`text-4xl text-center text-tPrimary`}>{title}</p>
        <p className={`text-center text-zinc-300`}>{description}</p>
      </div>
    </div>
  </div>
