import {useAccount} from "wagmi";
import {abi} from "../../artifacts/contracts/vaults/BeefyVaultV7.sol/BeefyVaultV7.json";
import {BigNumber} from "ethers";
import {convertToEther} from "../lib/utils";
import {useContext, useEffect, useState} from "react";
import {multicall} from "@wagmi/core";
import {availableStrategies} from "../model/strategy";
import {TokenPricesContext} from "../contexts/TokenPricesContext";
import {formatDollarAmount} from "../utils/formatters";


export const useGetUserStaked = () => {
  const [userStaked, setUserStaked] = useState<string>();
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
    const userStaked: number = balanceData.reduce((acc: any, balance: any, index: number) => {
      const pricePerShare = pricePerShareData[index]
      console.log({pricePerShare, balance})
      if (pricePerShare && balance) {
        const decimals = availableStrategies[index].decimals
        const userStaked = convertToEther((balance).mul(pricePerShare).div(BigNumber.from(10).pow(decimals))) ?? '0'
        const dollarAmount = parseFloat(userStaked) * prices[availableStrategies[index].coinGeckoId]
        return acc + dollarAmount
      }
      return acc
    }, 0) as number
    setUserStaked(formatDollarAmount(userStaked) ?? 0)
  }
  
  
  useEffect(() => {
    getTotalStakedInDollars()
  }, [userAddress])
  
  return {
    userStaked
  }
}
