import {Address, useAccount, useContractRead} from "wagmi";
import {abi} from "../../artifacts/contracts/vaults/BeefyVaultV7.sol/BeefyVaultV7.json";
import {BigNumber} from "ethers";
import {convertToEther} from "../lib/utils";
import {useEffect, useState} from "react";

interface useGetUserStakedProps {
  vaultAddress: Address,
}

export const useGetUserStaked = ({vaultAddress}: useGetUserStakedProps) => {
  const [userStaked, setUserStaked] = useState<string>('0');
  const {address: userAddress} = useAccount();

  const calculateUserStaked = (balance: BigNumber, pricePerShare: BigNumber) => {
    return convertToEther((balance).mul(pricePerShare).div(BigNumber.from(10).pow(18))) ?? '0'
  }

  const fetchUserStaked = async () => {
    console.log("FETCHING")
    await refetchFullPricePerShare()
    await refetchUserBalance()
  }

  const {data: fullPricePerShare, refetch: refetchFullPricePerShare} = useContractRead({
    abi,
    address: vaultAddress,
    functionName: 'getPricePerFullShare',
    args: []
  });

  const {data: userBalance, refetch: refetchUserBalance} = useContractRead({
    abi,
    address: vaultAddress,
    functionName: 'balanceOf',
    args: [userAddress]
  })

  useEffect(() => {
    setUserStaked(calculateUserStaked(userBalance as BigNumber, fullPricePerShare as BigNumber))
  }, [fullPricePerShare, userBalance])

  return {
    fetchUserStaked,
    userStaked
  }
}
