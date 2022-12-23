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
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => handleClick("deposit")}
          variant="contained"
          className={'text-tPrimary bg-accentPrimary p-3'}
        >Deposit</Button>
        <Button
          disabled={balance?.value?.lte(0)}
          variant="outlined"
          className={'disabled:text-tSecondary disabled:border-tSecondary p-3'}
          onClick={() => handleClick('withdraw')}
        >Withdraw</Button>
      </div>
    )}

    {!isApproved && (
      <Button className="w-full bg-accentPrimary" variant="contained" onClick={() => address && approve?.()}>Approve</Button>
    )}
  </div>
}

