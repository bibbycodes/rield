import {BigNumber} from "ethers";
import {useContext, useEffect, useState} from "react";
import {Strategy} from "../model/strategy";
import {useAccount} from "wagmi";
import {VaultDataContext} from "../contexts/vault-data-context/VaultDataContext";

export const useGetUserDepositedInVault = (strategy: Strategy) => {
  const [userStaked, setUserStaked] = useState<BigNumber>(BigNumber.from(0));
  const {decimals} = strategy;
  const {address: userAddress} = useAccount();
  const {vaultsData, refetchForStrategy} = useContext(VaultDataContext)

  const calculateUserStaked = (balance: BigNumber, pricePerShare: BigNumber) => {
    return balance && pricePerShare && userAddress ?
      balance.mul(pricePerShare)
        .div(BigNumber.from(10).pow(decimals))
      : BigNumber.from(0)
  }

  const fetchUserStaked = async () => {
    if (!userAddress) return
    await refetchForStrategy(strategy, userAddress)
  }

  useEffect(() => {
    if (!(userAddress && vaultsData[strategy.vaultAddress] )) {
      return;
    }

    const {
      vaultBalance,
      vaultPricePerFullShare,
      additionalData
    } = vaultsData[strategy.vaultAddress]
    let userStaked = calculateUserStaked(vaultBalance as BigNumber, vaultPricePerFullShare as BigNumber);
    if (strategy.name === 'HOP' && additionalData) {
      userStaked = additionalData.hopPoolBalance.mul(additionalData.hopVirtualPrice).div(BigNumber.from(10).pow(18)).div(BigNumber.from(10).pow(12))
    }
    setUserStaked(userStaked)
  }, [vaultsData[strategy.vaultAddress]])

  return {
    fetchUserStaked,
    userStaked
  }
}
