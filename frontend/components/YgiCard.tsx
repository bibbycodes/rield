import { Ygi } from '../model/ygi';
import React, { useContext } from 'react';
import Image from "next/image"
import { WithLoader } from './WithLoader';
import { useAccount } from 'wagmi';
import { ConnectKitButton } from 'connectkit';
import NonSSRWrapper from './NonSSRWrapper';
import posthog from 'posthog-js';
import { SelectedYgiContext, TransactionAction } from '../contexts/SelectedYgiContext';
import { useGetUserDepositedInYgi } from '../hooks/useGetUserDepositedInYgi';
import { BigNumber, ethers } from 'ethers';
import { formatDollarAmount } from '../utils/formatters';

export default function YgiCard({ygi, openModal}: { ygi: Ygi, openModal: (isOpen: boolean) => void }) {
  const {isConnected} = useAccount()
  const {setAction, setSelectedYgi} = useContext(SelectedYgiContext)
  const totalAllocation = ygi.components.reduce((acc, component) => acc + component.allocation, 0);
  const {userStaked} = useGetUserDepositedInYgi(ygi)

  const handleClick = (action: TransactionAction) => {
    setAction(action)
    setSelectedYgi(ygi)
    posthog?.capture(`STRATEGY_CARD:${action}`, {action, ygi: ygi.name})
    openModal(true)
  }

  const getUserStakedInDollars = (amount: BigNumber) => {
    const balanceInUsd = ethers.utils.formatUnits(amount, 18);
    return formatDollarAmount(+balanceInUsd, 2)
  }

  const handleConnect = (show: any) => {
    show()
  }

  const isWithdrawEnabled = () => {
    return true;
  }

  return (
    <div
      className={`bg-gradient-to-b from-[#191F30] to-[#101625] border-[#181E2F]
      border-solid border-2 rounded-2xl max-w-md
      p-6 ${ygi.status === 'HIDDEN' ? 'hidden' : ''}`}>
      <div className="flex justify-between">
        <div>{ygi.name}</div>
        <Image alt={'Ygi Logo'} width={25} height={25} src={ygi.ygiLogoUrl} className="font-thin	mr-3"/>
      </div>


      <div className="flex">
        <div className="flex flex-col my-6 flex-grow">
          <p className="text-xs text-tSecondary">Staked</p>
          <p className={`text-2xl text-tPrimary`}>{ygi.status === 'ACTIVE' ? `$${getUserStakedInDollars(userStaked)}` : '-'}</p>
        </div>

        <div className="flex flex-col my-6">
          <p className="text-xs text-tSecondary">APY</p>
          {ygi.status === 'ACTIVE' ? (
            <WithLoader className={`min-w-[5rem]`} type={`text`} isLoading={false}>
              <p className={`text-2xl text-tPrimary`}>{17}%</p>
            </WithLoader>
          ) : (
            <p className={`text-2xl text-tPrimary`}>-</p>
          )}
        </div>
      </div>

      <NonSSRWrapper>
        <div>
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
        </div>
      </NonSSRWrapper>

      <div className="flex my-5">
        {ygi.components.map((component) =>
          <div className={`h-1`}
               style={{
                 background: component.color,
                 width: (component.allocation / totalAllocation * 100).toFixed(0) + '%'
               }}></div>
        )}
      </div>


      <div className="flex">
        {ygi.components.map((component) =>
          <>
            <Image alt={'Logo'} width={25} height={25} src={component.tokenLogoUrl} className="font-thin mr-3"/>
          </>
        )}
      </div>

    </div>
  )
}
