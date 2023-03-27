import { useAccount } from "wagmi";
import { BigNumber } from "ethers";
import { useContext, useEffect, useState } from "react";
import { availableStrategies, Strategy } from "../model/strategy";
import { TokenPricesContext } from "../contexts/TokenPricesContext";
import { formatDollarAmount } from "../utils/formatters";
import { formatUnits } from "ethers/lib/utils";
import { VaultDataContext } from "../contexts/vault-data-context/VaultDataContext";

export const useTotalDollarAmountDeposited = () => {
  const [totalDollarAmountDeposited, setTotalDollarAmountDeposited] = useState<string | null>(null);
  const {address: userAddress} = useAccount();
  const {prices} = useContext(TokenPricesContext)
  const {vaultsData} = useContext(VaultDataContext)
  const pricesStringified = JSON.stringify(prices)
  const vaultsDataStringified = JSON.stringify(vaultsData)

  const calculateUserStakedInDollars = (balance: BigNumber,
                                        price: number,
                                        pricePerShare: BigNumber,
                                        decimals: number,
                                        strategy: Strategy,
                                        totalSupply: BigNumber,
                                        additionalData: any) => {
    let userStaked = formatUnits(balance.mul(pricePerShare).div(BigNumber.from(10).pow(decimals)), decimals)
    if (strategy.name === 'HOP' && additionalData) {
      const vaultPortion = balance.mul(BigNumber.from(10).pow(18)).div(totalSupply);
      userStaked = formatUnits(
        additionalData.hopPoolBalance
          .mul(additionalData.hopVirtualPrice)
          .mul(vaultPortion)
          .div(BigNumber.from(10).pow(18))
          .div(BigNumber.from(10).pow(18))
          .div(BigNumber.from(10).pow(12)), 6);
    }
    return parseFloat(userStaked) * price
  }

  async function getTotalStakedInDollars() {
    return availableStrategies
      .filter(strategy => strategy.status === 'ACTIVE')
      .reduce((acc: any, strategy: any, index: number) => {
        if (vaultsData[strategy.vaultAddress] && Object.keys(prices).length && userAddress) {
          const {
            vaultBalance: balance,
            vaultPricePerFullShare: pricePerShare,
            totalSupply
          } = vaultsData[strategy.vaultAddress]
          if (balance == null || pricePerShare == null) {
            return acc;
          }
          const decimals = availableStrategies[index].decimals
          const price = prices[availableStrategies[index].coinGeckoId]
          const dollarAmount = calculateUserStakedInDollars(balance,
            price,
            pricePerShare,
            decimals,
            strategy,
            totalSupply,
            vaultsData[strategy.vaultAddress].additionalData)
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
  }, [userAddress, pricesStringified, vaultsDataStringified])

  return {
    totalDollarAmountDeposited
  }
}
