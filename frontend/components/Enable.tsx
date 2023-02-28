import {useContext} from 'react';
import {useApproveToken} from '../hooks/useApproveToken';
import {useAccount} from 'wagmi';
import {SelectedStrategyContext, TransactionAction} from "../contexts/SelectedStrategyContext";
import {Strategy} from "../model/strategy";
import {useGetUserDepositedInVault} from '../hooks/useGetUserDepositedInVault';
import {ConnectKitButton} from 'connectkit';
import {VaultDataContext} from '../contexts/vault-data-context/VaultDataContext';

interface StrategyDetailsModalProps {
  openModal: () => void,
  strategy: Strategy,
}

export default function Enable({
                                 openModal,
                                 strategy,
                               }: StrategyDetailsModalProps) {
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
  const {tokenAddress, vaultAddress, coolDownPeriod} = strategy
  const {address} = useAccount();
  const {userStaked} = useGetUserDepositedInVault(strategy)
  const {setAction, setSelectedStrategy} = useContext(SelectedStrategyContext)
  const {vaultsData, refetchForStrategy} = useContext(VaultDataContext)
  const vaultData = vaultsData[vaultAddress]
  const {approve} = useApproveToken(tokenAddress, vaultAddress, address, strategy, refetchForStrategy);
  const isApproved = vaultsData[vaultAddress]?.allowance?.gt(0)
  const lastDepositTime = vaultData?.lastPoolDepositTime?.toNumber() * 1000 ?? 0
  const lastPauseTime = vaultData?.lastPauseTime?.toNumber() * 1000 ?? 0
  const {isConnected} = useAccount()
  const showApprove = tokenAddress !== ZERO_ADDRESS && !isApproved
  const accentPrimaryGradient = 'bg-gradient-to-r from-accentPrimary to-accentPrimaryGradient'

  const handleClick = (action: TransactionAction) => {
    setAction(action)
    setSelectedStrategy(strategy)
    openModal()
  }

  const isWithdrawEnabled = () => {
    const userHasBalance = userStaked?.gte(0)
    if (strategy.hasWithdrawalSchedule) {
      const isTimeElapsedSinceLastDepositMoreThanCoolDownPeriod = Date.now() - lastDepositTime > coolDownPeriod
      const isTimeElapsedSinceLastPausedGreaterThanCoolDown = Date.now() - lastPauseTime > coolDownPeriod
      return userHasBalance && (isTimeElapsedSinceLastPausedGreaterThanCoolDown && isTimeElapsedSinceLastDepositMoreThanCoolDownPeriod)
    }
    return userHasBalance
  }

  return <div>
    {(isConnected && !showApprove) && (
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleClick("deposit")}
          className={`text-tPrimary ${accentPrimaryGradient} hover:bg-accentSecondary p-3 rounded-lg uppercase disabled:text-tSecondary disabled:border-tSecondary`}
        >Deposit
        </button>
        <button
          disabled={!isWithdrawEnabled()}
          className={`disabled:text-tSecondary disabled:border-tSecondary p-3 rounded-lg border-2 text-accentPrimary border-accentPrimary hover:text-accentSecondary hover:border-accentSecondary uppercase`}
          onClick={() => handleClick('withdraw')}
        >Withdraw
        </button>
      </div>
    )}

    {isConnected
      && showApprove && (
        <button
          className={`w-full text-tPrimary ${accentPrimaryGradient} hover:bg-accentSecondary p-3 rounded-lg uppercase`}
          onClick={() => approve()}
        >Approve</button>
      )}

    {!isConnected &&
      <ConnectKitButton.Custom>
        {({show}) => {
          return (
            <button onClick={show}
                    className={`w-full text-tPrimary ${accentPrimaryGradient} hover:bg-accentSecondary p-3 rounded-lg uppercase`}>
              Connect Wallet
            </button>
          );
        }}
      </ConnectKitButton.Custom>
    }
  </div>
}

