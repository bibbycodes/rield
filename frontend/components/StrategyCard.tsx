import { Card, Typography } from '@mui/material';
import { Strategy } from '../model/strategy';
import { useGetUserDepositedInVault } from "../hooks/useGetUserDepositedInVault";
import Enable from './Enable';
import { StrategyLogos } from "./StrategyLogos";
import { TokenPricesContext } from "../contexts/TokenPricesContext";
import { useContext } from "react";
import { APYsContext } from "../contexts/ApyContext";
import { WithLoader } from "./WithLoader";
import { BigNumber, ethers } from 'ethers';

export default function StrategyCard({
                                       strategy,
                                       openModal
                                     }: { strategy: Strategy, openModal: (isOpen: boolean) => void }) {
  const {userStaked} = useGetUserDepositedInVault(strategy)
  const {prices} = useContext(TokenPricesContext)
  const APYs = useContext(APYsContext)
  const apy = APYs[strategy.strategyAddress]

  const getUserStakedInDollars = (amount: BigNumber) => {
    if (!prices[strategy.coinGeckoId]) {
      return '-'
    }
    return (amount.mul(BigNumber.from(prices[strategy.coinGeckoId] * 1000))).div(1000).div(BigNumber.from(10).pow(strategy.decimals)).toString()
  }

  const handleOpenModal = () => {
    openModal(true)
  }

  return (
    <Card className={`bg-backgroundSecondary rounded-lg p-2`}>
      <div className="p-4">
        <StrategyLogos strategy={strategy}></StrategyLogos>
        <div className={`flex`}>
          <div className="flex flex-col my-6 flex-grow">
            <Typography className="text-xs text-tSecondary">Staked</Typography>
            <Typography className={`text-2xl text-tPrimary`}>${getUserStakedInDollars(userStaked)}</Typography>
            <Typography
              className={`text-xs text-tSecondary`}>{ethers.utils.formatUnits(userStaked, strategy.decimals)} {(strategy.tokenSymbol)}</Typography>
          </div>
          <div className="flex flex-col my-6">
            <Typography className="text-xs text-tSecondary">APY</Typography>
            <WithLoader className={`min-w-[5rem]`} type={`text`} isLoading={apy == null}>
              <Typography className={`text-2xl text-tPrimary`}>{apy}%</Typography>
            </WithLoader>
          </div>
        </div>
        <Enable
          vaultAddress={strategy.vaultAddress}
          tokenAddress={strategy.tokenAddress}
          openModal={handleOpenModal}
          strategy={strategy}
        ></Enable>
      </div>
    </Card>
  )
}
