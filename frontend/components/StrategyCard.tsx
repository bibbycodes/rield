import {Card, Typography} from '@mui/material';
import {Strategy} from '../model/strategy';
import {useGetUserStakedInVault} from "../hooks/useGetUserStakedInVault";
import Enable from './Enable';
import {shortenString} from '../utils/formatters';
import {StrategyLogos} from "./StrategyLogos";
import {TokenPricesContext} from "../contexts/TokenPricesContext";
import {useContext} from "react";
import {APYsContext} from "../contexts/ApyContext";

export default function StrategyCard({strategy, openModal}: { strategy: Strategy, openModal: (isOpen: boolean) => void }) {
  const {userStaked} = useGetUserStakedInVault({vaultAddress: strategy.vaultAddress})
  const {prices} = useContext(TokenPricesContext)
  const APYs = useContext(APYsContext)
  const apy = APYs[strategy.strategyAddress]

  const getUserStakedInDollars = (amount: string) => {
    return (parseFloat(amount) * prices[strategy.coinGeckoId]).toFixed(2)
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
              className={`text-xs text-tSecondary`}>{shortenString(userStaked)} {(strategy.tokenSymbol)}</Typography>
          </div>
          <div className="flex flex-col my-6 mb-6">
            <Typography className="text-xs text-tSecondary">APY</Typography>
            <Typography className={`text-2xl text-tPrimary`}>{apy}%</Typography>
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
