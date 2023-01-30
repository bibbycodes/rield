import {availableStrategies} from '../../model/strategy';
import StrategyCard from '../../components/StrategyCard';
import {useState} from 'react';
import DepositAndWithdrawModal from '../../components/DepositAndWithdrawModal';
import {useTotalDollarAmountDeposited} from "../../hooks/useTotalDollarAmountDeposited";
import {WithLoader} from "../../components/WithLoader";
import {Toast} from "../../components/Toast";

export default function Compound() {
  const [isStrategyDetailsModalOpen, setIsStrategyDetailsModalOpen] = useState<boolean>(false);
  const {totalDollarAmountDeposited} = useTotalDollarAmountDeposited()

  return <>
    <div className={`flex`}>
      <Toast/>
      <span className={`flex text-2xl text-tPrimary mb-4 w-full`}>
        Total Deposits: 
        <WithLoader 
          className={`ml-2 w-16`} 
          type={`text`} 
          isLoading={totalDollarAmountDeposited == null}
        >
          <p>${totalDollarAmountDeposited}</p>
      </WithLoader>
      </span>
    </div>
    <div className={`grid md:grid-cols-2 grid-cols-1 gap-4`}>
      {availableStrategies
        .map(strategy => <StrategyCard key={strategy.vaultAddress} strategy={strategy} openModal={setIsStrategyDetailsModalOpen}/>)}
      <DepositAndWithdrawModal
        isOpen={isStrategyDetailsModalOpen}
        setIsOpen={setIsStrategyDetailsModalOpen}
      ></DepositAndWithdrawModal>
    </div>
  </>
}
