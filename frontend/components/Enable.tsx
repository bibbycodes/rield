import {useContext} from 'react';
import {useAccount} from 'wagmi';
import {SelectedStrategyContext, TransactionAction} from "../contexts/SelectedStrategyContext";
import {Strategy} from "../model/strategy";
import {useGetUserDepositedInVault} from '../hooks/useGetUserDepositedInVault';
import {ConnectKitButton} from 'connectkit';
import {VaultDataContext} from '../contexts/vault-data-context/VaultDataContext';
import { buttonColor, buttonHoverColor } from '../pages';

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
  const {setAction, setSelectedStrategy} = useContext(SelectedStrategyContext)
  const {vaultsData} = useContext(VaultDataContext)
  const vaultData = vaultsData[vaultAddress]
  const lastPoolDepositTime = vaultData?.lastPoolDepositTime?.toNumber() ? vaultData.lastPoolDepositTime.toNumber() * 1000 : 0
  const {isConnected} = useAccount()
  // const hoverBorderColor = `hover:border-[#7E1FE7]`
  // const accentPrimaryGradient = 'bg-gradient-to-b from-[#7E1FE7] to-[#5C2DC5]'

  const handleClick = (action: TransactionAction) => {
    setAction(action)
    setSelectedStrategy(strategy)
    openModal()
  }

  const isWithdrawEnabled = () => {
    const userHasBalance = userStaked?.gt(0)
    if (strategy.hasWithdrawalSchedule) {
      const isTimeElapsedSinceLastDepositMoreThanCoolDownPeriod = Date.now() - lastPoolDepositTime > coolDownPeriod
      return userHasBalance && isTimeElapsedSinceLastDepositMoreThanCoolDownPeriod
    }
    return userHasBalance
  }

  return <div>
    {(isConnected) && (
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleClick("deposit")}
          className={`text-tPrimary ${buttonColor} hover:bg-${buttonHoverColor} p-3 rounded-lg uppercase disabled:text-tSecondary disabled:border-tSecondary`}
        >Deposit
        </button>
        <button
          disabled={!isWithdrawEnabled()}
          className={`disabled:text-tSecondary disabled:border-tSecondary p-3 rounded-lg border-2 text-white border-[#6F47EF] hover:border-${buttonHoverColor} hover:text-${buttonHoverColor} uppercase`}
          onClick={() => handleClick('withdraw')}
        >Withdraw
        </button>
      </div>
    )}

    {!isConnected &&
      <ConnectKitButton.Custom>
        {({show}) => {
          return (
            <button onClick={show}
                    className={`w-full text-tPrimary ${buttonColor} bg-[4FD9B3] hover:bg-${buttonHoverColor} p-3 rounded-lg uppercase`}>
              Connect Wallet
            </button>
          );
        }}
      </ConnectKitButton.Custom>
    }
  </div>
}

