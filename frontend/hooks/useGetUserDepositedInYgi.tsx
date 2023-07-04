import { BigNumber, ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Ygi } from '../model/ygi';
import { YgiDataContext } from '../contexts/vault-data-context/YgiDataContext';
import { VaultDataContext } from '../contexts/vault-data-context/VaultDataContext';
import { TokenPricesContext } from '../contexts/TokenPricesContext';

export const useGetUserDepositedInYgi = (ygi: Ygi) => {
  const [userStaked, setUserStaked] = useState<BigNumber>(BigNumber.from(0));
  const [userStakedUsd, setUserStakedUsd] = useState<BigNumber>(BigNumber.from(0));
  const {address: userAddress} = useAccount();
  const {ygisData, refetchForYgi} = useContext(YgiDataContext)
  const {vaultsData, refetchForStrategy} = useContext(VaultDataContext)
  const {prices} = useContext(TokenPricesContext)
  const ONE_USDC = ethers.utils.parseUnits('1', 6);

  const calculateUserStaked = (balance: BigNumber, pricePerShare: BigNumber, decimals: number) => {
    return balance && pricePerShare && userAddress ?
      balance.mul(pricePerShare)
        .div(BigNumber.from(10).pow(decimals))
      : BigNumber.from(0)
  }

  const fetchUserStaked = async () => {
    if (!userAddress) return
    await refetchForYgi(ygi, userAddress)
  }

  const getUserStakedInDollars = (amount: BigNumber, coinGeckoId: string) => {
    const isAmountPositive = amount.gt(BigNumber.from(0))
    if (!prices[coinGeckoId] || !isAmountPositive) {
      return BigNumber.from(0);
    }

    return amount.mul((prices[coinGeckoId] * 10000).toFixed(0)).div(10000);
  }

  useEffect(() => {
    // todo: fix anys and uncomment stuff
    if (!(userAddress && (ygisData as any)[ygi.vaultAddress] && vaultsData)) {
      return;
    }

    const {ygiComponents} = (ygisData as any)[ygi.vaultAddress]

    let userStakedUsdc = BigNumber.from(0)
    let userStakedUsd = BigNumber.from(0)
    for (const {vault} of ygiComponents) {
      if (!vaultsData[vault]) {
        return;
      }
      const vaultTokenStaked = calculateUserStaked(ygisData[ygi.vaultAddress].userDeposits[vault] as BigNumber,
        vaultsData[vault].vaultPricePerFullShare as BigNumber, vaultsData[vault].decimals);
      const userStakedInDollars = getUserStakedInDollars(vaultTokenStaked, vaultsData[vault].coinGeckoId);
      const usdcPrice = ethers.utils.parseUnits(`${prices['usd-coin']}`, 6);
      userStakedUsdc = userStakedUsdc.add(userStakedInDollars
        .mul(ONE_USDC.div(usdcPrice))
        .div(BigNumber.from(10).pow(vaultsData[vault].decimals - 6)));
      userStakedUsd = userStakedUsd.add(userStakedInDollars)
    }

    setUserStaked(userStakedUsdc)
    setUserStakedUsd(userStakedUsd)
  }, [(ygisData as any)[ygi.vaultAddress], vaultsData])

  return {
    fetchUserStaked,
    userStaked,
    userStakedUsd
  }
}
