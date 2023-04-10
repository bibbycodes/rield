import { BigNumber } from "ethers";
import { useContext, useEffect, useState } from "react";
import { Strategy } from "../model/strategy";
import { useAccount } from "wagmi";
import { VaultDataContext } from "../contexts/vault-data-context/VaultDataContext";

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
