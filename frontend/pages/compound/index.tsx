import { availableStrategies } from '../../model/strategy';
import { useAccount } from 'wagmi';
import StrategyItem from '../../components/StrategyItem';

export default function Compound() {
  const {isConnecting, isDisconnected} = useAccount();
  if (isConnecting) return <div>Connecting...</div>;
  if (isDisconnected) return <div>Disconnected</div>;

  return <>
    <div>
      {availableStrategies.map(strategy => <StrategyItem key={strategy.vaultAddress} strategy={strategy}/>)}
    </div>
  </>
}
