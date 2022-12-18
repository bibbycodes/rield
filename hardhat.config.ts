import {HardhatUserConfig} from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";


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
    goerli: {
      url: process.env.GOERLI_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    hardhat: {
      accounts: {
        count: 20,
        accountsBalance: "10000000000000000000000", // 10ETH (Default)
      },
      allowUnlimitedContractSize: true
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
