import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {Divider, Link, TextField} from '@mui/material';
import { Strategy } from '../model/strategy';
import {useAccount, useBalance } from 'wagmi';
import { useContractActions } from '../hooks/useContractActions';
import {useContext, useState} from 'react';
import { parseEther } from 'ethers/lib/utils.js';
import {formatEther} from "ethers/lib/utils";
import {shortenString} from "../utils/formatters";
import {useGetUserStaked} from "../hooks/useGetUserStaked";
import {ethers} from "ethers";
import {SelectedStrategyContext, TransactionAction} from "../contexts/SelectedStrategyContext";

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
          className={`bg-black text-white flex flex-col rounded-lg`}
        >
          <div>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {action}
            </Typography>
          </div>
          <Box className={`border-solid border-2 h-18 flex flex-row items-center p-2`}>
            <TextField
              id="tokenId"
              color={"primary"}
              onChange={(e) => {
                const newAmount = +e.target.value
                if (isNaN(newAmount) || data?.value.lt(ethers.utils.parseEther(e.target.value))) {
                  setAmount(amount)
                } else {
                  setAmount(newAmount)
                }
              }}
              value={amount}
            />
            <Divider/>
            <Box className={`ml-auto border-solid border-2 flex flex-col items-center`}>
              <Typography id="modal-modal-description" sx={{mt: 2}}>
                {symbol}
              </Typography>
              <Typography id="modal-modal-description" sx={{mt: 2}}>
                Available: {shortenString(formattedBalance) ?? 0}
              </Typography>
              <Button className={`bg-blue-500 text-white ml-auto`}>MAX</Button>
            </Box>
          </Box>

          <Box className={`ml-auto`}>
            APY: 10%
          </Box>
          
          <Box className={`flex flex-row justify-between`}>
            <Button className={`bg-blue-500 text-white w-5/12`} onClick={() => handleClose()}>Cancel</Button>
            <Button className={`bg-blue-500 text-white w-5/12`} onClick={() => performAction(action)}>Confirm</Button>
          </Box>
          
          <Box className={`flex flex-col items-center`}>
            <Link href={tokenUrl} underline="hover" className={`text-blue-500 mt-4`}>Get Token!</Link> 
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
