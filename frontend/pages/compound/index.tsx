import {availableStrategies} from '../../model/strategy';
import StrategyItem from '../../components/StrategyItem';
import {useState} from 'react';
import StrategyDetailsModal from '../../components/StrategyDetailsModal';

export default function Compound() {
  const [isStrategyDetailsModalOpen, setIsStrategyDetailsModalOpen] = useState<boolean>(false);


  return <>
    <div className={`grid md:grid-cols-2 grid-cols-1 gap-4`}>
      {availableStrategies.map(strategy => <StrategyItem key={strategy.vaultAddress} strategy={strategy} openModal={setIsStrategyDetailsModalOpen}/>)}
      <StrategyDetailsModal
        isOpen={isStrategyDetailsModalOpen}
        setIsOpen={setIsStrategyDetailsModalOpen}
      ></StrategyDetailsModal>
    </div>
  </>
}
