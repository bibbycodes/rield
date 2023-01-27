import {useEffect, useState} from "react"
import {getGlpPrice} from "../lib/apy-getter-functions/gmx"
import {useProvider} from "wagmi";
import {Prices} from "../contexts/TokenPricesContext";

export const useBlockChainPrices = () => {
  const provider = useProvider()
  const [prices, setPrices] = useState<Prices>({});
  
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