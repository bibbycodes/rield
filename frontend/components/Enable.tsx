import { useContext } from 'react';
import { useApproveToken } from '../hooks/useApproveToken';
import { Address, useAccount, useConnect } from 'wagmi';
import { SelectedStrategyContext, TransactionAction } from "../contexts/SelectedStrategyContext";
import { Strategy } from "../model/strategy";
import { arbitrum } from 'wagmi/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { useGetUserDepositedInVault } from '../hooks/useGetUserDepositedInVault';
import { ConnectKitButton } from 'connectkit';

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
  const {connect} = useConnect({connector: new InjectedConnector({chains: [arbitrum]})})
  const showApprove = tokenAddress !== ZERO_ADDRESS && !isApproved

  const handleClick = (action: TransactionAction) => {
    setAction(action)
    setSelectedStrategy(strategy)
    openModal()
  }

  return <div>
    {(!showApprove) && (
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleClick("deposit")}
          className={'text-tPrimary bg-accentPrimary hover:bg-accentSecondary p-3 rounded-lg uppercase'}
        >Deposit
        </button>
        <button
          disabled={userStaked?.lte(0)}
          className={'disabled:text-tSecondary disabled:border-tSecondary p-3 rounded-lg border-2 text-accentPrimary border-accentPrimary hover:text-accentSecondary hover:border-accentSecondary uppercase'}
          onClick={() => handleClick('withdraw')}
        >Withdraw
        </button>
      </div>
    )}

    {isConnected
      && showApprove && (
        <button
          className="w-full text-tPrimary bg-accentPrimary hover:bg-accentSecondary p-3 rounded-lg uppercase"
          onClick={() => approve()}
        >Approve</button>
      )}

    {!isConnected &&
        <ConnectKitButton.Custom>
          {({show}) => {
            return (
              <button onClick={show}
                      className="w-full text-tPrimary bg-accentPrimary hover:bg-accentSecondary p-3 rounded-lg uppercase">
                Connect Wallet
              </button>
            );
          }}
        </ConnectKitButton.Custom>
    }
  </div>
}

