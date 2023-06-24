import { BigNumber } from "ethers";
import { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { VaultDataContext } from "../contexts/vault-data-context/VaultDataContext";
import {LpPoolVault, RldVault, SingleStakeVault} from "../lib/types/strategy-types";
import {isLpPoolStrategy, isSingleStakeStrategy} from "../lib/utils";

export const useGetUserDepositedInVault = (strategy: RldVault) => {
  const [userStaked, setUserStaked] = useState<BigNumber>(BigNumber.from(0));

  const {address: userAddress} = useAccount();
  const {vaultsData, refetchForStrategy} = useContext(VaultDataContext)

  const calculateUserStaked = (balance: BigNumber, pricePerShare: BigNumber) => {
    if (isSingleStakeStrategy(strategy.type)) {
      const {decimals} = strategy as SingleStakeVault;
      return calculateUserStakedForSingleDepositVault(balance, pricePerShare, decimals)
    }
    
    if (isLpPoolStrategy(strategy.type)) {
      const {lp0TokenDecimals, lp1TokenDecimals} = strategy as LpPoolVault;
      return calculateUserStakedForSingleDepositVault(balance, pricePerShare, Math.max(lp0TokenDecimals, lp1TokenDecimals))
    }
    
    return BigNumber.from(0)
  }
  
  const calculateUserStakedForSingleDepositVault = (balance: BigNumber, pricePerShare: BigNumber, decimals: number) => {
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
    if (!(userAddress && vaultsData[strategy.vaultAddress])) {
      return;
    }

    const {
      vaultBalance,
      vaultPricePerFullShare,
      additionalData,
      totalSupply
    } = vaultsData[strategy.vaultAddress]
    let userStaked = calculateUserStaked(vaultBalance as BigNumber, vaultPricePerFullShare as BigNumber);
    if (additionalData) {
      if (strategy.name === 'HOP-USDC' || strategy.name === 'HOP-USDT') {
        const vaultPortion = totalSupply.gt(0) ? vaultBalance.mul(BigNumber.from(10).pow(18)).div(totalSupply) : 0;
        userStaked = additionalData.hopPoolBalance.mul(
          additionalData.hopVirtualPrice)
          .mul(vaultPortion)
          .div(BigNumber.from(10).pow(18))
          .div(BigNumber.from(10).pow(18))
          .div(BigNumber.from(10).pow(12))
      }
      if (strategy.name === 'HOP-ETH' || strategy.name === 'HOP-DAI') {
        const vaultPortion = totalSupply.gt(0) ? vaultBalance.mul(BigNumber.from(10).pow(18)).div(totalSupply) : 0;
        userStaked = additionalData.hopPoolBalance.mul(
          additionalData.hopVirtualPrice)
          .mul(vaultPortion)
          .div(BigNumber.from(10).pow(18))
          .div(BigNumber.from(10).pow(18));
      }

    }
    setUserStaked(userStaked)
  }, [vaultsData[strategy.vaultAddress]])

  return {
    fetchUserStaked,
    userStaked
  }
}
