import { ygis } from '../../model/ygi';
import React, { useState } from 'react';
import YgiCard from '../../components/YgiCard';
import DepositAndWithdrawModal from '../../components/ygi/DepositAndWithdrawModal';

export default function () {
  const [isStrategyDetailsModalOpen, setIsStrategyDetailsModalOpen] = useState<boolean>(false);

  return <>
    {ygis
      .map(ygi => <YgiCard key={ygi.vaultAddress} ygi={ygi} openModal={setIsStrategyDetailsModalOpen}/>)}

    <DepositAndWithdrawModal
      isOpen={isStrategyDetailsModalOpen}
      setIsOpen={setIsStrategyDetailsModalOpen}
    />
  </>
}
