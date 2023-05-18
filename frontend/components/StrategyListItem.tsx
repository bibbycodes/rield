import { Strategy } from '../model/strategy';
import { useGetUserDepositedInVault } from "../hooks/useGetUserDepositedInVault";
import Enable from './Enable';
import { StrategyLogos } from "./StrategyLogos";
import { TokenPricesContext } from "../contexts/TokenPricesContext";
import React, { useContext } from "react";
import { APYsContext } from "../contexts/ApyContext";
import { WithLoader } from "./WithLoader";
import { BigNumber, ethers } from 'ethers';
import NonSSRWrapper from './NonSSRWrapper';
import { formatDollarAmount, roundToNDecimals } from "../utils/formatters";
import * as capEth from "../resources/vault-details/deploy_cap_eth-output.json";
import * as capUSDC from "../resources/vault-details/deploy_cap_usdc-output.json";
import {cardGradient} from "../pages";

export default function StrategyListItem({
                                       strategy,
                                       openModal
                                     }: { strategy: Strategy, openModal: (isOpen: boolean) => void }) {
  const {userStaked} = useGetUserDepositedInVault(strategy)
  const {prices} = useContext(TokenPricesContext)
  const {apys, isLoading} = useContext(APYsContext)
  const apy = apys[strategy.strategyAddress]
  const {status} = strategy

  // TODO: Move this to a useGetUserStaked
  const getUserStakedInDollars = (amount: BigNumber) => {
    const isAmountPositive = amount.gt(BigNumber.from(0))
    if (!prices[strategy.coinGeckoId] || !isAmountPositive) {
      return 0
    }

    const balanceInUsd = ethers.utils.formatUnits(
      amount.mul((prices[strategy.coinGeckoId] * 10000).toFixed(0)).div(10000),
      strategy.decimals);
    return formatDollarAmount(+balanceInUsd, 2)
  }

  const formatStakedAmountInToken = (amount: BigNumber) => {
    const numberAmount = parseFloat(ethers.utils.formatUnits(amount, strategy.decimals))
    return roundToNDecimals(numberAmount, 6)
  }

  const getApy = (apy: number) => {
    if ([capEth.strategyAddress, capUSDC.strategyAddress].includes(strategy.strategyAddress)) {
      return `~${apy}`
    }
    return apy
  }

  const handleOpenModal = () => {
    openModal(true)
  }

  return (
    <div className={`${cardGradient} border-[#181E2F] border-solid border-2 rounded-2xl p-2 ${status === 'HIDDEN' ? 'hidden' : ''}`}>
      <div className="p-1 flex items-center">
        <StrategyLogos strategy={strategy}></StrategyLogos>
        <div className="grow"/>
        <div className={`flex space-x-4 mr-8`}>
          <div className="flex flex-col flex-grow">
            <p className="text-xs text-tSecondary">Staked</p>
            <p className={`text-2xl text-tPrimary`}>{status === 'ACTIVE' ? `$${getUserStakedInDollars(userStaked)}` : '-'}</p>
            <p className={`text-xs text-tSecondary`}>
              {status === 'ACTIVE' ? `${formatStakedAmountInToken(userStaked)} ${(strategy.tokenSymbol)}` : '-'}
            </p>
          </div>

          <div className="flex flex-col w-22">
            <p className="text-xs text-tSecondary">APY</p>
            {status === 'ACTIVE' ? (
              <WithLoader className={`min-w-[5rem]`} type={`text`} isLoading={isLoading}>
                <p className={`text-2xl text-tPrimary`}>{getApy(apy)}%</p>
              </WithLoader>
            ) : (
              <p className={`text-2xl text-tPrimary`}>-</p>
            )}
          </div>
        </div>

        {status !== 'SOON' ? (
          <NonSSRWrapper>
            <Enable
              openModal={handleOpenModal}
              strategy={strategy}
            ></Enable>
          </NonSSRWrapper>
        ) : (
          <button
            className="w-full text-tPrimary bg-accentPrimary hover:bg-accentSecondary p-3 rounded-lg uppercase"
          >Coming Soon!</button>
        )
        }
      </div>
    </div>
  )
}
