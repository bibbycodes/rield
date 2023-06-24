import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();


const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    arbitrum: {
      url: process.env.GOERLI_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    goerli: {
      url: process.env.GOERLI_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    hardhat: {
      allowUnlimitedContractSize: true,
      accounts: {
        count: 20,
        accountsBalance: "10000000000000000000000", // 10ETH (Default)
      },
      forking: {
        url: `https://arbitrum-mainnet.infura.io/v3/10e715f1459940bd937fb457b795afed`
      },
    },
    localhost: {
      allowUnlimitedContractSize: true
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
