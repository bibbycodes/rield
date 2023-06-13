import * as React from 'react';
import {useContext, useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {TextField} from '@mui/material';
import {useAccount, useBalance} from 'wagmi';
import {useSingleStakeVaultActions} from '../hooks/useSingleStakeVaultActions';
import {useGetUserDepositedInVault} from "../hooks/useGetUserDepositedInVault";
import {SelectedVaultContext, TransactionAction} from "../contexts/SelectedVaultContext";
import CloseIcon from '@mui/icons-material/Close';
import {APYsContext} from "../contexts/ApyContext";
import {ethers} from "ethers";
import {ToastContext, ToastSeverity} from "../contexts/ToastContext";
import Image from 'next/image'
import {useCalculateSendAmount} from '../hooks/useCalculateSendAmount';
import {WithLoader} from './WithLoader';
import IconButton from '@mui/material/IconButton';
import {ADDRESS_ZERO} from '../lib/apy-getter-functions/cap';
import {VaultDataContext} from '../contexts/vault-data-context/VaultDataContext';
import {useApproveToken} from '../hooks/useApproveToken';
import {bgColor} from "../pages";
import LoadingButton from './LoadingButton';
import {usePostHog} from "posthog-js/react";
import {DepositWarning} from "./DepositWarning";
import {SingleStakeVault} from "../lib/types/strategy-types";
import {isTokenApproved} from "../lib/utils";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 400,
  width: '90vw',
  mitHeight: `100%`,
  boxShadow: 24,
};

export interface StrategyDetailsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function DepositAndWithdrawModal({isOpen, setIsOpen}: StrategyDetailsModalProps) {
  const {action, selectedVault} = useContext(SelectedVaultContext)
  const selectedStrategyAsSingleStakeVault = selectedVault as SingleStakeVault
  const {
    vaultAddress, 
    tokenAddress, 
    tokenUrl, 
    abi, 
    tokenLogoUrl, 
    strategyAddress, 
    decimals,
    hasWithdrawalSchedule,
    tokenSymbol,
    name
  } = selectedStrategyAsSingleStakeVault;

  const {address: userAddress} = useAccount();
  const posthog = usePostHog()
  const {data: tokenBalanceData} = useBalance({
    token: tokenAddress !== ADDRESS_ZERO ? tokenAddress : undefined,
    address: userAddress,
    watch: true
  })
  const {data: vaultTokenBalanceData} = useBalance({token: vaultAddress, address: userAddress, watch: true})
  const formattedTokenBalance = tokenBalanceData?.formatted
  const tokenBalanceBN = tokenBalanceData?.value
  const vaultTokenBalanceBn = vaultTokenBalanceData?.value
  const [visibleAmount, setVisibleAmount] = useState<string>('0')
  const {vaultsData, refetchForStrategy} = useContext(VaultDataContext)
  const {
    approve,
    isLoading: approveLoading
  } = useApproveToken(tokenAddress, vaultAddress, userAddress, selectedVault, refetchForStrategy);
  const {userStaked, fetchUserStaked} = useGetUserDepositedInVault(selectedVault)
  const {apys, isLoading} = useContext(APYsContext)
  const apy = apys?.[strategyAddress]
  const isApproved = isTokenApproved('tokenAddress', visibleAmount, vaultsData[vaultAddress], decimals) 
  const showApprove = action === 'deposit' && tokenAddress !== ADDRESS_ZERO && !isApproved
  const {setOpen: setOpenToast, setMessage: setToastMessage, setSeverity} = useContext(ToastContext)
  const amount = useCalculateSendAmount(visibleAmount, action, decimals, userStaked, vaultTokenBalanceBn)
  const actions = useSingleStakeVaultActions({
    vaultAddress,
    amount,
    abi,
    decimals: selectedVault.decimals,
    tokenAddress,
    isApproved: !showApprove
  })

  const handleClose = () => {
    setVisibleAmount('0')
    setIsOpen(false)
  };

  const getActionVerb = (action: TransactionAction) => {
    switch (action) {
      case 'deposit':
        return 'Deposit'
      case 'withdraw':
        return 'Withdrawal'
      default:
        return action
    }
  }

  const performAction = async (action: TransactionAction) => {
    if (parseFloat(visibleAmount) > 0) {
      const actionVerb = getActionVerb(action)
      const fn = actions[action]?.write
      try {
        const tx = await fn?.()
        handleClose()
        if (tx?.hash) {
          showToast(`${actionVerb} submitted!`, 'info')
        }
        await tx?.wait()
        showToast(`${actionVerb} successful!`, 'success')
        await fetchUserStaked()
      } catch (e: any) {
        if (e.code === 4001) {
          showToast(`Transaction rejected.`, 'warning')
        } else {
          console.log(e.message)
          showToast(`An unexpected error occurred.`, 'error')
        }
      }
    } else {
      showToast(`Amount must be greater than 0`, 'error')
    }
    posthog?.capture(`TX_MODAL:${action}`, {action, strategy: name, amount: visibleAmount})
  }

  function showToast(msg: string, severity: ToastSeverity) {
    setToastMessage(msg)
    setSeverity(severity)
    setOpenToast(true)
  }

