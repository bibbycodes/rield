import {useAccount} from "wagmi";
import {abi} from "../../artifacts/contracts/vaults/BeefyVaultV7.sol/BeefyVaultV7.json";
import {BigNumber} from "ethers";
import {useContext, useEffect, useState} from "react";
import {multicall} from "@wagmi/core";
import {availableStrategies} from "../model/strategy";
import {TokenPricesContext} from "../contexts/TokenPricesContext";
import {formatDollarAmount} from "../utils/formatters";
import {formatUnits} from "ethers/lib/utils";

export const useTotalDollarAmountDeposited = () => {
  const [totalDollarAmountDeposited, setTotalDollarAmountDeposited] = useState<string | null>(null);
  const {address: userAddress} = useAccount();
  const {prices} = useContext(TokenPricesContext)

  const balanceCalls = {
    contracts: availableStrategies.map(strategy => {
      return {
        abi,
        address: strategy.vaultAddress,
        functionName: 'balanceOf',
        args: [userAddress]
      }
    })
  }
  
  const calculateUserStakedInDollars = (balance: BigNumber, price: number, pricePerShare: BigNumber, decimals: number) => {
    const userStaked = formatUnits(balance.mul(pricePerShare).div(BigNumber.from(10).pow(decimals)), 6)
    return parseFloat(userStaked) * price
  }

  const pricePerShareCalls = {
    contracts: availableStrategies.map(strategy => {
      return {
        abi,
        address: strategy.vaultAddress,
        functionName: 'getPricePerFullShare',
        args: []
      }
    })
  }

  async function getTotalStakedInDollars() {
    const balanceData = await multicall(balanceCalls)
    const pricePerShareData = await multicall(pricePerShareCalls)
    return balanceData.reduce((acc: any, balance: any, index: number) => {
      const pricePerShare = pricePerShareData[index] as BigNumber
      if (pricePerShare && balance && Object.keys(prices).length) {
        const decimals = availableStrategies[index].decimals
        const price = prices[availableStrategies[index].coinGeckoId]
        const dollarAmount = calculateUserStakedInDollars(balance, price, pricePerShare, decimals)
        return acc + dollarAmount
      }
      return acc
    }, 0) as number
  }

  useEffect(() => {
    getTotalStakedInDollars()
      .then(userStaked => {
        setTotalDollarAmountDeposited(formatDollarAmount(userStaked))
      })
      .catch(console.log)
  }, [userAddress, prices])

  return {
    totalDollarAmountDeposited
  }
}
