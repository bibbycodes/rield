import {WithLoader} from "./WithLoader";
import React from "react";
import {OverridableComponent} from "@mui/types";
import {SvgIconTypeMap} from "@mui/material";

interface ToolBarDataItemProps {
  MuiIcon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {muiName: string}
  value: string | null;
  label: string;
  className?: string;
  isLoading: boolean;
}

export const ToolBarDataItem = ({MuiIcon, value, label, isLoading}: ToolBarDataItemProps) => {
  return (
    <span className={`flex text-tPrimary mb-4`}>
        <div className="border border-gray-400 rounded-xl w-10 flex items-center my-[3px]">
          <MuiIcon fontSize="medium" sx={{margin: 'auto'}}/>
        </div>
      
        <div className="flex flex-col ml-3">
          <div className="text-xs text-tSecondary">
            {label}
          </div>
            
          <WithLoader
            type={`text`}
            isLoading={isLoading}
          >
            <p className="text-2xl">${value}</p>
          </WithLoader>
        </div>
    </span>
  )
}
