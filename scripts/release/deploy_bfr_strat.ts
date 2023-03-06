import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Vault = await ethers.getContractFactory("RldTokenVault");
  const vault = await Vault.deploy();
  await vault.deployed();

  const bfrRewardRouter = '0xbD5FBB3b2610d34434E316e1BABb9c3751567B67'
  const usdcToken = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'
  const bfrToken = '0x1A5B0aaF478bf1FDA7b934c76E7692D722982a6D'
  const unirouter = '0xE592427A0AEce92De3Edee1F18E0157C05861564'

  const commonAddresses = {
    vault: vault.address,
    unirouter,
    owner: deployer.address,
  }

  const Strategy = await ethers.getContractFactory("StrategyBFRUniV3");
  const strategy = await Strategy.deploy(
    bfrRewardRouter,
    [usdcToken, bfrToken],
    [10000],
    commonAddresses
  );
  await strategy.deployed();

  await vault.initialize(strategy.address, "RLD_BFR_BFR", "RLD_BFR_BFR")

  console.log("Vault Deployed to:", vault.address);
  console.log("Strategy Deployed to:", strategy.address);

  fs.writeFileSync(
    "./resources/deploy_gmx-output.json",
    JSON.stringify({
      vaultAddress: vault.address,
      gmxTokenAddress: bfrToken,
      uniSwapMockAddress: unirouter,
      gmxRouterMockAddress: bfrRewardRouter,
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
