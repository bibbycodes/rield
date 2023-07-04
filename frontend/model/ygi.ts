import { abi } from '../resources/abis/YgiPoolStrategy.json';
import * as perpetualYgi from "../resources/vault-details/deploy_ygi_perps-output.json";
import { Address } from "wagmi";

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export interface Ygi {
  components: YgiComponent[];
  name: string;
  tokenSymbol: string,
  tokenAddress: Address;
  vaultAddress: Address;
  tokenLogoUrl: string;
  ygiLogoUrl: string;
  decimals: number;
  status: 'ACTIVE' | 'DISABLED' | 'SOON' | 'HIDDEN';
  abi: any;
}

export interface YgiComponent {
  inputToken: string;
  tokenLogoUrl: string;
  color: string;
  allocation: number;
  vaultAddress: Address;
  strategyAddress: Address;
}

export const ygis: Ygi[] = [
  {
    name: "Perpetuals",
    components: [{
      inputToken: "GMX",
      tokenLogoUrl: "/gmx-logo.svg",
      color: '#2d42fc',
      allocation: 100,
      vaultAddress: perpetualYgi.ygiComponents[0].vault as Address,
      strategyAddress: perpetualYgi.ygiComponents[0].strategy as Address,
    },
   {
      inputToken: "GNS",
      tokenLogoUrl: "/gns-logo.png",
      color: '#42f1a2',
      allocation: 100,
     vaultAddress: perpetualYgi.ygiComponents[1].vault as Address,
     strategyAddress: perpetualYgi.ygiComponents[1].strategy as Address,
    } ],
    tokenSymbol: "USDC",
    tokenAddress: perpetualYgi.tokenAddress as Address,
    vaultAddress: perpetualYgi.vaultAddress as Address,
    tokenLogoUrl: "/usdc-logo.svg",
    ygiLogoUrl: "/cap-logo.svg",
    decimals: 6,
    status: 'ACTIVE',
    abi: abi,
  },
]
ygis.reverse()

