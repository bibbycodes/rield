import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Vault = await ethers.getContractFactory("RldTokenVault");
  const vault = await Vault.deploy('RLD_BFR', 'RLD_BFR');
  await vault.deployed();

  const bfrRewardRouter = '0xbD5FBB3b2610d34434E316e1BABb9c3751567B67'
  const usdcToken = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'
  const bfrToken = '0x1A5B0aaF478bf1FDA7b934c76E7692D722982a6D'
  const unirouter = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
  const arbToken = '0x912CE59144191C1204E64559FE8253a0e49E6548'
  const wethToken = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'

  const Strategy = await ethers.getContractFactory("StrategyBFR");
  const strategy = await Strategy.deploy(
    bfrRewardRouter,
    vault.address,
    unirouter,
    bfrToken,
    arbToken,
    usdcToken,
    wethToken
  );
  await strategy.deployed();

  await vault.initStrategy(strategy.address)

  console.log("Vault Deployed to:", vault.address);
  console.log("Strategy Deployed to:", strategy.address);

  fs.writeFileSync(
    "./resources/deploy_bfr-output.json",
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
