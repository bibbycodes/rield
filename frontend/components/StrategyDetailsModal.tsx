import * as React from 'react';
import { useContext, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Link, TextField } from '@mui/material';
import { useAccount, useBalance } from 'wagmi';
import { useContractActions } from '../hooks/useContractActions';
import { formatEther } from "ethers/lib/utils";
import { capitalize } from "../utils/formatters";
import { useGetUserStaked } from "../hooks/useGetUserStaked";
import { ethers } from "ethers";
import { SelectedStrategyContext, TransactionAction } from "../contexts/SelectedStrategyContext";
import theme from "tailwindcss/defaultTheme";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.black',
  border: '2px solid white',
  boxShadow: 24,
  p: 4,
};

export interface StrategyDetailsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function StrategyDetailsModal({isOpen, setIsOpen}: StrategyDetailsModalProps) {
  const {action, selectedStrategy} = useContext(SelectedStrategyContext)
  const [amount, setAmount] = useState<number>(0)
  const {address: userAddress} = useAccount();
  const {vaultAddress, tokenAddress, tokenUrl, abi} = selectedStrategy;
  const {data} = useBalance({token: tokenAddress, address: userAddress})
  const actions = useContractActions({vaultAddress, amount, abi})
  const formattedBalance = data?.value ? formatEther(data.value) : "0";
  const symbol = data?.symbol || '';
  const {fetchUserStaked} = useGetUserStaked({vaultAddress})
  const handleClose = () => setIsOpen(false);

  const performAction = async (action: TransactionAction) => {
    console.log("PERFORMING ACTION", action)
    const fn = actions[action]?.write
    const tx = await fn?.()
    await tx?.wait()
    await fetchUserStaked()
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
          className={`bg-backgroundPrimary border-none text-tPrimary flex flex-col rounded-lg`}
        >
          <div>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {capitalize(action)} {selectedStrategy.tokenSymbol}
            </Typography>
          </div>
          <Box className={`bg-backgroundSecondary rounded-lg flex flex-row items-center items-stretch`}>
            <TextField
              sx={{border: 'none', bg: theme.bgPrimary, '& .MuiInputBase-input': {color: 'white'}}}
              id="tokenId"
              onChange={(e) => {
                const newAmount = +e.target.value
                if (isNaN(newAmount) || data?.value.lt(ethers.utils.parseEther(e.target.value))) {
                  setAmount(amount)
                } else {
                  setAmount(newAmount)
                }
              }}
              value={amount}
              className={`bg-backgroundPrimary text-tPrimary placeholder-tPrimary flex-grow`}
            >

            </TextField>
            <Button
              className={`text-tSecondary w-1/3 bg-none`}
              onClick={() => setAmount(+formattedBalance)}
            >MAX
            </Button>
            {/*<Divider/>*/}
            <Box className={`ml-auto rounded-lg flex flex-col items-center`}>
              {/*<Typography id="modal-modal-description" >*/}
              {/*  {selectedStrategy.tokenSymbol}*/}
              {/*</Typography>*/}
              {/*<Typography id="modal-modal-description">*/}
              {/*  Bal: {shortenString(formattedBalance) ?? 0}*/}
              {/*</Typography>*/}

            </Box>
          </Box>

          <Box className={`ml-auto`}>
            APY: {selectedStrategy.apy}%
          </Box>

          <Box className={`flex flex-row justify-between`}>
            <Button
              variant="outlined"
              className={'disabled:text-tSecondary disabled:border-tSecondary h-12 w-5/12'}
              onClick={() => handleClose()}>Cancel</Button>
            <Button className={`bg-accentPrimary text-white h-12 w-5/12`}
                    onClick={() => performAction(action)}>Confirm</Button>
          </Box>

          <Box className={`flex flex-col items-center`}>
            <Link href={tokenUrl} underline="hover" className={`text-blue-500 mt-4`}>Get Token</Link>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
