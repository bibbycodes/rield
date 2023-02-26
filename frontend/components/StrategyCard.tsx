import { Strategy } from '../model/strategy';
import { useGetUserDepositedInVault } from "../hooks/useGetUserDepositedInVault";
import Enable from './Enable';
import { StrategyLogos } from "./StrategyLogos";
import { TokenPricesContext } from "../contexts/TokenPricesContext";
import { useContext } from "react";
import { APYsContext } from "../contexts/ApyContext";
import { WithLoader } from "./WithLoader";
import { BigNumber, ethers } from 'ethers';
import NonSSRWrapper from './NonSSRWrapper';

export default function StrategyCard({
                                       strategy,
                                       openModal
                                     }: { strategy: Strategy, openModal: (isOpen: boolean) => void }) {
  const {userStaked} = useGetUserDepositedInVault(strategy)
  const {prices} = useContext(TokenPricesContext)
  const {apys, isLoading} = useContext(APYsContext)
  const apy = apys[strategy.strategyAddress]
  const {status} = strategy
  const paused = true
  const lastPaused = Date.now()
  const canWithdraw = lastPaused - strategy.coolDownPeriod > 0
  const primaryToSecondary = 'bg-gradient-to-r from-backgroundSecondaryGradient to-backgroundSecondary'

  // TODO: Move this to a useGetUserStaked
  const getUserStakedInDollars = (amount: BigNumber) => {
    const isAmountPositive = amount.gt(BigNumber.from(0))
    if (!prices[strategy.coinGeckoId] || !isAmountPositive) {
      return 0
    }

    const balanceInUsd = ethers.utils.formatUnits(
      amount.mul((prices[strategy.coinGeckoId] * 10000).toFixed(0)).div(10000),
      strategy.decimals);
    return (+balanceInUsd).toFixed(2);
  }

  const handleOpenModal = () => {
    openModal(true)
  }

  return (
    <div className={`${primaryToSecondary} rounded-lg p-2`}>
      <div className="p-4">
        <StrategyLogos strategy={strategy}></StrategyLogos>
        <div className={`flex`}>
          <div className="flex flex-col my-6 flex-grow">
            <p className="text-xs text-tSecondary">Staked</p>
            <p
              className={`text-2xl text-tPrimary`}>{status === 'ACTIVE' ? `$${getUserStakedInDollars(userStaked)}` : '-'}</p>
            <p className={`text-xs text-tSecondary`}>
              {status === 'ACTIVE' ? `${parseFloat(ethers.utils.formatUnits(userStaked, strategy.decimals)).toFixed(4)} ${(strategy.tokenSymbol)}` : '-'}
            </p>
          </div>
          <div className="flex flex-col my-6">
            <p className="text-xs text-tSecondary">APY</p>
            {status === 'ACTIVE' ? (
              <WithLoader className={`min-w-[5rem]`} type={`text`} isLoading={isLoading}>
                <p className={`text-2xl text-tPrimary`}>{apy}%</p>
              </WithLoader>
            ) : (
              <p className={`text-2xl text-tPrimary`}>-</p>
            )}
          </div>
        </div>
        {status !== 'SOON' ? (
          <NonSSRWrapper>
            <Enable
              vaultAddress={strategy.vaultAddress}
              tokenAddress={strategy.tokenAddress}
              openModal={handleOpenModal}
              strategy={strategy}
              paused={paused}
              lastPaused={lastPaused}
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
