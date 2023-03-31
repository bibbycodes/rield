import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import fs from "fs";
import { RldLpTokenVault } from '../../typechain-types';

async function main() {
  const [deployer]: SignerWithAddress[] =
    await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  //
  const Vault = await ethers.getContractFactory("RldLpTokenVault");
  const vault: RldLpTokenVault = (await Vault.deploy("RLD_HOP_USDT", "RLD_HOP_USDT")) as RldLpTokenVault;
  await vault.deployed();

  const hopPool = '0x9Dd8685463285aD5a94D2c128bda3c5e8a6173c8'
  const hopTracker = '0x18f7402B673Ba6Fb5EA4B95768aABb8aaD7ef18a'
  const rewardToken = '0xc5102fe9359fd9a28f877a67e36b0f050d81a3cc'
  const token = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'
  const hopToken = '0x12e59C59D282D2C00f3166915BED6DC2F5e2B5C7'
  const unirouter = '0xE592427A0AEce92De3Edee1F18E0157C05861564'

  const SingleStakeStrategy = await ethers.getContractFactory("HopPoolStrategy");
  const strategy = await SingleStakeStrategy.deploy(
    vault.address,
     hopPool,
     hopTracker,
     rewardToken, // HOP
     token, // USDC
     hopToken, // hUSDC
     unirouter
  );

  await strategy.deployed();
  await vault.initStrategy(strategy.address)

  console.log("Vault address:", vault.address);
  console.log("Strategy address:", strategy.address);

  fs.writeFileSync(
    "./resources/deploy_hop_usdt-output.json",
    JSON.stringify({
      vaultAddress: vault.address,
      deployerAddress: deployer.address,
      strategyAddress: strategy.address,
    })
  )
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
