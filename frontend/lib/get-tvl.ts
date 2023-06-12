import {erc20Strategies, ethStrategies, singleStakeStrategies} from "../model/strategy";
import {Prices} from "../contexts/TokenPricesContext";
import {getHopSpecificCalls, VaultData} from "../contexts/vault-data-context/utils";
import {Address} from "wagmi";
import {formatUnits} from "ethers/lib/utils";
import {BigNumber} from "ethers";
import {VaultsData} from "../contexts/vault-data-context/VaultDataContext";
import {ADDRESS_ZERO} from "./apy-getter-functions/cap";
import * as RldVaultContract from "../resources/abis/RldTokenVault.json";
import * as RldEthVault from "../resources/abis/BeefyETHVault.json";
import {
  structuredMulticallFromCallInfo,
  transformMultiCallDataForTvl
} from "../contexts/vault-data-context/multicall-structured-result";
import {RldVault} from "./types/strategy-types";
import {getStrategyInputToken} from "./utils";

export class TvlGetter {
  constructor(private prices: Prices) {
  }

  getTvl = async (): Promise<number> => {
    if (Object.keys(this.prices).length > 0) {
      const vaultsData = await this.getVaultsData()
      return Object.keys(vaultsData)
        .reduce((acc: number, curr: string) => {
          const {
            vaultWantBalance,
            coinGeckoId,
            decimals,
            additionalData,
            name
          }: RldVault & VaultData = vaultsData[curr as Address] as RldVault & VaultData
          const price = this.prices[coinGeckoId]
          let vaultTvl = parseFloat(vaultWantBalance?.toString()) / (10 ** decimals)
          if (additionalData) {
            if (name === 'HOP-USDC' || name === 'HOP-USDT') {
              vaultTvl = parseFloat(formatUnits(additionalData.hopPoolBalance.mul(additionalData.hopVirtualPrice).div(BigNumber.from(10).pow(18)).div(BigNumber.from(10).pow(12)), 6));
            }
            if (name === 'HOP-ETH' || name === 'HOP-DAI') {
              vaultTvl = parseFloat(formatUnits(additionalData.hopPoolBalance.mul(additionalData.hopVirtualPrice).div(BigNumber.from(10).pow(18)), 18));
            }
          }
          const vaultTvlInDollars = vaultTvl * price
          return acc + vaultTvlInDollars
        }, 0 as number)
    } else {
      return 0
    }
  }

  // TODO don't we have a vaults data context that we can use here?
  // TODO IS THIS IN USE??
  getVaultsData = async (): Promise<VaultsData> => {
    const {
      erc20VaultCallData,
      ethVaultCallData
    } = this.getVaultMultiCallData(singleStakeStrategies)
    const erc20DVaultDataCalls = structuredMulticallFromCallInfo(erc20VaultCallData)
    const ethVaultDataCalls = structuredMulticallFromCallInfo(ethVaultCallData)

    return await Promise.all([erc20DVaultDataCalls, ethVaultDataCalls]).then(data => {
      const erc20VaultData = transformMultiCallDataForTvl(data[0], erc20Strategies)
      const ethVaultData = transformMultiCallDataForTvl(data[1], ethStrategies)
      return {
        ...ethVaultData,
        ...erc20VaultData
      }
    })
  }

  getMultiCallDataForErc20Vault = (strategy: RldVault) => {
    const vault = {
      abi: RldVaultContract.abi,
      address: strategy.vaultAddress,
    }

    const vaultWantBalance = {
      ...vault,
      functionName: 'balance',
    }

    const additionalCalls = getHopSpecificCalls(strategy)
    return [
      vaultWantBalance,
      ...additionalCalls
    ]
  }

  getMultiCallDataForEthVault = (strategy: RldVault) => {
    const vault = {
      abi: RldEthVault.abi,
      address: strategy.vaultAddress,
    }

    const vaultWantBalance = {
      ...vault,
      functionName: 'balance',
    }

    const additionalCalls = getHopSpecificCalls(strategy)
    return [
      vaultWantBalance,
      ...additionalCalls
    ]
  }


  getVaultMultiCallData = (strategies: RldVault[]) => {
    const erc20VaultCallData = strategies
      .filter(strategy => getStrategyInputToken(strategy) !== ADDRESS_ZERO)
      .map((strategy: RldVault) => {
        const calls = this.getMultiCallDataForErc20Vault(strategy)
        return {
          strategyAddress: strategy.strategyAddress,
          calls,
          tokenAddress: getStrategyInputToken(strategy),
        }
      })

    const ethVaultCallData = strategies
      .filter(strategy => getStrategyInputToken(strategy) === ADDRESS_ZERO)
      .map((strategy) => {
        const calls = this.getMultiCallDataForEthVault(strategy)
        return {
          strategyAddress: strategy.strategyAddress,
          calls,
          tokenAddress: getStrategyInputToken(strategy),
        }
      })

    return {
      erc20VaultCallData: erc20VaultCallData.reduce((acc, strategy) => {
        if (!acc.has(strategy.strategyAddress)) {
          acc.set(strategy.strategyAddress, []);
        }
        acc.set(strategy.strategyAddress, [...acc.get(strategy.strategyAddress)!, ...strategy.calls]);
        return acc;
      }, new Map<Address, any[]>()),
      ethVaultCallData: ethVaultCallData.reduce((acc, strategy) => {
        if (!acc.has(strategy.strategyAddress)) {
          acc.set(strategy.strategyAddress, []);
        }
        acc.set(strategy.strategyAddress, [...acc.get(strategy.strategyAddress)!, ...strategy.calls]);
        return acc;
      }, new Map<Address, any[]>()),
    }
  }
}
