import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Strategy } from '../model/strategy';
import Deposit from './Deposit';

export default function StrategyItem({strategy}: { strategy: Strategy }) {
  return <Accordion>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon/>}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <img src={strategy.iconUrl}/>
      <Typography>{strategy.name}</Typography>
      <Typography>{strategy.apy}</Typography>
      <Typography>{strategy.protocolUrl}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Deposit/>
    </AccordionDetails>
  </Accordion>
}
