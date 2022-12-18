import { Button } from '@mui/material';
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { abi } from '../resources/BeefyVaultV7.json'
import { vaultAddress } from '../../../resources/deploy-output.json'
import { useState } from 'react';

export default function Deposit() {
  const [amount, setAmount] = useState<number>(0)
  const {config} = usePrepareContractWrite({
    address: vaultAddress,
    abi,
    args: [amount],
    functionName: 'deposit',
  })
  const {data, write} = useContractWrite(config)

  const {isLoading, isSuccess} = useWaitForTransaction({
    hash: data?.hash,
  })
  return <>
    <input
      id="tokenId"
      onChange={(e) => setAmount(+e.target.value)}
      placeholder="420"
      value={amount}
    />
    <Button disabled={amount <= 0} onClick={() => write?.()}>Deposit</Button>
  </>
}
