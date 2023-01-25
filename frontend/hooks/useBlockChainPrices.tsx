import {useEffect, useState} from "react"
import {getGlpPrice} from "../lib/apy-getter-functions/gmx"
import {useProvider} from "wagmi";
import {CoinGeckoPrices} from "../contexts/TokenPricesContext";

export const useBlockChainPrices = () => {
  const provider = useProvider()
  const [prices, setPrices] = useState<CoinGeckoPrices>({});
  
  const getGlpPriceFromChain = async () => {
    const glpPrice = await getGlpPrice(provider)
    setPrices({glp: glpPrice.asNumber})
  }
  
  const updateBlockChainPrices = async () => {
    await getGlpPriceFromChain()
  }
  
  useEffect(() => {
    getGlpPriceFromChain()
  }, [])
  
  return {blockChainPrices: prices, updateBlockChainPrices}
}
