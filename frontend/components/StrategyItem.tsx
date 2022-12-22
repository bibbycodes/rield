import {Card, Typography} from '@mui/material';
import {Strategy} from '../model/strategy';
import {useGetUserStaked} from "../hooks/useGetUserStaked";
import Enable from './Enable';
import {useFetch} from 'usehooks-ts';

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
    <Card className={`bg-backgroundSecondary rounded-lg p-2 h-40 w-1/2`}>
        <div className="flex flex-col justify-between w-full items-center">
          <span className="w-52 mr-auto">
            <img width={50} height={50} src={strategy.iconUrl} className="inline mr-3"/>
            <a href={strategy.protocolUrl}>
              <Typography className="inline text-tPrimary hover:text-blue-700 hover:underline">{strategy.name}</Typography>
            </a>
          </span>
          <div className="flex flex-col items-center">
            <Typography className="text-xs text-tSecondary">APY</Typography>
            <Typography className={`text-tPrimary`}>{strategy.apy}%</Typography>
          </div>
          <div className="flex flex-col items-center">
            <Typography className="text-xs text-tSecondary">Staked</Typography>
            <Typography className={`text-tPrimary`}>${getUserStakedInDollars(userStaked)}</Typography>
          </div>
          {/*<StrategyActionsContainer*/}
          {/*  vaultAddress={strategy.vaultAddress}*/}
          {/*  tokenUrl={strategy.tokenUrl}*/}
          {/*  tokenAddress={strategy.tokenAddress}*/}
          {/*  abi={strategy.abi}*/}
          {/*  fetchUserStaked={fetchUserStaked}*/}
          {/*/>*/}
          <Enable
            vaultAddress={strategy.vaultAddress}
            tokenAddress={strategy.tokenAddress}
            openModal={handleOpenModal}
          ></Enable>
        </div>
    </Card>
)
}
