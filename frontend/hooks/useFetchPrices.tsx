import { Prices } from "../contexts/TokenPricesContext";
import { useEffect, useState } from "react";
import { availableStrategies } from "../model/strategy";
import axios from "axios";
import { getGlpPrice } from '../lib/apy-getter-functions/gmx';
import { staticArbProvider } from '../utils/static-provider';
import { isEmpty } from '../utils/formatters';

export const useFetchPrices = () => {
  const [prices, setPrices] = useState<Prices>({});
  const shouldUpdate = (priceData: {data: any, date: number} | null) => priceData == null || Date.now() - priceData.date > 5 * 60 * 1000 || isEmpty(priceData.data)

  const updatePrices = async () => {
    const priceData = readPricesFromLocalStorage();
    if (shouldUpdate(priceData)) {
      const glpPrice = await getGlpPrice(staticArbProvider)
      let coinGeckoIds = availableStrategies
        .filter(strategy => strategy.status !== 'DISABLED')
        .map(strategy => strategy.coinGeckoId)
      coinGeckoIds = [...coinGeckoIds, 'ethereum', 'hop-protocol']
      const coinGeckoIdsString = coinGeckoIds.join(',')
      const {data} = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoIdsString}&vs_currencies=usd`)
      let transformedData = new Map(coinGeckoIds.map((id) => [id, data[id]?.usd]));
      let allPrices = {...(Object.fromEntries(transformedData)), glp: glpPrice.asNumber};
      setPrices(allPrices)
      cachePriceInLocalStorage({data: allPrices, date: Date.now()})
    }
  }

  const cachePriceInLocalStorage = (data: any) => {
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

  return {prices, updatePrices: updatePrices}
}
