import * as cap from "../../resources/deploy_cap-output.json";
import * as gmx from '../../resources/deploy_gmx-output.json';
import {abi} from '../../artifacts/contracts/vaults/BeefyVaultV7.sol/BeefyVaultV7.json';
import {Address} from "wagmi";

export interface Strategy {
  id: number;
  name: string;
  tokenAddress: Address;
  vaultAddress: Address;
  strategyAddress: Address;
  iconUrl: string;
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
  {
    id: 0,
    name: "GMX",
    tokenSymbol: "GMX",
    tokenAddress: gmx.gmxTokenAddress as Address,
    vaultAddress: gmx.vaultAddress as Address,
    strategyAddress: gmx.strategyAddress as Address,
    iconUrl: "https://gmx.io/static/media/logo_GMX_small.f593fa5c.svg",
    description: "GMX Token is a governance token for the GMD protocol. It is used to vote on protocol changes and to earn rewards from the GMD protocol.",
    protocolUrl: "https://gmx.io/#/",
    apy: 13,
    tokenUrl: `https://app.uniswap.org/#/swap?inputCurrency=USDC&outputCurrency=${gmx.gmxTokenAddress}`,
    decimals: 18,
    isActive: true,
    abi: abi,
    coinGeckoId: "gmx",
    type: "Autocompound"
  },
  {
    id: 0,
    name: "Cap ETH",
    tokenSymbol: "ETH",
    tokenAddress: cap.ethToken as Address,
    vaultAddress: cap.vaultAddress as Address,
    strategyAddress: cap.strategyAddress as Address,
    iconUrl: "https://www.cap.finance/logos/CAP.svg",
    description: "Cap is a decentralized protocol that allows users to earn interest on their crypto assets. The protocol is designed to be as simple as possible, while still providing the best possible interest rates.",
    protocolUrl: "https://gmx.io/#/",
    apy: 13,
    tokenUrl: `https://app.uniswap.org/#/swap?inputCurrency=USDC&outputCurrency=${cap.ethToken}`,
    decimals: 18,
    isActive: true,
    abi: abi,
    coinGeckoId: "ethereum",
    type: "Autocompound"
  },
]
