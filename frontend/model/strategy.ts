export interface Strategy {
  id: number;
  name: string;
  address: string;
  vaultAddress: string;
  iconUrl: string;
  decimals: number;
  description: string;
  isActive: boolean;
  protocolUrl: string;
  apy: number;
  tokenUrl: string;
}


export const availableStrategies: Strategy[] = [{
  id: 0,
  name: "GMX",
  address: "0x123455",
  vaultAddress: "0x0123490234923423",
  iconUrl: "https://gmx.io/static/media/logo_GMX_small.f593fa5c.svg",
  description: "GMX Token is a governance token for the GMD protocol. It is used to vote on protocol changes and to earn rewards from the GMD protocol.",
  protocolUrl: "https://gmx.io/#/",
  apy: 13,
  tokenUrl: "https://app.uniswap.org/#/swap?inputCurrency=USDC&outputCurrency=0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a",
  decimals: 18,
  isActive: true
},
]
