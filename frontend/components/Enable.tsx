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
  const lastPoolDepositTime = vaultData?.lastPoolDepositTime?.toNumber() ? vaultData.lastPoolDepositTime.toNumber() * 1000 : 0
  const {isConnected} = useAccount()
  const showApprove = tokenAddress !== ZERO_ADDRESS && !isApproved
  const purpleColor = `bg-gradient-to-b from-[#6F47EF] to-[#6F47DA]`
  const hoverColor = `[#8225ED]`
  const hoverBorderColor = `hover:border-[#7E1FE7]`
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
    {(isConnected && !showApprove) && (
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleClick("deposit")}
          className={`text-tPrimary ${purpleColor} hover:bg-${hoverColor} p-3 rounded-lg uppercase disabled:text-tSecondary disabled:border-tSecondary`}
        >Deposit
        </button>
        <button
          disabled={!isWithdrawEnabled()}
          className={`disabled:text-tSecondary disabled:border-tSecondary p-3 rounded-lg border-2 text-white border-[#6F47EF] hover:border-${hoverColor} hover:text-${hoverColor} uppercase`}
          onClick={() => handleClick('withdraw')}
        >Withdraw
        </button>
      </div>
    )}

    {isConnected
      && showApprove && (
        <button
          className={`w-full text-tPrimary ${purpleColor} hover:bg-${hoverColor} p-3 rounded-lg uppercase`}
          onClick={() => approve()}
        >Approve</button>
      )}

    {!isConnected &&
      <ConnectKitButton.Custom>
        {({show}) => {
          return (
            <button onClick={show}
                    className={`w-full text-tPrimary ${purpleColor} bg-[4FD9B3] hover:bg-${hoverColor} p-3 rounded-lg uppercase`}>
              Connect Wallet
            </button>
          );
        }}
      </ConnectKitButton.Custom>
    }
  </div>
}

