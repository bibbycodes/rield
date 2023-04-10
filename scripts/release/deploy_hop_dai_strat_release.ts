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
  const vault: RldLpTokenVault = (await Vault.deploy("RLD_HOP_DAI", "RLD_HOP_DAI")) as RldLpTokenVault;
  await vault.deployed();

  const hopPool = '0xd4D28588ac1D9EF272aa29d4424e3E2A03789D1E'
  const hopTracker = '0xa5A33aB9063395A90CCbEa2D86a62EcCf27B5742'
  const rewardToken = '0xc5102fe9359fd9a28f877a67e36b0f050d81a3cc'
  const token = '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1'
  const hopToken = '0x46ae9BaB8CEA96610807a275EBD36f8e916b5C61'
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

  fs.writeFileSync(
    "./resources/deploy_hop_dai-output.json",
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
