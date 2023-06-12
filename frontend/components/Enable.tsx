import {useContext} from 'react';
import {useAccount} from 'wagmi';
import {SelectedVaultContext, TransactionAction} from "../contexts/SelectedVaultContext";
import {SingleStakeVault} from "../model/strategy";
import {useGetUserDepositedInVault} from '../hooks/useGetUserDepositedInVault';
import {ConnectKitButton} from 'connectkit';
import {VaultDataContext} from '../contexts/vault-data-context/VaultDataContext';
import { usePostHog } from 'posthog-js/react'

interface StrategyDetailsModalProps {
  openModal: () => void,
  strategy: Strategy,
}

export default function Enable({
                                 openModal,
                                 strategy,
                               }: StrategyDetailsModalProps) {
  const {vaultAddress, coolDownPeriod} = strategy
  const {userStaked} = useGetUserDepositedInVault(strategy)
  const {setAction, setSelectedVault} = useContext(SelectedVaultContext)
  const {vaultsData} = useContext(VaultDataContext)
  const vaultData = vaultsData[vaultAddress]
  const lastPoolDepositTime = vaultData?.lastPoolDepositTime?.toNumber() ? vaultData.lastPoolDepositTime.toNumber() * 1000 : 0
  const {isConnected} = useAccount()
  const posthog = usePostHog()
  // const hoverBorderColor = `hover:border-[#7E1FE7]`
  // const accentPrimaryGradient = 'bg-gradient-to-b from-[#7E1FE7] to-[#5C2DC5]'

  const handleClick = (action: TransactionAction) => {
    setAction(action)
    setSelectedVault(strategy)
    posthog?.capture(`STRATEGY_CARD:${action}`, {action, strategy: strategy.name})
    openModal()
  }

  const handleConnect = (show: any) => {
    posthog?.capture(`PRESSED:CONNECT`, {strategy: strategy.name})
    show()
  }

  const isWithdrawEnabled = () => {
    const userHasBalance = userStaked?.gt(0)
    if (strategy.hasWithdrawalSchedule) {
      const isTimeElapsedSinceLastDepositMoreThanCoolDownPeriod = Date.now() - lastPoolDepositTime > coolDownPeriod
      return userHasBalance && isTimeElapsedSinceLastDepositMoreThanCoolDownPeriod
    }
    return userHasBalance
  }

  return <>
    {(isConnected) && (
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleClick("deposit")}
          className={`text-tPrimary bg-gradient-to-r from-accentPrimary to-accentPrimaryGradient p-3 rounded-lg 
          hover:from-accentSecondary hover:to-accentSecondaryGradient 
          uppercase disabled:text-tSecondary disabled:border-tSecondary`}
        >Deposit
        </button>
        <button
          disabled={!isWithdrawEnabled()}
          className={`disabled:text-tSecondary disabled:border-tSecondary p-3 rounded-lg border-2 text-white
           border-accentPrimary hover:border-accentSecondaryGradient uppercase`}
          onClick={() => handleClick('withdraw')}
        >Withdraw
        </button>
      </div>
    )}

    {!isConnected &&
      <ConnectKitButton.Custom>
        {({show}) => {
          return (
            <button onClick={() => handleConnect(show)}
                    className={`w-full text-tPrimary bg-gradient-to-r from-accentPrimary to-accentPrimaryGradient
                     hover:from-accentSecondary hover:to-accentSecondaryGradient
                     p-3 rounded-lg uppercase`}>
              Connect Wallet
            </button>
          );
        }}
      </ConnectKitButton.Custom>
    }
  </>
}

