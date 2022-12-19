import * as cap from "../../resources/deploy_cap-output.json";
import * as gmx from '../../resources/deploy_gmx-output.json';
import {abi} from '../../artifacts/contracts/vaults/BeefyVaultV7.sol/BeefyVaultV7.json';

export interface Strategy {
  id: number;
  name: string;
  tokenAddress: string;
  vaultAddress: string;
  iconUrl: string;
  decimals: number;
  description: string;
  isActive: boolean;
  protocolUrl: string;
  apy: number;
  tokenUrl: string;
  abi: any;
}


export const availableStrategies: Strategy[] = [
  {
    id: 0,
    name: "GMX",
    tokenAddress: gmx.gmxTokenAddress,
    vaultAddress: gmx.vaultAddress,
    iconUrl: "https://gmx.io/static/media/logo_GMX_small.f593fa5c.svg",
    description: "GMX Token is a governance token for the GMD protocol. It is used to vote on protocol changes and to earn rewards from the GMD protocol.",
    protocolUrl: "https://gmx.io/#/",
    apy: 13,
    tokenUrl: `https://app.uniswap.org/#/swap?inputCurrency=USDC&outputCurrency=${gmx.gmxTokenAddress}`,
    decimals: 18,
    isActive: true,
    abi: abi,
  },
  {
    id: 0,
    name: "Cap ETH",
    tokenAddress: cap.ethToken,
    vaultAddress: cap.vaultAddress,
    iconUrl: "https://www.cap.finance/logos/CAP.svg",
    description: "Cap is a decentralized protocol that allows users to earn interest on their crypto assets. The protocol is designed to be as simple as possible, while still providing the best possible interest rates.",
    protocolUrl: "https://gmx.io/#/",
    apy: 13,
    tokenUrl: `https://app.uniswap.org/#/swap?inputCurrency=USDC&outputCurrency=${cap.ethToken}`,
    decimals: 18,
    isActive: true,
    abi: abi,
  },
]
