import * as React from 'react';
import { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import { useAccount, useBalance } from 'wagmi';
import { useContractActions } from '../hooks/useContractActions';
import { useGetUserDepositedInVault } from "../hooks/useGetUserDepositedInVault";
import { SelectedStrategyContext, TransactionAction } from "../contexts/SelectedStrategyContext";
import CloseIcon from '@mui/icons-material/Close';
import { APYsContext } from "../contexts/ApyContext";
import { ethers } from "ethers";
import { ToastContext, ToastSeverity } from "../contexts/ToastContext";
import Image from 'next/image'
import { useCalculateSendAmount } from '../hooks/useCalculateSendAmount';
import { WithLoader } from './WithLoader';
import IconButton from '@mui/material/IconButton';
import WarningIcon from '@mui/icons-material/Warning';
import { ADDRESS_ZERO } from '../lib/apy-getter-functions/cap';
import { VaultDataContext } from '../contexts/vault-data-context/VaultDataContext';
import { useApproveToken } from '../hooks/useApproveToken';
import { bgColor, buttonColor } from "../pages";
import LoadingButton from './LoadingButton';

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
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
  const {action, selectedStrategy} = useContext(SelectedStrategyContext)
  const {vaultAddress, tokenAddress, tokenUrl, abi, tokenLogoUrl, strategyAddress, decimals} = selectedStrategy;
  const {address: userAddress} = useAccount();
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
  const {approve, isLoading: approveLoading} = useApproveToken(tokenAddress, vaultAddress, userAddress, selectedStrategy, refetchForStrategy);
  const {userStaked, fetchUserStaked} = useGetUserDepositedInVault(selectedStrategy)
  const {apys, isLoading} = useContext(APYsContext)
  const apy = apys?.[strategyAddress]
  const isApproved = visibleAmount < '0' || vaultsData[vaultAddress]?.allowance?.gte(ethers.utils.parseUnits(visibleAmount, decimals))
  const showApprove = action === 'deposit' && tokenAddress !== ZERO_ADDRESS && !isApproved
  const {setOpen: setOpenToast, setMessage: setToastMessage, setSeverity} = useContext(ToastContext)
  const amount = useCalculateSendAmount(visibleAmount, action, decimals, userStaked, vaultTokenBalanceBn)
  const actions = useContractActions({vaultAddress, amount, abi, decimals: selectedStrategy.decimals, tokenAddress})

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

    return parseFloat(value).toFixed(6)
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
              <span className="ml-3 text-3xl">{selectedStrategy.tokenSymbol}</span>
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

          {selectedStrategy.hasWithdrawalSchedule && (
            <Box className={`inline-flex mt-4`}>
              <p className={`text-yellow-200`}>
                <WarningIcon fontSize="small" className={`mr-1`}/>
                This vault operates on a withdrawal schedule. For details, click <a
                href={'https://rld-1.gitbook.io/rld/withdrawal-schedules'}
                className={`text-yellow-200 underline`}
                target="_blank" rel="noopener noreferrer">
                here.
              </a>
              </p>
            </Box>
          )}

          <Box className={`flex flex-row justify-between`}>
            {showApprove &&
                <LoadingButton loading={approveLoading}
                               className={`w-full h-16 mt-6 uppercase rounded-lg text-tPrimary w-full`}
                               onClick={() => approve()}>
                    <button
                        className={`${buttonColor} rounded-lg text-tPrimary w-full h-16 mt-6 hover:bg-accentSecondary uppercase`}
                        onClick={() => approve()}
                    >Approve
                    </button>
                </LoadingButton>
            }
            {!showApprove &&
                <button
                    className={`${buttonColor} rounded-lg text-tPrimary w-full h-16 mt-6 hover:bg-accentSecondary uppercase`}
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
