import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Vault = await ethers.getContractFactory("RldTokenVault");
  const vault = await Vault.deploy("RLD_YGI_GMX", "RLD_YGI_GMX");
  await vault.deployed();

  const gmxRewardRouter = '0xa906f338cb21815cbc4bc87ace9e68c87ef8d8f1'
  const ethToken = '0x82af49447d8a07e3bd95bd0d56f35241523fbab1'
  const gmxToken = '0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a'
  const unirouter = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
  const ygiVault = '0x5227db0d58ddA6d621104F5f08004B98792710c1'

  const commonAddresses = {
    vault: vault.address,
    unirouter,
    owner: deployer.address,
  }

  const Strategy = await ethers.getContractFactory("YgiStrategyGMXUniV3");
  const strategy = await Strategy.deploy(
    gmxRewardRouter,
    [ethToken, gmxToken],
    [3000],
    commonAddresses,
    ygiVault
  );
  await strategy.deployed();

  await vault.initStrategy(strategy.address)

  console.log("Vault Deployed to:", vault.address);
  console.log("Strategy Deployed to:", strategy.address);

  fs.writeFileSync(
    "./resources/deploy_gmx-output.json",
    JSON.stringify({
      vaultAddress: vault.address,
      gmxTokenAddress: gmxToken,
      uniSwapMockAddress: unirouter,
      gmxRouterMockAddress: gmxRewardRouter,
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
