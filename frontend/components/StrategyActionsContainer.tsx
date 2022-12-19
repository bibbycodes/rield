import { Button, TextField } from '@mui/material';
import { useState } from 'react';
import { useContractActions } from "../hooks/useContractActions";
import { useAccount, useBalance } from "wagmi";
import { useApproveToken } from "../hooks/useApproveToken";
import { BigNumber, ethers } from 'ethers';

export default function StrategyActionsContainer({vaultAddress, tokenAddress, tokenUrl, abi}: any) {
  const [amount, setAmount] = useState<number>(0)
  const {address} = useAccount();
  const {data: balance, isError, isLoading} = useBalance({token: tokenAddress, address})
  const {approve, isApproved} = useApproveToken(tokenAddress, vaultAddress, address);
  const {deposit, withdraw} = useContractActions({vaultAddress, amount, abi})

  return (
    <>
      <TextField
        id="tokenId"
        color={"primary"}
        onChange={(e) => {
          const newAmount = +e.target.value
          if (isNaN(newAmount) || balance?.value.lt(ethers.utils.parseEther(e.target.value))) {
            setAmount(amount)
          } else {
            setAmount(newAmount)
          }
        }}
        value={amount}
      />

      {isApproved && (
        <>
          <Button disabled={amount <= 0} onClick={() => deposit.write?.()}>Deposit</Button>
          <Button disabled={amount <= 0} onClick={() => withdraw.write?.()}>Withdraw</Button>
        </>
      )}

      {!isApproved && (
        <Button onClick={() => address && approve?.()}>Approve</Button>
      )}
      <a href={tokenUrl} target="_blank" rel="noreferrer">
        <Button disabled={amount <= 0}>
          Get Token
        </Button>
      </a>
    </>
  )
}
