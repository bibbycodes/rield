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
  const masterVault: YgiPoolStrategy = (await MasterVault.deploy(
    usdcToken,
    unirouter,
    wethTokenAddress
  )) as YgiPoolStrategy;
  await masterVault.deployed();

  console.log("YGI Vault Deployed to:", masterVault.address);

  // ---------------------------------- GNS --------------------------------
  const GnsVault = await ethers.getContractFactory("RldYgiTokenVault");
  const gnsVault = await GnsVault.deploy("RLD_YGI_GNS", "RLD_YGI_GNS", masterVault.address);
  await gnsVault.deployed();

  const gnsStakingProxy = '0x6B8D3C08072a020aC065c467ce922e3A36D3F9d6'
  const daiToken = '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'
  const gnsToken = '0x18c11fd286c5ec11c3b683caa813b77f5163a122'

  const commonAddresses = {
    vault: gnsVault.address,
    unirouter,
    owner: deployer.address,
  }

  const GnsStrategy = await ethers.getContractFactory("StrategyGNS");
  const gnsStrategy = await GnsStrategy.deploy(
      gnsStakingProxy,
      [daiToken, gnsToken],
      [10000],
      commonAddresses
  );
  await gnsStrategy.deployed();

  await gnsVault.initStrategy(gnsStrategy.address)

  console.log("GNS Vault Deployed to:", gnsVault.address);
  console.log("GNS Strategy Deployed to:", gnsStrategy.address);


  // ---------------------------------- GMX --------------------------------
  const GmxVault = await ethers.getContractFactory("RldYgiTokenVault");
  const gmxVault = await GmxVault.deploy("RLD_YGI_GMX", "RLD_YGI_GMX", masterVault.address);
  await gmxVault.deployed();

  const gmxRewardRouter = '0xa906f338cb21815cbc4bc87ace9e68c87ef8d8f1'
  const ethToken = '0x82af49447d8a07e3bd95bd0d56f35241523fbab1'
  const gmxToken = '0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a'

  const gmxCommonAddresses = {
    vault: gmxVault.address,
    unirouter,
    owner: deployer.address,
  }

  const GmxStrategy = await ethers.getContractFactory("StrategyGMXUniV3");
  const gmxStrategy = await GmxStrategy.deploy(
      gmxRewardRouter,
      [ethToken, gmxToken],
      [3000],
      gmxCommonAddresses
  );
  await gmxStrategy.deployed();

  await gmxVault.initStrategy(gmxStrategy.address)

  console.log("GmxVault Deployed to:", gmxVault.address);
  console.log("Strategy Deployed to:", gmxStrategy.address);

  await masterVault.registerYgiComponent(
      gmxToken,
      gmxVault.address,
      ethers.utils.parseEther('50'),
      [usdcToken, ethToken, gmxToken],
      [3000, 500],
      [gmxToken, ethToken, usdcToken],
      [3000, 3000],
      [],
      []
  );

  await masterVault.registerYgiComponent(
      gnsToken,
      gnsVault.address,
      ethers.utils.parseEther('50'),
      [usdcToken, gnsToken],
      [3000],
      [gnsToken, usdcToken],
      [3000],
      [],
      []
  );

  // fs.writeFileSync(
  //   "./resources/deploy_mastervault-output.json",
  //   JSON.stringify({
  //     vaultAddress: vault.address,
  //     uniSwapMockAddress: unirouter,
  //     deployerAddress: deployer.address,
  //   })
  // )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
