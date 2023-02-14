import {Typography} from "@mui/material";
import React from "react";
import {bgGradient} from "../pages";

export interface KeyFeatureCardProps {
  title: string
  description: string
  IconComponent: any
}

export const KeyFeatureCard = ({title, description, IconComponent}: KeyFeatureCardProps) =>
  <div id={`slim-text`} className={`bg-gray-900 shadow-2xl rounded-lg flex-col items-center p-4 justify-center p-2 w-96 m-4`}>
    <div className={'flex items-center'}>
      <IconComponent className={`${bgGradient} text-6xl mr-2 text-center p-2 rounded-full`}></IconComponent>
      <Typography id={`slim-text`} className={`text-4xl text-center text-tPrimary`}>{title}</Typography>
    </div>
    <div className={'flex items-center justify-center'}>
    </div>
    <div className={`m-8`}></div>
    <Typography id={`slim-text text-4xl`} className={`text-center text-tSecondary`}>{description}</Typography>
  </div>
