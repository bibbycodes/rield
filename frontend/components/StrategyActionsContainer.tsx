import {Button, TextField} from '@mui/material';
import {useState} from 'react';
import {useContractActions} from "../hooks/useContractActions";
import {useAccount} from "wagmi";
import {useApproveToken} from "../hooks/useApproveToken";

export default function StrategyActionsContainer({vaultAddress, tokenAddress, tokenUrl, abi}: any) {
  const [amount, setAmount] = useState<number>(0)
  const {address} = useAccount();
  const {approve, isApproved} = useApproveToken(tokenAddress, vaultAddress, address!);
  const {deposit, withdraw} = useContractActions({vaultAddress, amount, abi})

  return (
    <>
      <TextField
        id="tokenId"
        color={"primary"}
        type="number"
        onChange={(e) => setAmount(+e.target.value)}
        placeholder="420"
        value={amount}
      />

      {isApproved && (
        <>
          <Button disabled={amount <= 0} onClick={() => deposit.write?.()}>Deposit</Button>
          <Button disabled={amount <= 0} onClick={() =>  withdraw.write?.()}>Withdraw</Button>
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
