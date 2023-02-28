import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import fs from "fs";
import { RldEthVault } from "../../typechain-types";

async function main() {
  const [deployer]: SignerWithAddress[] =
    await ethers.getSigners();
  const Vault = await ethers.getContractFactory("RldEthVault");
  const vault: RldEthVault = (await Vault.deploy()) as RldEthVault;
  await vault.deployed();

  const SingleStakeStrategy = await ethers.getContractFactory("CapEthPoolStrategy");
  const strategy = await SingleStakeStrategy.deploy(
    vault.address,
    '0xE0cCd451BB57851c1B2172c07d8b4A7c6952a54e', // capETHPool
    '0x29163356bBAF0a3bfeE9BA5a52a5C6463114Cb5f', // capETHRewards
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
