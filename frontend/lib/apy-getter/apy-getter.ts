import {Address} from "wagmi";
import * as capWethPool from "../../resources/vault-details/deploy_cap_eth-output.json";
import * as capUsdcPool from "../../resources/vault-details/deploy_cap_usdc-output.json";
import * as gmx from "../../resources/vault-details/deploy_gmx-output.json";
import * as glp from "../../resources/vault-details/deploy_glp-output.json";
import {getCapAPY} from "../apy-getter-functions/cap";
import {getGmxGlpApr} from "../apy-getter-functions/gmx";
import {CoinGeckoPrices} from "../../contexts/TokenPricesContext";

export class ApyGetter {
  constructor(private provider: any, private prices: CoinGeckoPrices) {

  }

  async getApy(strategyAddress: Address) {
    switch (strategyAddress) {
      case capUsdcPool.strategyAddress:
        return getCapAPY('usdc', this.provider)
      case capWethPool.strategyAddress:
        return getCapAPY('weth', this.provider)
      case gmx.strategyAddress:
        return getGmxGlpApr(this.provider, this.prices['ethereum'], 'GMX')
      case glp.strategyAddress:
        return getGmxGlpApr(this.provider, this.prices['ethereum'], 'GLP')
      default:
        return 0
    }
  }

  async getApyForAllStrategies() {
    return {
      [capWethPool.strategyAddress]: await this.getApy(capWethPool.strategyAddress as Address),
      [capUsdcPool.strategyAddress]: await this.getApy(capUsdcPool.strategyAddress as Address),
      [gmx.strategyAddress]: await this.getApy(gmx.strategyAddress as Address),
      [glp.strategyAddress]: await this.getApy(glp.strategyAddress as Address),
    }
  }
}
