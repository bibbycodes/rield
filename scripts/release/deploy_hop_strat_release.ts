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
  const vault: RldLpTokenVault = (await Vault.deploy("RLD_HOP_USDC", "RLD_HOP_USDC")) as RldLpTokenVault;
  await vault.deployed();

  const hopPool = '0xb0CabFE930642AD3E7DECdc741884d8C3F7EbC70'
  const hopTracker = '0x10541b07d8ad2647dc6cd67abd4c03575dade261'
  const rewardToken = '0xc5102fe9359fd9a28f877a67e36b0f050d81a3cc'
  const token = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'
  const hopToken = '0x0ce6c85cF43553DE10FC56cecA0aef6Ff0DD444d'
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

  // "ethToken":  "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8"
  fs.writeFileSync(
    "./resources/deploy_cap_usdc-output.json",
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
