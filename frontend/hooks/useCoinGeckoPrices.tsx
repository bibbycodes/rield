import { CoinGeckoPrices } from "../contexts/TokenPricesContext";
import {useState} from "react";
import {availableStrategies} from "../model/strategy";
import axios from "axios";
import {isEmpty} from "../utils/formatters";

export const useCoinGeckoPrices = () => {
  const [prices, setPrices] = useState<CoinGeckoPrices>({});
  const [lastUpdated, setLastUpdated] = useState<number>(0);
  const shouldUpdate = () => Date.now() - lastUpdated > 5 * 60 * 1000 || isEmpty(prices)
  const updatePrices = async () => {
    if (shouldUpdate()) {
      const coinGeckoIds = availableStrategies.map(strategy => strategy.coinGeckoId)
      const coinGeckoIdsString = coinGeckoIds.join(',')
      const {data} = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoIdsString}&vs_currencies=usd`)
      let transformedData = coinGeckoIds.reduce((acc, id) => {
        acc[id] = data[id]?.usd
        return acc
      }, {} as any)
      
      transformedData = Object.entries(transformedData).filter(([key, value]) => value).reduce((acc, [key, value]) => {
        acc[key] = value
        return acc
      }, {} as any)
      
      setPrices({...transformedData})
      setLastUpdated(Date.now())
    }
  }
  
  return {coinGeckoPrices: prices, updateCoinGeckoPrices: updatePrices}
}
