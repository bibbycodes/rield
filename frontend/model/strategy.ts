import * as capEth from "../resources/vault-details/deploy_cap_eth-output.json";
import * as capUSDC from "../resources/vault-details/deploy_cap_usdc-output.json";
import * as gmx from "../resources/vault-details/deploy_gmx-output.json";
import * as glp from "../resources/vault-details/deploy_glp-output.json";
import {abi} from '../../artifacts/contracts/vaults/BeefyVaultV7.sol/BeefyVaultV7.json';
import {Address} from "wagmi";

export interface Strategy {
  id: number;
  name: string;
  protocol: string;
  tokenAddress: Address;
  vaultAddress: Address;
  strategyAddress: Address;
  protocolLogoUrl: string;
  tokenLogoUrl: string;
  decimals: number;
  description: string;
  isActive: boolean;
  protocolUrl: string;
  apy: number;
  tokenUrl: string;
  abi: any;
  coinGeckoId: string;
  tokenSymbol: string;
  type: string;
  performanceFee: number
}

export const availableStrategies: Strategy[] = [
  {
    id: 0,
    name: "GMX",
    tokenSymbol: "GMX",
    tokenAddress: gmx.tokenAddress as Address,
    vaultAddress: gmx.vaultAddress as Address,
    protocol: "GMX.io",
    strategyAddress: gmx.strategyAddress as Address,
    protocolLogoUrl: "https://gmx.io/static/media/logo_GMX_small.f593fa5c.svg",
    tokenLogoUrl: "https://gmx.io/static/media/logo_GMX_small.f593fa5c.svg",
    description: "GMX Token is a governance token for the GMD protocol. It is used to vote on protocol changes and to earn rewards from the GMD protocol.",
    protocolUrl: "https://gmx.io/#/",
    apy: 13,
    tokenUrl: `https://app.uniswap.org/#/swap?inputCurrency=USDC&outputCurrency=${gmx.tokenAddress}`,
    decimals: 18,
    isActive: true,
    abi: abi,
    coinGeckoId: "gmx",
    type: "Autocompound",
    performanceFee: 5
  },
  // {
  //   id: 0,
  //   name: "GLP",
  //   tokenSymbol: "GLP",
  //   tokenAddress: glp.tokenAddress as Address,
  //   vaultAddress: glp.vaultAddress as Address,
  //   protocol: "GMX.io",
  //   strategyAddress: glp.strategyAddress as Address,
  //   protocolLogoUrl: "https://gmx.io/static/media/logo_GMX_small.f593fa5c.svg",
  //   tokenLogoUrl: "https://raw.githubusercontent.com/gmx-io/gmx-assets/612382a974a803ff775754b1c445250f4b687f47/GMX-Assets/SVG/GLP_LOGO%20ONLY.svg",
  //   description: "GLP is an index token consisting of multiple blue-chip cryptos that is used as liquidity on GMX.",
  //   protocolUrl: "https://gmx.io/#/",
  //   apy: 13,
  //   tokenUrl: `https://app.gmx.io/#/buy_glp/`,
  //   decimals: 18,
  //   isActive: true,
  //   abi: abi,
  //   coinGeckoId: "glp",
  //   type: "Autocompound",
  //   performanceFee: 5
  // },  
  // {
  //   id: 0,
  //   name: "Cap ETH",
  //   protocol: "Cap.finance",
  //   tokenSymbol: "ETH",
  //   tokenAddress: capEth.tokenAddress as Address,
  //   vaultAddress: capEth.vaultAddress as Address,
  //   strategyAddress: capEth.strategyAddress as Address,
  //   protocolLogoUrl: "https://v3.cap.finance/logos/CAP.svg",
  //   tokenLogoUrl: "https://v3.cap.finance/logos/ETH.svg",
  //   description: "Cap is a decentralized protocol that allows users to earn interest on their crypto assets. The protocol is designed to be as simple as possible, while still providing the best possible interest rates.",
  //   protocolUrl: "https://www.cap.finance",
  //   apy: 13,
  //   tokenUrl: `https://app.uniswap.org/#/swap?inputCurrency=USDC&outputCurrency=eth`,
  //   decimals: 18,
  //   isActive: true,
  //   abi: abi,
  //   coinGeckoId: "ethereum",
  //   type: "Auto Compound",
  //   performanceFee: 5
  // },
  {
    id: 1,
    name: "Cap USDC",
    protocol: "Cap.finance",
    tokenSymbol: "USDC",
    tokenAddress: capUSDC.tokenAddress as Address,
    vaultAddress: capUSDC.vaultAddress as Address,
    strategyAddress: capUSDC.strategyAddress as Address,
    protocolLogoUrl: "https://v3.cap.finance/logos/CAP.svg",
    tokenLogoUrl: "https://v3.cap.finance/logos/USDC.svg",
    description: "Cap is a decentralized protocol that allows users to earn interest on their crypto assets. The protocol is designed to be as simple as possible, while still providing the best possible interest rates.",
    protocolUrl: "https://www.cap.finance",
    apy: 13,
    tokenUrl: `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${capUSDC.tokenAddress}`,
    decimals: 6,
    isActive: true,
    abi: abi,
    coinGeckoId: "usd-coin",
    type: "Auto Compound",
    performanceFee: 5
  },
]
