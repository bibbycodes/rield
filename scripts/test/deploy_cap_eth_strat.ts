import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { BeefyETHVault, CapETHPoolMock, CapETHRewardsMock, TokenMock } from "../../typechain-types";
import { BigNumber } from "ethers";
import { parseEther } from "ethers/lib/utils";
import fs from "fs";

const ONE_ETHER: BigNumber = parseEther("1");
const TEN_ETHER: BigNumber = parseEther("10");
const ONE_THOUSAND_ETH: BigNumber = parseEther("1000");

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
  await vault.initialize(strategy.address, "CAP_ETH_COMP", "CAP_ETH_COMP")
  // await ethToken.mintFor(capRewardsMock.address, ONE_THOUSAND_ETH);
  // await ethToken.mintFor(deployer.address, ONE_THOUSAND_ETH);

  console.log("Vault address:", vault.address);
  console.log("Strategy address:", strategy.address);
  console.log("CapPoolMock address:", capPoolMock.address);
  console.log("CapRewardsMock address:", capRewardsMock.address);


  fs.writeFileSync(
    "./resources/deploy_cap-output.json",
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
