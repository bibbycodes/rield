import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Vault = await ethers.getContractFactory("RldTokenVault");
  const vault = await Vault.deploy();
  await vault.deployed();

  const Strategy = await ethers.getContractFactory("StrategyGLP");
  let glpTokenAddress = '0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf';
  let wethTokenAddress = '0x82af49447d8a07e3bd95bd0d56f35241523fbab1';
  const strategy = await Strategy.deploy(
    glpTokenAddress,
    wethTokenAddress,
    '0xb95db5b167d75e6d04227cfffa61069348d271f5',
    '0xA906F338CB21815cBc4Bc87ace9e68c87eF8d8F1',
    vault.address
  );
  await strategy.deployed();

  await vault.initialize(strategy.address, "RLD_GMX_GLP", "RLD_GMX_GLP")

  console.log("Vault Deployed to:", vault.address);
  console.log("Strategy Deployed to:", strategy.address);

  fs.writeFileSync(
    "./resources/deploy_gmx-output.json",
    JSON.stringify({
      vaultAddress: vault.address,
      glpTokenAddress,
      deployerAddress: deployer.address,
      strategyAddress: strategy.address,
    })
  )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
