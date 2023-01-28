import {useAccount} from "wagmi";
import {BigNumber} from "ethers";
import {useContext, useEffect, useState} from "react";
import {availableStrategies} from "../model/strategy";
import {TokenPricesContext} from "../contexts/TokenPricesContext";
import {formatDollarAmount} from "../utils/formatters";
import {formatUnits} from "ethers/lib/utils";
import {VaultDataContext} from "../contexts/vault-data-context/VaultDataContext";

export const useTotalDollarAmountDeposited = () => {
  const [totalDollarAmountDeposited, setTotalDollarAmountDeposited] = useState<string | null>(null);
  const {address: userAddress} = useAccount();
  const {prices} = useContext(TokenPricesContext)
  const {vaultsData} = useContext(VaultDataContext)

  const calculateUserStakedInDollars = (balance: BigNumber, price: number, pricePerShare: BigNumber, decimals: number) => {
    const userStaked = formatUnits(balance.mul(pricePerShare).div(BigNumber.from(10).pow(decimals)), decimals)
    return parseFloat(userStaked) * price
  }

  async function getTotalStakedInDollars() {
    return availableStrategies.reduce((acc: any, strategy: any, index: number) => {
      if (vaultsData[strategy.vaultAddress] && Object.keys(prices).length && userAddress) {
        const {
          vaultBalance: balance,
          vaultPricePerFullShare: pricePerShare,
        } = vaultsData[strategy.vaultAddress]
        if (balance == null || pricePerShare || null) {
          return acc;
        }
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
  }, [userAddress, prices])

  return {
    totalDollarAmountDeposited
  }
}
