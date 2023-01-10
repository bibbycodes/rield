import {Address} from "wagmi";
import * as capWethPool from "../../../resources/deploy_cap-output.json";
import * as capUsdcPool from "../../../resources/deploy_cap_usdc-output.json";
import {getCapAPY} from "../cap";

export class ApyGetter {
  constructor(private provider: any) {
  }
  
  async getApy(strategyAddress: Address) {
    switch (strategyAddress) {
      case capWethPool.strategyAddress:
        return getCapAPY('weth', this.provider)
      case capUsdcPool.strategyAddress:
        return getCapAPY('usdc', this.provider)
    }
  }
  
  async getApyForAllStrategies() {
    return {
      [capWethPool.strategyAddress]: await this.getApy(capWethPool.strategyAddress as Address),
      [capUsdcPool.strategyAddress]: await this.getApy(capUsdcPool.strategyAddress as Address),
    }
  }
}
