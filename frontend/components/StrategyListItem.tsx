import Enable from './Enable';
import {StrategyLogos} from "./StrategyLogos";
import React from "react";
import {WithLoader} from "./WithLoader";
import NonSSRWrapper from './NonSSRWrapper';
import {cardGradient} from "../pages";
import Accordion from '@mui/material/Accordion';
import {AccordionDetails, AccordionSummary} from "@mui/material";
import {RldVault, StrategyStatus} from "../lib/types/strategy-types";
import {useStrategyAccordianListItemHooks} from "../hooks/component-hooks/useStrategyAccordianListItemHooks";

interface StrategyListItemProps {
  strategy: RldVault
  openModal: (isOpen: boolean) => void
}

export default function StrategyListItem({strategy, openModal}: StrategyListItemProps) {
  const {status} = strategy
  const {
    getUserStakedInDollars,
    formatTokenStakedAmount,
    userStaked,
    apy,
    isLoading,
    tokenSymbol,
  } = useStrategyAccordianListItemHooks(strategy)
  const handleOpenModal = () => {
    openModal(true)
  }

  return (
    <Accordion
      className={`
        ${cardGradient} 
        border-[#181E2F] border-solid border-2 
        rounded-2xl p-1
        ${status === 'HIDDEN' ? 'hidden' : ''}
        
      `}>
      <AccordionSummary
        aria-controls="panel1a-content"
        id="panel1a-header"
        className={``}
      >
        <div className="flex flex-row justify-between pt-1 pb-1 w-full">
          <StrategyLogos strategy={strategy}></StrategyLogos>
          <div className="flex flex-col w-22">
            <p className="text-xs text-tSecondary">APY</p>
            {status === 'ACTIVE' ? (
              <WithLoader className={`min-w-[5rem]`} type={`text`} isLoading={isLoading}>
                <p className={`text-2xl text-tPrimary`}>{apy}%</p>
              </WithLoader>
            ) : (
              <p className={`text-2xl text-tPrimary`}>-</p>
            )}
          </div>
          <div className="flex flex-col w-48 text-right">
            <p className="text-xs text-tSecondary">Staked</p>
            <p
              className={`text-2xl text-tPrimary`}>{status === StrategyStatus.ACTIVE ? `$${getUserStakedInDollars(userStaked)}` : '-'}</p>
            <p className={`text-xs text-tSecondary`}>
              {status === 'ACTIVE' ? `${formatTokenStakedAmount(userStaked)} ${(tokenSymbol)}` : '-'}
            </p>
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div
          className={`${cardGradient} border-[#181E2F] border-solid border-2 rounded-2xl p-2 ${status === StrategyStatus.HIDDEN ? 'hidden' : ''}`}>
          <div className="p-1 flex items-center">
            <div className="grow"/>
            <div className={`flex space-x-4 mr-8`}>
            </div>
            <NonSSRWrapper>
              <Enable
                openModal={handleOpenModal}
                strategy={strategy}
              ></Enable>
            </NonSSRWrapper>
          </div>
        </div>
      </AccordionDetails>
    </Accordion>
  )
}
