import { BigNumber } from "ethers";
import { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Ygi } from '../model/ygi';
import { YgiDataContext } from '../contexts/vault-data-context/YgiDataContext';

export const useGetUserDepositedInYgi = (ygi: Ygi) => {
  const [userStaked, setUserStaked] = useState<BigNumber>(BigNumber.from(0));
  const {decimals} = ygi;
  const {address: userAddress} = useAccount();
  const {ygisData, refetchForYgi} = useContext(YgiDataContext)

  const calculateUserStaked = (balance: BigNumber, pricePerShare: BigNumber) => {
    return balance && pricePerShare && userAddress ?
      balance.mul(pricePerShare)
        .div(BigNumber.from(10).pow(decimals))
      : BigNumber.from(0)
  }

  const fetchUserStaked = async () => {
    if (!userAddress) return
    await refetchForYgi(ygi, userAddress)
  }

  useEffect(() => {
    // todo: fix anys and uncomment stuff
    if (!(userAddress && (ygisData as any)[ygi.vaultAddress])) {
      return;
    }

    const {} = (ygisData as any)[ygi.vaultAddress]
    // let userStaked = calculateUserStaked(ygiBalance as BigNumber, vaultPricePerFullShare as BigNumber);
    setUserStaked(userStaked)
  }, [(ygisData as any)[ygi.vaultAddress]])

  return {
    fetchUserStaked, userStaked
  }
}
