import {Address} from "wagmi";
import * as capWethPool from "../../resources/vault-details/deploy_cap_eth-output.json";
import * as capUsdcPool from "../../resources/vault-details/deploy_cap_usdc-output.json";
import * as gmx from "../../resources/vault-details/deploy_gmx-output.json";
import * as glp from "../../resources/vault-details/deploy_glp-output.json";
import * as gns from "../../resources/vault-details/deploy_gns-output.json";
import * as bfr from "../../resources/vault-details/deploy_bfr-output.json";
import {getCapApr} from "../apy-getter-functions/cap";
import {getGmxGlpApr} from "../apy-getter-functions/gmx";
import {Prices} from "../../contexts/TokenPricesContext";
import {getGainsApr} from "../apy-getter-functions/gains";
import { getBfrBlpApr } from '../apy-getter-functions/bfr';

export class ApyGetter {
  constructor(private provider: any, private prices: Prices) {

  }

  async getApy(strategyAddress: Address) {
    switch (strategyAddress) {
      case capUsdcPool.strategyAddress:
        return getCapApr('usdc', this.provider)
      case capWethPool.strategyAddress:
        return getCapApr('weth', this.provider)
      case gmx.strategyAddress:
        return getGmxGlpApr(this.provider, 'GMX', this.prices['ethereum'])
      case bfr.strategyAddress:
        return getBfrBlpApr(this.provider, 'BFR', this.prices['ibuffer-token'])
      case glp.strategyAddress:
        return getGmxGlpApr(this.provider, 'GLP', this.prices['ethereum'])
      case gns.strategyAddress:
        return getGainsApr()
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
      [gns.strategyAddress]: await this.getApy(gns.strategyAddress as Address),
      [bfr.strategyAddress]: await this.getApy(bfr.strategyAddress as Address),
    }
  }
}
