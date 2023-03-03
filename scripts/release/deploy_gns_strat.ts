import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Vault = await ethers.getContractFactory("RldTokenVault");
  const vault = await Vault.deploy();
  await vault.deployed();

  const gnsStakingProxy = '0x6B8D3C08072a020aC065c467ce922e3A36D3F9d6'
  const daiToken = '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'
  const gnsToken = '0x18c11fd286c5ec11c3b683caa813b77f5163a122'
  const unirouter = '0xe592427a0aece92de3edee1f18e0157c05861564'

  const commonAddresses = {
    vault: vault.address,
    unirouter,
    owner: deployer.address,
  }

  const Strategy = await ethers.getContractFactory("StrategyGNS");
  const strategy = await Strategy.deploy(
    gnsStakingProxy,
    [daiToken, gnsToken],
    [3000],
    commonAddresses
  );
  await strategy.deployed();

  await vault.initialize(strategy.address, "RLD_GNS", "RLD_GNS")

  console.log("Vault Deployed to:", vault.address);
  console.log("Strategy Deployed to:", strategy.address);

  fs.writeFileSync(
    "./resources/deploy_gns-output.json",
    JSON.stringify({
      vaultAddress: vault.address,
      gmxTokenAddress: gnsToken,
      uniSwapMockAddress: unirouter,
      gmxRouterMockAddress: gnsStakingProxy,
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
