import {Button} from '@mui/material';
import {useContext} from 'react';
import {useApproveToken} from '../hooks/useApproveToken';
import {Address, useAccount, useBalance, useConnect} from 'wagmi';
import {SelectedStrategyContext, TransactionAction} from "../contexts/SelectedStrategyContext";
import {Strategy} from "../model/strategy";
import { arbitrum } from 'wagmi/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useGetUserDepositedInVault } from '../hooks/useGetUserDepositedInVault';
interface StrategyDetailsModalProps {
  tokenAddress: Address,
  vaultAddress: Address,
  openModal: () => void,
  strategy: Strategy
}

export default function Enable({tokenAddress, vaultAddress, openModal, strategy}: StrategyDetailsModalProps) {
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
  const {address} = useAccount();
  const {approve, isApproved} = useApproveToken(tokenAddress, vaultAddress, address);
  const {userStaked} = useGetUserDepositedInVault(strategy)
  const {setAction, setSelectedStrategy} = useContext(SelectedStrategyContext)
  const {isConnected} = useAccount()
  const { connect } = useConnect({connector: new InjectedConnector({chains: [arbitrum]})})

  const handleClick = (action: TransactionAction) => {
    setAction(action)
    setSelectedStrategy(strategy)
    openModal()
  }

  const handleConnectOrApprove = () => {
    if (isConnected) {
      approve()
    } else {
      connect()
    }
  }

  const showApprove = tokenAddress !== ZERO_ADDRESS && !isApproved

  return <div>
    {(!showApprove) && (
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => handleClick("deposit")}
          variant="contained"
          className={'text-tPrimary bg-accentPrimary hover:bg-accentSecondary p-3'}
        >Deposit</Button>
        <Button
          disabled={userStaked?.lte(0)}
          variant="outlined"
          className={'disabled:text-tSecondary disabled:border-tSecondary p-3'}
          onClick={() => handleClick('withdraw')}
        >Withdraw</Button>
      </div>
    )}

    {showApprove && (
      <Button
        className="w-full bg-accentPrimary hover:bg-accentSecondary p-3"
        variant="contained"
        onClick={() => approve()}
      >{true ? 'Approve' : 'Connect Wallet'}</Button>
    )}
  </div>
}

