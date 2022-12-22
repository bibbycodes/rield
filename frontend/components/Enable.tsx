import { Button } from '@mui/material';
import { useState } from 'react';
import { useApproveToken } from '../hooks/useApproveToken';
import { Address, useAccount, useBalance } from 'wagmi';

export default function Enable({tokenAddress, vaultAddress}: { tokenAddress: Address, vaultAddress: Address }) {
  const {address} = useAccount();
  const {approve, isApproved, fetchAllowance} = useApproveToken(tokenAddress, vaultAddress, address);
  const {data: balance, isError, isLoading} = useBalance({token: tokenAddress, address})
  const [amount, setAmount] = useState<number>(0)

  function openModal(type: 'deposit' | 'withdraw') {

  }

  return <div>
    {isApproved && (
      <>
        <Button onClick={() => openModal('deposit')}>Deposit</Button>
        <Button disabled={balance?.value?.lte(0)} onClick={() => openModal('withdraw')}>Withdraw</Button>
      </>
    )}

    {!isApproved && (
      <Button onClick={() => address && approve?.()}>Approve</Button>
    )}
  </div>
}

