import { Prices } from "../contexts/TokenPricesContext";
import {useEffect, useState} from "react";
import {availableStrategies} from "../model/strategy";
import axios from "axios";
import {isEmpty} from "../utils/formatters";

export const useCoinGeckoPrices = () => {
  const [prices, setPrices] = useState<Prices>({});
  const shouldUpdate = (priceData: {data: any, date: number} | null) => priceData == null || Date.now() - priceData.date > 5 * 60 * 1000 || isEmpty(priceData.data)

  const updatePrices = async () => {
    const priceData = readPricesFromLocalStorage();
    if (shouldUpdate(priceData)) {
      const coinGeckoIds = availableStrategies.map(strategy => strategy.coinGeckoId)
      const coinGeckoIdsString = coinGeckoIds.join(',')
      const {data} = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoIdsString}&vs_currencies=usd`)
      let transformedData = coinGeckoIds.reduce((acc, id) => {
        acc[id] = data[id]?.usd
        return acc
      }, {} as any)
      
      transformedData = Object.entries(transformedData).filter(([, value]) => value).reduce((acc, [key, value]) => {
        acc[key] = value
        return acc
      }, {} as any)
      
      setPrices({...transformedData})
      cachePriceInLocalStorage({data: transformedData, date: Date.now()})
    }
  }
  
  const cachePriceInLocalStorage = (data:any) => {
    localStorage.setItem(`coinGeckoPrices`, JSON.stringify(data))
  }

  function readPricesFromLocalStorage() {
    const pricesFromLocalStorage = localStorage.getItem('coinGeckoPrices')
    if (pricesFromLocalStorage) {
      const parse = JSON.parse(pricesFromLocalStorage);
      setPrices(parse.data)
      return parse;
    }
  }

  useEffect(() => {
    updatePrices()
  }, [])
  
  return {coinGeckoPrices: prices, updateCoinGeckoPrices: updatePrices}
}
