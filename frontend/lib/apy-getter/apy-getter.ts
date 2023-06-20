import {Address} from "wagmi";
import * as capWethPool from "../../resources/vault-details/deploy_cap_eth-output.json";
import * as capUsdcPool from "../../resources/vault-details/deploy_cap_usdc-output.json";
import * as gmx from "../../resources/vault-details/deploy_gmx-output.json";
import * as glp from "../../resources/vault-details/deploy_glp-output.json";
import * as gns from "../../resources/vault-details/deploy_gns-output.json";
import * as bfr from "../../resources/vault-details/deploy_bfr-output.json";
import * as hopUsdc from "../../resources/vault-details/deploy_hop_usdc-output.json";
import * as hopUsdt from "../../resources/vault-details/deploy_hop_usdt-output.json";
import * as hopDai from "../../resources/vault-details/deploy_hop_dai-output.json";
import * as hopEth from "../../resources/vault-details/deploy_hop_eth-output.json";
import * as ramArbUsdc from "../../resources/vault-details/deploy_ram_arb_usdc-output.json";
import {getCapApr} from "../apy-getter-functions/cap";
import {getGmxGlpApr} from "../apy-getter-functions/gmx";
import {Prices} from "../../contexts/TokenPricesContext";
import {getGainsApr} from "../apy-getter-functions/gains";
import {getBfrBlpApr} from '../apy-getter-functions/bfr';
import {getHopApr} from '../apy-getter-functions/hop';
import {getSolidlyApr} from "../apy-getter-functions/ram";

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
      case hopUsdc.strategyAddress:
        return getHopApr('USDC', this.prices['hop-protocol'], this.prices['usd-coin'], hopUsdc as any)
      case hopUsdt.strategyAddress:
        return getHopApr('USDT', this.prices['hop-protocol'], this.prices['tether'], hopUsdt as any)
      case hopEth.strategyAddress:
        return getHopApr('ETH', this.prices['hop-protocol'], this.prices['ethereum'], hopEth as any)
      case hopDai.strategyAddress:
        return getHopApr('DAI', this.prices['hop-protocol'], this.prices['dai'], hopDai as any)
      case ramArbUsdc.strategyAddress:
        return getSolidlyApr(this.provider, this.prices['arbitrum'], this.prices['usd-coin'], this.prices['solidlizard'], ramArbUsdc as any)
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
      [hopUsdc.strategyAddress]: await this.getApy(hopUsdc.strategyAddress as Address),
      [hopUsdt.strategyAddress]: await this.getApy(hopUsdt.strategyAddress as Address),
      [hopEth.strategyAddress]: await this.getApy(hopEth.strategyAddress as Address),
      [hopDai.strategyAddress]: await this.getApy(hopDai.strategyAddress as Address),
      [ramArbUsdc.strategyAddress]: await this.getApy(ramArbUsdc.strategyAddress as Address),
    }
  }
}
