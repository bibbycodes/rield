import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import fs from "fs";
import { RldEthLpTokenVault } from '../../typechain-types';

async function main() {
  const [deployer]: SignerWithAddress[] =
    await ethers.getSigners();

  const hopPool = '0x755569159598f3702bdD7DFF6233A317C156d3Dd'
  const hopTracker = '0x652d27c0F72771Ce5C76fd400edD61B406Ac6D97'
  const rewardToken = '0xc5102fe9359fd9a28f877a67e36b0f050d81a3cc'
  const token = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
  const hopToken = '0xDa7c0de432a9346bB6e96aC74e3B61A36d8a77eB'
  const unirouter = '0xE592427A0AEce92De3Edee1F18E0157C05861564'

  console.log("Deploying contracts with the account:", deployer.address);
  //
  const Vault = await ethers.getContractFactory("RldEthLpTokenVault");
  const vault: RldEthLpTokenVault = (await Vault.deploy("RLD_HOP_ETH", "RLD_HOP_ETH")) as RldEthLpTokenVault;
  await vault.deployed();

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
    "./resources/deploy_cap_eth-output.json",
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
