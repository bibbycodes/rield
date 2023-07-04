import {ygis} from '../../model/ygi';
import React, {useState} from 'react';
import YgiCard from '../../components/YgiCard';
import DepositAndWithdrawModal from '../../components/ygi/DepositAndWithdrawModal';
import YgiDetail from "../../components/YgiDetail";

export default function () {
  const [isStrategyDetailsModalOpen, setIsStrategyDetailsModalOpen] = useState<boolean>(false);

  return <>
    {ygis
      .map(ygi => <div key={ygi.vaultAddress} className="flex justify-center">
        <div className="flex sm:flex-row flex-col">
          <YgiCard ygi={ygi} openModal={setIsStrategyDetailsModalOpen}/>
          <YgiDetail ygi={ygi}/>
        </div>
      </div>)}

    <DepositAndWithdrawModal
      isOpen={isStrategyDetailsModalOpen}
      setIsOpen={setIsStrategyDetailsModalOpen}
    />
  </>
}
