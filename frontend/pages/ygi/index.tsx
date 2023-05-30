import { ygis } from '../../model/ygi';
import React, { useContext, useState } from 'react';
import YgiCard from '../../components/YgiCard';
import DepositAndWithdrawModal from '../../components/ygi/DepositAndWithdrawModal';
import { YgiDataContext } from '../../contexts/vault-data-context/YgiDataContext';

export default function () {
  const [isStrategyDetailsModalOpen, setIsStrategyDetailsModalOpen] = useState<boolean>(false);
  const {refetchAll} = useContext(YgiDataContext)
  refetchAll()

  return <>
    {ygis
      .map(ygi => <YgiCard key={ygi.vaultAddress} ygi={ygi} openModal={setIsStrategyDetailsModalOpen}/>)}

    <DepositAndWithdrawModal
      isOpen={isStrategyDetailsModalOpen}
      setIsOpen={setIsStrategyDetailsModalOpen}
    />
  </>
}
