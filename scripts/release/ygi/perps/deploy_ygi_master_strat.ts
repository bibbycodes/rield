import { ethers } from "hardhat";
import * as fs from "fs";
import { YgiPoolStrategy } from "../../../../typechain-types";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  const usdcToken = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'
  const unirouter = '0xe592427a0aece92de3edee1f18e0157c05861564'
  const wethTokenAddress = '0x82af49447d8a07e3bd95bd0d56f35241523fbab1';

  const MasterVault = await ethers.getContractFactory("YgiPoolStrategy");
  const vault: YgiPoolStrategy = (await MasterVault.deploy(
    usdcToken,
    unirouter,
    wethTokenAddress
  )) as YgiPoolStrategy;
  await vault.deployed();

  console.log("Vault Deployed to:", vault.address);

  fs.writeFileSync(
    "./resources/deploy_mastervault-output.json",
    JSON.stringify({
      vaultAddress: vault.address,
      uniSwapMockAddress: unirouter,
      deployerAddress: deployer.address,
    })
  )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
