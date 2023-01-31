import {availableStrategies} from '../../model/strategy';
import StrategyCard from '../../components/StrategyCard';
import React, {useState} from 'react';
import DepositAndWithdrawModal from '../../components/DepositAndWithdrawModal';
import {useTotalDollarAmountDeposited} from "../../hooks/useTotalDollarAmountDeposited";
import {WithLoader} from "../../components/WithLoader";
import {Toast} from "../../components/Toast";
import { WalletOutlined } from '@mui/icons-material';

export default function Compound() {
  const [isStrategyDetailsModalOpen, setIsStrategyDetailsModalOpen] = useState<boolean>(false);
  const {totalDollarAmountDeposited} = useTotalDollarAmountDeposited()

  return <>
    <div className={`flex`}>
      <Toast/>
      <span className={`flex text-tPrimary mb-4 w-full`}>
        <div className="border border-gray-400 rounded-xl p-2 flex items-center">
        <WalletOutlined fontSize="large"/>
        </div>
        <div className="flex flex-col ml-3">
        <div className="text-tSecondary">
          Total Deposits
        </div>
        <WithLoader
          type={`text`}
          isLoading={totalDollarAmountDeposited == null}
        >
          <p className=" text-2xl">${totalDollarAmountDeposited}</p>
      </WithLoader>
        </div>
      </span>
    </div>
    <div className="flex justify-center">
      <div className={`grid md:grid-cols-2 grid-cols-1 gap-4 [&>*]:shadow-xl max-w-6xl w-full`}>
        {availableStrategies
          .map(strategy => <StrategyCard key={strategy.vaultAddress} strategy={strategy} openModal={setIsStrategyDetailsModalOpen}/>)}
        <DepositAndWithdrawModal
          isOpen={isStrategyDetailsModalOpen}
          setIsOpen={setIsStrategyDetailsModalOpen}
        ></DepositAndWithdrawModal>
      </div>
    </div>
  </>
}
