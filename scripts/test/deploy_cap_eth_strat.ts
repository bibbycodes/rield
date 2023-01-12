import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ethers} from "hardhat";
import {BeefyETHVault, CapETHPoolMock, CapETHRewardsMock} from "../../typechain-types";
import fs from "fs";

async function main() {
  const [deployer]: SignerWithAddress[] =
    await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const CapETHRewardsMock = await ethers.getContractFactory("CapETHRewardsMock");
  const capRewardsMock: CapETHRewardsMock = (await CapETHRewardsMock.deploy()) as CapETHRewardsMock;
  await capRewardsMock.deployed();

  const CapETHPoolMock = await ethers.getContractFactory("CapETHPoolMock");
  const capPoolMock: CapETHPoolMock = (await CapETHPoolMock.deploy(capRewardsMock.address)) as CapETHPoolMock;
  await capPoolMock.deployed();
  await capRewardsMock.init(capPoolMock.address);

  await deployer.sendTransaction({
    to: capRewardsMock.address,
    value: ethers.utils.parseEther("5.0"), // Sends exactly 1.0 ether
  });

  const Vault = await ethers.getContractFactory("BeefyETHVault");
  const vault: BeefyETHVault = (await Vault.deploy()) as BeefyETHVault;
  await vault.deployed();

  const SingleStakeStrategy = await ethers.getContractFactory("CapSingleStakeStrategyETH");
  const strategy = await SingleStakeStrategy.deploy(
    vault.address,
    capPoolMock.address,
    capRewardsMock.address
  );

  await strategy.deployed();
  await vault.initialize(strategy.address, "RLD_CAP_ETH", "RLD_CAP_ETH")

  console.log("Vault address:", vault.address);
  console.log("Strategy address:", strategy.address);
  console.log("CapPoolMock address:", capPoolMock.address);
  console.log("CapRewardsMock address:", capRewardsMock.address);

  fs.writeFileSync(
    "./resources/deploy_cap_eth-output.json",
    JSON.stringify({
      vaultAddress: vault.address,
      capPoolMock: capPoolMock.address,
      capRewardsMock: capPoolMock.address,
      deployerAddress: deployer.address,
      strategyAddress: strategy.address,
    })
  )
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
