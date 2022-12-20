import {Accordion, AccordionDetails, AccordionSummary, Typography} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Strategy} from '../model/strategy';
import StrategyActionsContainer from './StrategyActionsContainer';
import {useGetUserStaked} from "../hooks/useGetUserStaked";

export default function StrategyItem({strategy}: { strategy: Strategy }) {
  
  const {userStaked, fetchUserStaked} = useGetUserStaked({vaultAddress: strategy.vaultAddress })
  return <Accordion>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon/>}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <img width={50} height={50} src={strategy.iconUrl}/>
      <Typography>{strategy.name}</Typography>
      <Typography>{strategy.apy}</Typography>
      <Typography>{strategy.protocolUrl}</Typography>
      <Typography>{userStaked}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <StrategyActionsContainer 
        vaultAddress={strategy.vaultAddress}
        tokenUrl={strategy.tokenUrl}
        tokenAddress={strategy.tokenAddress}
        abi={strategy.abi}
        fetchUserStaked={fetchUserStaked}
      />
    </AccordionDetails>
  </Accordion>
}
