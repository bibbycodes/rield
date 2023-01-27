import * as React from 'react';
import {useContext, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {Link, TextField} from '@mui/material';
import {useAccount, useBalance} from 'wagmi';
import {useContractActions} from '../hooks/useContractActions';
import {parseUnits} from "ethers/lib/utils";
import {useGetUserDepositedInVault} from "../hooks/useGetUserDepositedInVault";
import {SelectedStrategyContext, TransactionAction} from "../contexts/SelectedStrategyContext";
import CloseIcon from '@mui/icons-material/Close';
import {APYsContext} from "../contexts/ApyContext";
import {BigNumber, ethers} from "ethers";
import {ToastContext} from "../contexts/ToastContext";
import Image from 'next/image'

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
  const [amount, setAmount] = useState<BigNumber>(parseUnits('0', decimals))
  const [visibleAmount, setVisibleAmount] = useState<number>(0)
  const actions = useContractActions({vaultAddress, amount, abi, decimals: selectedStrategy.decimals})
  const {userStaked, fetchUserStaked} = useGetUserDepositedInVault(selectedStrategy)
  const {[strategyAddress]: apy} = useContext(APYsContext)
  const {setOpen: setOpenToast, setMessage: setToastMessage, setSeverity} = useContext(ToastContext)

  const handleClose = () => setIsOpen(false);

  const performAction = async (action: TransactionAction) => {
    const fn = actions[action]?.write
    console.log({fn, action, actionData: actions[action]})
    const tx = await fn?.()
    await tx?.wait().then(() => {
      handleShowToast(action)
    })
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
      setVisibleAmount(amountToSet)
      syncAmountWithVisibleAmount(amountToSet)
    }
  }

  const isBalanceLessThanAmount = (value: number) => {
    if (tokenBalanceBN && formattedTokenBalance) {
      const balanceToCheck = (action === 'deposit') ? +formattedTokenBalance : +ethers.utils.formatUnits(userStaked, decimals)
      return !isNaN(value) && balanceToCheck < value
    }
  }

  function syncAmountWithVisibleAmount(value: string | number) {
    const newAmount = +value
    const isNullOrUndefined = value == null || value === '';

    if (isNullOrUndefined) {
      setAmount(BigNumber.from(0))
      setVisibleAmount(0)
    } else if (!/[0-9]+[.,]?[0-9]*/.test(value.toString())) {
      setAmount(amount)
      setVisibleAmount(visibleAmount)
    } else {
      if (action === 'withdraw') {
        const multiplier = BigNumber.from(10).pow(decimals)
        const withdrawAmountInWant = parseUnits(newAmount.toString(), decimals)
        const ratioOfWithdrawAmountToStakedAmount = withdrawAmountInWant.mul(multiplier).div(userStaked)
        const numSharesBN = ratioOfWithdrawAmountToStakedAmount.mul(vaultTokenBalanceBn as BigNumber).div(multiplier)
        setAmount(numSharesBN)
        setVisibleAmount(newAmount)
      } else {
        const amountBn = parseUnits(String(newAmount), decimals)
        setAmount(amountBn)
        setVisibleAmount(newAmount)
      }
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const visibleAmount = e.target.value;
    syncAmountWithVisibleAmount(visibleAmount);
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
                    color: isBalanceLessThanAmount(visibleAmount) ? 'red' : 'white',
                    fontSize: '2rem',
                    padding: 0
                  }
                }}
                id="tokenId"
                margin="normal"
                onChange={handleAmountChange}
                value={visibleAmount}
                placeholder={tokenBalanceData?.value.toString()}
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
            <Button
              className={`bg-accentPrimary rounded-lg text-tPrimary w-full h-16 mt-6 hover:bg-accentSecondary`}
              onClick={() => performAction(action)}>{action}
            </Button>
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
