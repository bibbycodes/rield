import {BigNumber} from "ethers";
import {useEffect, useState} from "react";
import {Strategy} from "../model/strategy";
import {useGetShareData} from "./useGetShareData";
import {formatUnits} from "ethers/lib/utils";

export const useGetUserDepositedInVault = (strategy: Strategy) => {
  const [userStaked, setUserStaked] = useState<string>('0');
  const {decimals} = strategy;

  const {fullPricePerShare, refetchFullPricePerShare, userBalance, refetchUserBalance} = useGetShareData(strategy)

  const calculateUserStaked = (balance: BigNumber, pricePerShare: BigNumber) => {
    // balance is amount of LP token
    // fullPricePerShare is the price of 1 LP token in terms of the want token
    return balance && pricePerShare ? formatUnits(
      balance.mul(pricePerShare)
        .div(BigNumber.from(10).pow(decimals))
      , 6) : '0'
  }

  const fetchUserStaked = async () => {
    await refetchFullPricePerShare()
    await refetchUserBalance()
  }

  useEffect(() => {
    if (userBalance && fullPricePerShare) {
      setUserStaked(calculateUserStaked(userBalance as BigNumber, fullPricePerShare as BigNumber))
    }
  }, [fullPricePerShare, userBalance])

  return {
    fetchUserStaked,
    userStaked
  }
}
