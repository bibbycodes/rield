import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ethers} from "hardhat";
import {BeefyVaultV7} from "../typechain-types";
import {BigNumber} from "ethers";
import {parseEther} from "ethers/lib/utils";
import fs from "fs";

const ONE_ETHER: BigNumber = parseEther("1");
const TEN_ETHER: BigNumber = parseEther("10");
const ONE_THOUSAND_ETH: BigNumber = parseEther("1000");

async function main() {
  const [deployer]: SignerWithAddress[] =
    await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  //
  const Vault = await ethers.getContractFactory("BeefyVaultV7");
  const vault: BeefyVaultV7 = (await Vault.deploy()) as BeefyVaultV7;
  await vault.deployed();

  const SingleStakeStrategy = await ethers.getContractFactory("CapSingleStakeStrategy");
  const strategy = await SingleStakeStrategy.deploy(
    vault.address,
    '0x958cc92297e6F087f41A86125BA8E121F0FbEcF2', // capUsdcPool
    '0x10f2f3B550d98b6E51461a83AD3FE27123391029', // capUsdcRewards
    '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', // usdcToken
  );

  await strategy.deployed();
  await vault.initialize(strategy.address, "RLD_CAP_ETH", "RLD_CAP_ETH")

  console.log("Vault address:", vault.address);
  console.log("Strategy address:", strategy.address);

  fs.writeFileSync(
    "./resources/deploy_cap-output.json",
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
