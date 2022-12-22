import { Accordion, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Strategy } from '../model/strategy';
import StrategyActionsContainer from './StrategyActionsContainer';
import { useGetUserStaked } from "../hooks/useGetUserStaked";
import Enable from './Enable';

export default function StrategyItem({strategy}: { strategy: Strategy }) {

  const {userStaked, fetchUserStaked} = useGetUserStaked({vaultAddress: strategy.vaultAddress})
  return <Accordion>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon/>}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <div className="flex justify-between w-full items-center">
        <span className="w-52">
          <img width={50} height={50} src={strategy.iconUrl} className="inline mr-3"/>
          <a href={strategy.protocolUrl}>
            <Typography className="inline hover:text-blue-700 hover:underline">{strategy.name}</Typography>
          </a>
        </span>
        <div className="flex flex-col items-center">
          <Typography className="text-xs text-stone-500">APY</Typography>
          <Typography>{strategy.apy}%</Typography>
        </div>
        <div className="flex flex-col items-center">
          <Typography className="text-xs text-stone-500">Staked</Typography>
          <Typography>{userStaked} $</Typography>
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
        ></Enable>
      </div>
    </AccordionSummary>
    {/*<AccordionDetails>*/}
    {/*</AccordionDetails>*/}
  </Accordion>
}
