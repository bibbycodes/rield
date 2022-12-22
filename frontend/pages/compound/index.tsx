import {availableStrategies} from '../../model/strategy';
import StrategyItem from '../../components/StrategyItem';
import {useState} from 'react';
import StrategyDetailsModal from '../../components/StrategyDetailsModal';

export default function Compound() {
  const [isStrategyDetailsModalOpen, setIsStrategyDetailsModalOpen] = useState<boolean>(false);

  
  return <>
    <div className={`flex flex-row items-center`}>
      {availableStrategies.map(strategy => <StrategyItem key={strategy.vaultAddress} strategy={strategy} openModal={setIsStrategyDetailsModalOpen}/>)}
      <StrategyDetailsModal 
        isOpen={isStrategyDetailsModalOpen} 
        setIsOpen={setIsStrategyDetailsModalOpen}
      ></StrategyDetailsModal>
    </div>
  </>
}
