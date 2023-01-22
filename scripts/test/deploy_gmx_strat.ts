import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Token = await ethers.getContractFactory("TokenMock");
  const gmxToken = await Token.deploy("GMX", "GMX", 18);
  await gmxToken.deployed();

  const ethToken = await Token.deploy("WETH", "WETH", 18);
  await ethToken.deployed();

  const UniSwapMock = await ethers.getContractFactory("UniswapV3RouterMock");
  const uniSwapMock = await UniSwapMock.deploy();
  await uniSwapMock.deployed();

  const GMXRouterMock = await ethers.getContractFactory("GMXRouterMock");
  const gmxRouterMock = await GMXRouterMock.deploy(gmxToken.address, ethToken.address);
  await gmxRouterMock.deployed();

  const Vault = await ethers.getContractFactory("BeefyVaultV7");
  const vault = await Vault.deploy();
  await vault.deployed();

  const commonAddresses = {
    vault: vault.address,
    unirouter: uniSwapMock.address,
    owner: deployer.address,
  }

  const Strategy = await ethers.getContractFactory("StrategyGMXUniV2");
  const strategy = await Strategy.deploy(
    gmxRouterMock.address,
    [ethToken.address, gmxToken.address],
    commonAddresses
  );
  await strategy.deployed();

  await vault.initialize(strategy.address, "GMX_AUTO_C", "GMX_AUTO_C")

  await gmxToken.mintFor(gmxRouterMock.address, ethers.utils.parseEther("1000000000"));

  await ethToken.mintFor(gmxRouterMock.address, ethers.utils.parseEther("1000000000"));

  await ethToken.mintFor(deployer.address, ethers.utils.parseEther("1000000000"));
  await gmxToken.mintFor(deployer.address, ethers.utils.parseEther("1000000000"));

  console.log("Vault Deployed to:", vault.address);
  console.log("GMX Deployed to:", gmxToken.address);
  console.log("UniSwap Deployed to:", uniSwapMock.address);
  console.log("GMXRouter Deployed to:", gmxRouterMock.address);
  console.log("Strategy Deployed to:", strategy.address);

  fs.writeFileSync(
    "./resources/deploy_gmx-output.json",
    JSON.stringify({
      vaultAddress: vault.address,
      gmxTokenAddress: gmxToken.address,
      uniSwapMockAddress: uniSwapMock.address,
      gmxRouterMockAddress: gmxRouterMock.address,
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
