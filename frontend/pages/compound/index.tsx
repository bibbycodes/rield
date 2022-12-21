import { availableStrategies } from '../../model/strategy';
import StrategyItem from '../../components/StrategyItem';

export default function Compound() {
  return <>
    <div>
      {availableStrategies.map(strategy => <StrategyItem key={strategy.vaultAddress} strategy={strategy}/>)}
    </div>
  </>
}
