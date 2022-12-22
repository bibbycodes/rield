import {Button} from '@mui/material';
import {useContext} from 'react';
import {useApproveToken} from '../hooks/useApproveToken';
import {Address, useAccount, useBalance} from 'wagmi';
import {SelectedStrategyContext, TransactionAction} from "../contexts/SelectedStrategyContext";

export default function Enable({
                                 tokenAddress,
                                 vaultAddress,
                                 openModal
                               }: { tokenAddress: Address, vaultAddress: Address, openModal: () => void }) {
  const {address} = useAccount();
  const {approve, isApproved} = useApproveToken(tokenAddress, vaultAddress, address);
  const {data: balance} = useBalance({token: tokenAddress, address})
  const {setAction} = useContext(SelectedStrategyContext)

  const handleClick = (action: TransactionAction) => {
    setAction(action)
    openModal()
  }

  return <div>
    {isApproved && (
      <>
        <Button
          onClick={() => handleClick("deposit")}
          className={'bg-backgroundPrimary mx-2 text-tPrimary'}

        >Deposit</Button>
        <Button
          disabled={balance?.value?.lte(0)}
          className={'bg-backgroundPrimary text-tPrimary'}
          onClick={() => handleClick('withdraw')}
        >Withdraw</Button>
      </>
    )}

    {!isApproved && (
      <Button onClick={() => address && approve?.()}>Approve</Button>
    )}
  </div>
}

