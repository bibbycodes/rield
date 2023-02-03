import * as React from 'react';
import {useContext, useState} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {Link, TextField} from '@mui/material';
import {Address, useAccount, useBalance} from 'wagmi';
import {useContractActions} from '../hooks/useContractActions';
import {useGetUserDepositedInVault} from "../hooks/useGetUserDepositedInVault";
import {SelectedStrategyContext, TransactionAction} from "../contexts/SelectedStrategyContext";
import CloseIcon from '@mui/icons-material/Close';
import {APYsContext} from "../contexts/ApyContext";
import {ethers} from "ethers";
import {ToastContext} from "../contexts/ToastContext";
import Image from 'next/image'
import { useCalculateSendAmount } from '../hooks/useCalculateSendAmount';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 400,
  boxShadow: 24,
};

export interface StrategyDetailsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function DepositAndWithdrawModal({isOpen, setIsOpen}: StrategyDetailsModalProps) {
  const {action, selectedStrategy} = useContext(SelectedStrategyContext)
  const {vaultAddress, tokenAddress, tokenUrl, abi, tokenLogoUrl, strategyAddress, decimals} = selectedStrategy;
  const {address: userAddress} = useAccount();
  const {data: tokenBalanceData} = useBalance({token: tokenAddress, address: userAddress})
  const {data: vaultTokenBalanceData} = useBalance({token: vaultAddress, address: userAddress})
  const formattedTokenBalance = tokenBalanceData?.formatted
  const tokenBalanceBN = tokenBalanceData?.value
  const vaultTokenBalanceBn = vaultTokenBalanceData?.value
  const [visibleAmount, setVisibleAmount] = useState<string>('0')
  const {userStaked, fetchUserStaked} = useGetUserDepositedInVault(selectedStrategy)
  const {[strategyAddress]: apy}:{[key: Address]: number} = useContext(APYsContext)
  const {setOpen: setOpenToast, setMessage: setToastMessage, setSeverity} = useContext(ToastContext)
  const amount = useCalculateSendAmount(visibleAmount, action, decimals, userStaked, vaultTokenBalanceBn)
  const actions = useContractActions({vaultAddress, amount, abi, decimals: selectedStrategy.decimals})

  const handleClose = () => setIsOpen(false);

  const performAction = async (action: TransactionAction) => {
    const fn = actions[action]?.write
    const tx = await fn?.()
    await tx?.wait().then(() => handleShowToast(action))
    await fetchUserStaked()
    handleClose()
  }

  const handleShowToast = (action: TransactionAction) => {
    const {isError, isFetching} = actions[action]
    if (!isFetching) {
      const message = isError ? `${action} failed` : `${action} successful!`
      const severity = isError ? "error" : "success"
      setToastMessage(message)
      setSeverity(severity)
      setOpenToast(true)
    }
  }

  const handleSetMax = () => {
    if (tokenBalanceBN && formattedTokenBalance) {
      const amountToSet = (action === 'deposit') ? +formattedTokenBalance : +ethers.utils.formatUnits(userStaked, decimals)
      if (amountToSet == 0) {
        setVisibleAmount('0.00')
        return
      }
      setVisibleAmount(amountToSet.toString())
    }
  }

  const isBalanceLessThanAmount = (value: number) => {
    if (tokenBalanceBN && formattedTokenBalance) {
      const balanceToCheck = (action === 'deposit') ? +formattedTokenBalance : +ethers.utils.formatUnits(userStaked, decimals)
      return !isNaN(value) && balanceToCheck < value
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value.match(/^-{0,1}\d*\.?\d{0,18}/)?.join('')
    const isNullOrUndefined = value == null || value === '';

    if (isNullOrUndefined) {
      setVisibleAmount('')
      return
    }

    setVisibleAmount(value)
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
          className={`bg-backgroundPrimary border-none text-tPrimary flex p-4 flex-col rounded-lg`}
        >
          <div className={"flex pb-2"}>
            <Typography id="modal-modal-title" variant="h6" component="h2" className="capitalize">
              {action}
            </Typography>
            <div
              className={'disabled:text-tSecondary h-1 ml-auto disabled:border-tSecondary'}
              onClick={() => handleClose()}>
              <CloseIcon></CloseIcon>
            </div>
          </div>
          <Box className={`bg-backgroundSecondary rounded-lg`}>
            <div className="pt-5 p-4 text-3xl flex items-center">
              <Image alt={"Token Logo"} height={45} width={45} src={tokenLogoUrl}/>
              <span className="ml-3">{selectedStrategy.tokenSymbol}</span>
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
                <Typography className={`w-4 ml-auto mr-8`}>
                  MAX
                </Typography>
              </div>
            </div>
          </Box>

          <Box className={`flex flex-row justify-between`}>
            <button
              className={`bg-accentPrimary rounded-lg text-tPrimary w-full h-16 mt-6 hover:bg-accentSecondary uppercase`}
              onClick={() => performAction(action)}>{action}
            </button>
          </Box>

          <Box className={`ml-auto mt-4`}>
            APY: {apy ?? selectedStrategy.apy}%
          </Box>

          <Box className={`flex flex-col items-center mt-auto mx-2`}>
            <Link href={tokenUrl} underline="hover" className={`text-tSecondary`}>
              Get Token
            </Link>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
