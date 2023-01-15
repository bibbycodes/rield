import * as React from 'react';
import {useContext, useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {Link, TextField} from '@mui/material';
import {useAccount, useBalance} from 'wagmi';
import {useContractActions} from '../hooks/useContractActions';
import {parseUnits} from "ethers/lib/utils";
import {capitalize} from "../utils/formatters";
import {useGetUserDepositedInVault} from "../hooks/useGetUserDepositedInVault";
import {SelectedStrategyContext, TransactionAction} from "../contexts/SelectedStrategyContext";
import CloseIcon from '@mui/icons-material/Close';
import {APYsContext} from "../contexts/ApyContext";
import {useGetShareData} from "../hooks/useGetShareData";
import {BigNumber} from "ethers";

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
  const {data: vaultTokenBalance} = useBalance({token: vaultAddress, address: userAddress})
  const formattedTokenBalance = tokenBalanceData?.formatted
  const tokenBalanceBN = tokenBalanceData?.value
  const {fullPricePerShare} = useGetShareData(selectedStrategy)
  const [amount, setAmount] = useState<BigNumber>(parseUnits('0', decimals))
  const [visibleAmount, setVisibleAmount] = useState<number>(0)
  const actions = useContractActions({vaultAddress, amount, abi, decimals: selectedStrategy.decimals})
  const {fetchUserStaked, userStaked} = useGetUserDepositedInVault(selectedStrategy)
  const {[strategyAddress]: apy} = useContext(APYsContext)
  const handleClose = () => setIsOpen(false);

  const performAction = async (action: TransactionAction) => {
    console.log(actions[action])
    const fn = actions[action]?.write
    const tx = await fn?.()
    await tx?.wait()
    await fetchUserStaked()
    handleClose()
  }

  const handleSetMax = () => {
    if (tokenBalanceBN && formattedTokenBalance) {
      const amountToSet = (action === 'deposit' || action === 'depositAll') ? +formattedTokenBalance : +userStaked
      setAmount(tokenBalanceBN)
      setVisibleAmount(amountToSet)
    }
  }

  const isBalanceLessThanAmount = (value: number) => {
    if (tokenBalanceBN && formattedTokenBalance) {
      const balanceToCheck = (action === 'deposit' || action === 'depositAll') ? +formattedTokenBalance : +userStaked
      return !isNaN(value) && balanceToCheck < value
    }
  }
  
  // Amount is the amount of shares that should be withdrawn, not the amount of want
  // function withdraw(uint256 _shares) public {...}

  // amount of shares in terms of want =
  // pricePerFullShare / wantAmount
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newAmount = +e.target.value
    const isNullOrUndefined = e.target.value == null || e.target.value === '';
    if (isNullOrUndefined) {
      setAmount(BigNumber.from(0))
      setVisibleAmount(0)
    } else if (isNaN(newAmount)) {
      setAmount(amount)
      setVisibleAmount(visibleAmount)
    } else {
      if (action === 'withdraw') {
        const numSharesBN = (fullPricePerShare as BigNumber).mul(parseUnits(newAmount.toString(), decimals)).div(parseUnits('1', decimals))
        setAmount(numSharesBN)
        setVisibleAmount(newAmount)
      } else {
        const amountBn = parseUnits(String(newAmount), decimals)
        setAmount(amountBn)
        setVisibleAmount(newAmount)
      }
    }
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
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {capitalize(action)}
            </Typography>
            <div
              className={'disabled:text-tSecondary h-1 ml-auto disabled:border-tSecondary'}
              onClick={() => handleClose()}>
              <CloseIcon></CloseIcon>
            </div>
          </div>
          <Box className={`bg-backgroundSecondary rounded-lg`}>
            <div className="pt-5 p-4 text-3xl flex items-center">
              <img height={45} width={45} src={tokenLogoUrl} alt=""/>
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
                className={`text-tSecondary w-1/3 bg-none ml-auto`}
                onClick={handleSetMax}
              >
                <Typography className={`w-4 ml-auto mr-8`}>
                  MAX
                </Typography>
              </div>
            </div>
          </Box>

          <Box className={`flex flex-row justify-between`}>
            <Button className={`bg-accentPrimary rounded-lg text-tPrimary w-full h-16 mt-6 hover:bg-accentSecondary`}
                    onClick={() => performAction(action)}>{action}</Button>
          </Box>

          <Box className={`ml-auto mt-4`}>
            APY: {apy ?? selectedStrategy.apy}%
          </Box>

          <Box className={`flex flex-col items-center mt-auto`}>
            <Link href={tokenUrl} underline="hover" className={`text-tSecondary mt-8`}>Get Token</Link>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
