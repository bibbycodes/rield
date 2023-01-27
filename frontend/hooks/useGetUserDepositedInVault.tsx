import {BigNumber} from "ethers";
import {useContext, useEffect, useState} from "react";
import {Strategy} from "../model/strategy";
import {VaultDataContext} from "../contexts/vault-data-context/VaultDataContext";
import {useAccount} from "wagmi";

export const useGetUserDepositedInVault = (strategy: Strategy) => {
  const [userStaked, setUserStaked] = useState<BigNumber>(BigNumber.from(0));
  const {decimals} = strategy;
  const {address: userAddress} = useAccount();
  const {vaultsData, refetchSingle} = useContext(VaultDataContext)
  
  const calculateUserStaked = (balance: BigNumber, pricePerShare: BigNumber) => {
    return balance && pricePerShare && userAddress ?
      balance.mul(pricePerShare)
        .div(BigNumber.from(10).pow(decimals))
      : BigNumber.from(0)
  }

  const fetchUserStaked = async () => {
    if (!userAddress) return
    await refetchSingle(strategy, userAddress)
  }

  useEffect(() => {
    
    if (!(userAddress && vaultsData[strategy.vaultAddress] )) {
      return;
    }
    
    const {
      vaultBalance,
      vaultPricePerFullShare,
    } = vaultsData[strategy.vaultAddress]
    setUserStaked(calculateUserStaked(vaultBalance as BigNumber, vaultPricePerFullShare as BigNumber))
  }, [vaultsData[strategy.vaultAddress]])

  return {
    fetchUserStaked,
    userStaked
  }
}
