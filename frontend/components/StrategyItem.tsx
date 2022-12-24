import {Card, Typography} from '@mui/material';
import {Strategy} from '../model/strategy';
import {useGetUserStaked} from "../hooks/useGetUserStaked";
import Enable from './Enable';
import {useFetch} from 'usehooks-ts';
import { shortenString } from '../utils/formatters';

export default function StrategyItem({strategy, openModal}: { strategy: Strategy, openModal: (isOpen: boolean) => void }) {
  const {userStaked} = useGetUserStaked({vaultAddress: strategy.vaultAddress})
  const {data} = useFetch(`https://api.coingecko.com/api/v3/simple/price?ids=${strategy.coinGeckoId}&vs_currencies=usd`)
  const price = data ? data[strategy.coinGeckoId].usd : 0

  const getUserStakedInDollars = (amount: string) => {
    return (parseFloat(amount) * price).toFixed(2)
  }

  const handleOpenModal = () => {
    openModal(true)
  }

  return (
    <Card className={`bg-backgroundSecondary rounded-lg p-2`}>
        <div className="p-4">
          <div>
            <img width={50} height={50} src={strategy.iconUrl} className="inline mr-3 h-12 w-12"/>
            <a href={strategy.protocolUrl}>
              <Typography className="inline text-tPrimary hover:text-blue-700 hover:underline">{strategy.name}</Typography>
            </a>
          </div>
          <div className="flex flex-col my-6">
            <Typography className="text-xs text-tSecondary">Staked</Typography>
            <Typography className={`text-2xl text-tPrimary`}>${getUserStakedInDollars(userStaked)}</Typography>
            <Typography className={`text-xs text-tSecondary`}>{shortenString(userStaked)} {(strategy.tokenSymbol)}</Typography>
          </div>
          <div className="flex flex-col mb-6">
            <Typography className="text-xs text-tSecondary">APY</Typography>
            <Typography className={`text-tPrimary`}>{strategy.apy}%</Typography>
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