  const handleSetMax = () => {
    if (tokenBalanceBN && formattedTokenBalance) {
      const amountToSet = (action === 'deposit') ? formattedTokenBalance : ethers.utils.formatUnits(userStaked, decimals)
      if (parseFloat(amountToSet) == 0) {
        setVisibleAmount('0.00')
        return
      }
      setVisibleAmount(amountToSet)
    }
  }

  const isBalanceLessThanAmount = (value: number) => {
    if (tokenBalanceBN) {
      const balanceToCheck = (action === 'deposit') ? +ethers.utils.formatUnits(tokenBalanceBN, decimals) : +ethers.utils.formatUnits(userStaked, decimals)
      return !isNaN(value) && balanceToCheck < value
    }
  }

  const removeLeadingZeros = (value: string) => {
    return value.replace(/^0+(?=\d)/, '')
  }

  const truncateAmount = (value?: string) => {
    const isNullOrUndefined = value == null || value === '';
    const isZero = value === '0';

    if (isNullOrUndefined || isZero) {
      return '0.00'
    }

    const commaIndex = value.indexOf('.');
    return commaIndex !== -1 ? value.slice(0, commaIndex + 6) : value;
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value.match(/^-{0,1}\d*\.?\d{0,18}/)?.join('')
    const isNullOrUndefined = value == null || value === '';

    if (isNullOrUndefined) {
      setVisibleAmount('')
      return
    }

    setVisibleAmount(removeLeadingZeros(value))
  }

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          id={"input-container"}
          className={`${bgColor} border-none text-tPrimary flex p-5 flex-col rounded-2xl`}
        >
          <div className={`flex pb-2`}>
            <Typography id="modal-modal-title" variant="h6" component="h2" className="capitalize">
              {action}
            </Typography>
            <IconButton
              className={'mt-[-1rem] mr-[-1rem] text-white ml-auto'}
              onClick={() => handleClose()}>
              <CloseIcon/>
            </IconButton>
          </div>
          <Box className={`bg-backgroundSecondary rounded-lg`}>
            <div className="pt-5 p-4 flex items-center">
              <Image alt={"Token Logo"} height={45} width={45} src={tokenLogoUrl}/>
              <span className="ml-3 text-3xl">{tokenSymbol}</span>
              <div className={'flex-col items-center flex ml-auto'}>
                <span className={`text-tSecondary`}>{action === 'deposit' ? `Balance` : `Staked`}</span>
                <span>{truncateAmount(
                  action === 'deposit' ? formattedTokenBalance : ethers.utils.formatUnits(userStaked, decimals)
                )}</span>
              </div>
            </div>
            <div className={'flex p-4 flex-row items-center h-20'}>
              <TextField
                sx={{
                  "& fieldset": {border: 'none'},
                  '& .MuiInputBase-input': {
                    color: isBalanceLessThanAmount(+visibleAmount) ? 'red' : 'white',
                    fontSize: '2rem',
                    padding: 0
                  }
                }}
                id="tokenId"
                margin="normal"
                onChange={handleAmountChange}
                value={visibleAmount}
                placeholder={'0.0'}
                className={`rounded-lg flex-grow`}
              >
              </TextField>
              <div
                className={`text-tSecondary w-1/3 bg-none ml-auto hover:text-accentPrimary`}
                onClick={handleSetMax}
              >
                <p className={`w-4 ml-auto mt-2 mr-8`}>
                  MAX
                </p>
              </div>
            </div>
          </Box>

          {hasWithdrawalSchedule && (
            <DepositWarning/>
          )}

          <Box className={`flex flex-row justify-between`}>
            {showApprove &&
                <LoadingButton loading={approveLoading}
                               className={`w-full h-16 mt-6 uppercase rounded-lg text-tPrimary w-full`}
                               onClick={() => approve()}>
                    <button
                        className={`bg-gradient-to-r from-accentPrimary to-accentPrimaryGradient
                        hover:from-accentSecondary hover:to-accentSecondaryGradient 
                        rounded-lg text-tPrimary w-full h-16 mt-6 hover:bg-accentSecondary uppercase`}
                        onClick={() => approve()}
                    >Approve
                    </button>
                </LoadingButton>
            }
            {!showApprove &&
                <button
                    className={`bg-gradient-to-r from-accentPrimary to-accentPrimaryGradient
                        hover:from-accentSecondary hover:to-accentSecondaryGradient 
                        rounded-lg text-tPrimary w-full h-16 mt-6 hover:bg-accentSecondary uppercase`}
                    onClick={() => performAction(action)}>{action}
                </button>}
          </Box>

          <WithLoader isLoading={isLoading} className={`mt-4`} height={`1.5rem`} width={`6rem`} type={'rectangular'}>
            <Box className={`ml-auto`}>
              APY: {apy}%
            </Box>
          </WithLoader>

          <Box className={`flex flex-col items-center mt-auto mx-2`}>
            <a href={tokenUrl} target="_blank" rel="noopener noreferrer" className={`text-tSecondary`}>
              Get Token
            </a>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
