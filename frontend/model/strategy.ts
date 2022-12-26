import * as cap from "../../resources/deploy_cap-output.json";
import * as gmx from '../../resources/deploy_gmx-output.json';
import {abi} from '../../artifacts/contracts/vaults/BeefyVaultV7.sol/BeefyVaultV7.json';
import {Address} from "wagmi";
import {ADDRESS_ZERO, fetchCapPoolStats, getCapAPY} from "../lib/cap";

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
}

export const availableStrategies: Strategy[] = [
  // {
  //   id: 0,
  //   name: "GMX",
  //   tokenSymbol: "GMX",
  //   tokenAddress: gmx.gmxTokenAddress as Address,
  //   vaultAddress: gmx.vaultAddress as Address,
  //   protocol: "GMX.io",
  //   strategyAddress: gmx.strategyAddress as Address,
  //   protocolLogoUrl: "https://gmx.io/static/media/logo_GMX_small.f593fa5c.svg",
  //   tokenLogoUrl: "https://gmx.io/static/media/logo_GMX_small.f593fa5c.svg",
  //   description: "GMX Token is a governance token for the GMD protocol. It is used to vote on protocol changes and to earn rewards from the GMD protocol.",
  //   protocolUrl: "https://gmx.io/#/",
  //   apy: 13,
  //   tokenUrl: `https://app.uniswap.org/#/swap?inputCurrency=USDC&outputCurrency=${gmx.gmxTokenAddress}`,
  //   decimals: 18,
  //   isActive: true,
  //   abi: abi,
  //   coinGeckoId: "gmx",
  //   type: "Autocompound"
  // },
  {
    id: 0,
    name: "Cap ETH",
    protocol: "Cap.finance",
    tokenSymbol: "ETH",
    tokenAddress: cap.ethToken as Address,
    vaultAddress: cap.vaultAddress as Address,
    strategyAddress: cap.strategyAddress as Address,
    protocolLogoUrl: "https://www.cap.finance/logos/CAP.svg",
    tokenLogoUrl: "https://www.cap.finance/logos/ETH.svg",
    description: "Cap is a decentralized protocol that allows users to earn interest on their crypto assets. The protocol is designed to be as simple as possible, while still providing the best possible interest rates.",
    protocolUrl: "https://www.cap.finance",
    apy: 13,
    tokenUrl: `https://app.uniswap.org/#/swap?inputCurrency=USDC&outputCurrency=${cap.ethToken}`,
    decimals: 18,
    isActive: true,
    abi: abi,
    coinGeckoId: "ethereum",
    type: "Autocompound"
  },
]
