import * as capEth from "../resources/vault-details/deploy_cap_eth-output.json";
import * as capUSDC from "../resources/vault-details/deploy_cap_usdc-output.json";
import * as gmx from "../resources/vault-details/deploy_gmx-output.json";
import * as glp from "../resources/vault-details/deploy_glp-output.json";
import {abi} from '../resources/abis/RldTokenVault.json';
import {abi as ethVaultAbi} from '../resources/abis/BeefyETHVault.json';
import {Address} from "wagmi";
import crypto from 'crypto'

const randomAddress = () => {
  const randomBytes = crypto.randomBytes(20);
  return `0x${randomBytes.toString("hex")}`;
}

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
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
  status: 'ACTIVE' | 'DISABLED' | 'SOON';
  coolDownPeriod: number;
  protocolUrl: string;
  tokenUrl: string;
  abi: any;
  coinGeckoId: string;
  tokenSymbol: string;
  type: string;
  performanceFee: number
  hasWithdrawalSchedule?: boolean;
}

export const availableStrategies: Strategy[] = [
  {
    id: 2,
    name: "RLD-CAP-USDC",
    protocol: "Cap.finance",
    tokenSymbol: "USDC",
    tokenAddress: capUSDC.tokenAddress as Address,
    vaultAddress: capUSDC.vaultAddress as Address,
    strategyAddress: capUSDC.strategyAddress as Address,
    protocolLogoUrl: "/cap-logo.svg",
    tokenLogoUrl: "/usdc-logo.svg",
    description: "Cap is a decentralized protocol that allows users to earn interest on their crypto assets. The protocol is designed to be as simple as possible, while still providing the best possible interest rates.",
    protocolUrl: "https://www.cap.finance",
    tokenUrl: `https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=${capUSDC.tokenAddress}`,
    decimals: 6,
    status: 'ACTIVE',
    abi: abi,
    coinGeckoId: "usd-coin",
    type: "Auto Compound",
    performanceFee: 5,
    hasWithdrawalSchedule: true,
    coolDownPeriod: 3600000
  },
  {
    id: 3,
    name: "RLD-CAP-ETH",
    protocol: "Cap.finance",
    tokenSymbol: "ETH",
    tokenAddress: capEth.tokenAddress as Address,
    vaultAddress: capEth.vaultAddress as Address,
    strategyAddress: capEth.strategyAddress as Address,
    protocolLogoUrl: "/cap-logo.svg",
    tokenLogoUrl: "/eth-token.svg",
    description: "Cap is a decentralized protocol that allows users to earn interest on their crypto assets. The protocol is designed to be as simple as possible, while still providing the best possible interest rates.",
    protocolUrl: "https://www.cap.finance",
    tokenUrl: `https://app.uniswap.org/#/swap?inputCurrency=USDC&outputCurrency=eth`,
    decimals: 18,
    status: 'ACTIVE',
    abi: ethVaultAbi,
    coinGeckoId: "ethereum",
    type: "Auto Compound",
    performanceFee: 5,
    hasWithdrawalSchedule: true,
    coolDownPeriod: 3600000
  },
  {
    id: 0,
    name: "RLD-GMX",
    tokenSymbol: "GMX",
    tokenAddress: gmx.tokenAddress as Address,
    vaultAddress: gmx.vaultAddress as Address,
    protocol: "GMX.io",
    strategyAddress: gmx.strategyAddress as Address,
    protocolLogoUrl: "/gmx-logo.svg",
    tokenLogoUrl: "/gmx-logo.svg",
    description: "GMX Token is a governance token for the GMD protocol. It is used to vote on protocol changes and to earn rewards from the GMD protocol.",
    protocolUrl: "https://gmx.io/#/",
    tokenUrl: `https://app.gmx.io/#/buy_gmx`,
    decimals: 18,
    status: 'ACTIVE',
    abi: abi,
    coinGeckoId: "gmx",
    type: "Autocompound",
    performanceFee: 5,
    coolDownPeriod: 0
  },
  {
    id: 1,
    name: "RLD-GLP",
    tokenSymbol: "GLP",
    tokenAddress: glp.tokenAddress as Address,
    vaultAddress: glp.vaultAddress as Address,
    protocol: "GMX.io",
    strategyAddress: glp.strategyAddress as Address,
    protocolLogoUrl: "/gmx-logo.svg",
    tokenLogoUrl: "/glp-logo.svg",
    description: "GLP is an index token consisting of multiple blue-chip cryptos that is used as liquidity on GMX.",
    protocolUrl: "https://gmx.io/#/",
    tokenUrl: `https://app.gmx.io/#/buy_glp/`,
    decimals: 18,
    status: 'ACTIVE',
    abi: abi,
    coinGeckoId: "glp",
    type: "Autocompound",
    performanceFee: 5,
    coolDownPeriod: 0,
  },

  // {
  //   id: 0,
  //   name: "GNS",
  //   protocol: "Gains Network",
  //   tokenSymbol: "GNS",
  //   tokenAddress: randomAddress() as Address,
  //   vaultAddress: randomAddress() as Address,
  //   strategyAddress: randomAddress() as Address,
  //   protocolLogoUrl: "/gns-logo.png",
  //   tokenLogoUrl: "/gns-logo.png",
  //   description: "Cap is a decentralized protocol that allows users to earn interest on their crypto assets. The protocol is designed to be as simple as possible, while still providing the best possible interest rates.",
  //   protocolUrl: "https://gains.trade/",
  //   tokenUrl: `https://app.uniswap.org/#/swap?inputCurrency=USDC&outputCurrency=gns`,
  //   decimals: 18,
  //   status: 'SOON',
  //   abi: abi,
  //   coinGeckoId: "gns",
  //   type: "Auto Compound",
  //   performanceFee: 5,
  //   coolDownPeriod: 0
  // },
  // {
  //   id: 0,
  //   name: "GNS Dai",
  //   protocol: "Gains Network",
  //   tokenSymbol: "DAI",
  //   tokenAddress: randomAddress() as Address,
  //   vaultAddress: randomAddress() as Address,
  //   strategyAddress: randomAddress() as Address,
  //   protocolLogoUrl: "/gns-logo.png",
  //   tokenLogoUrl: "/dai-logo.png",
  //   description: "Cap is a decentralized protocol that allows users to earn interest on their crypto assets. The protocol is designed to be as simple as possible, while still providing the best possible interest rates.",
  //   protocolUrl: "https://gains.trade/",
  //   apy: 13,
  //   tokenUrl: `https://app.uniswap.org/#/swap?inputCurrency=USDC&outputCurrency=gns`,
  //   decimals: 18,
  //   isActive: false,
  //   abi: abi,
  //   coinGeckoId: "gns",
  //   type: "Auto Compound",
  //   performanceFee: 5
  // },
  // {
  //   id: 0,
  //   name: "BFR",
  //   protocol: "Buffer Finance",
  //   tokenSymbol: "BFR",
  //   tokenAddress: randomAddress() as Address,
  //   vaultAddress: randomAddress() as Address,
  //   strategyAddress: randomAddress() as Address,
  //   protocolLogoUrl: "/bfr-logo.png",
  //   tokenLogoUrl: "/bfr-logo.png",
  //   description: "Cap is a decentralized protocol that allows users to earn interest on their crypto assets. The protocol is designed to be as simple as possible, while still providing the best possible interest rates.",
  //   protocolUrl: "https://app.buffer.finance/ARBITRUM/earn",
  //   apy: 13,
  //   tokenUrl: `https://app.uniswap.org/#/swap?inputCurrency=USDC&outputCurrency=gns`,
  //   decimals: 18,
  //   isActive: false,
  //   abi: abi,
  //   coinGeckoId: "bfr",
  //   type: "Auto Compound",
  //   performanceFee: 5
  // },
]

