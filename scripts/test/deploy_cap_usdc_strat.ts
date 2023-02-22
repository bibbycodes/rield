import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ethers} from "hardhat";
import {RldTokenVault, CapPoolMock, CapRewardsMock, TokenMock} from "../../typechain-types";
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

  const Token = await ethers.getContractFactory("TokenMock");
  const usdcToken = await Token.deploy("USDC", "USDC", 6);
  await usdcToken.deployed();

  const CapRewardsMock = await ethers.getContractFactory("CapRewardsMock");
  const capRewardsMock: CapRewardsMock = (await CapRewardsMock.deploy(usdcToken.address)) as CapRewardsMock;
  await capRewardsMock.deployed();

  const CapPoolMock = await ethers.getContractFactory("CapPoolMock");
  const capPoolMock: CapPoolMock = (await CapPoolMock.deploy(usdcToken.address, capRewardsMock.address)) as CapPoolMock;
  await capPoolMock.deployed();
  await capRewardsMock.init(capPoolMock.address);

  const Vault = await ethers.getContractFactory("RldTokenVault");
  const vault: RldTokenVault = (await Vault.deploy()) as RldTokenVault;
  await vault.deployed();

  const SingleStakeStrategy = await ethers.getContractFactory("CapSingleStakeStrategy");
  const strategy = await SingleStakeStrategy.deploy(
    vault.address,
    capPoolMock.address,
    capRewardsMock.address,
    usdcToken.address,
  );

  await strategy.deployed();
  await vault.initialize(strategy.address, "CAP_ETH_COMP", "CAP_ETH_COMP")
  await usdcToken.mintFor(capRewardsMock.address, ONE_THOUSAND_ETH);
  await usdcToken.mintFor(deployer.address, ONE_THOUSAND_ETH);

  console.log("Vault address:", vault.address);
  console.log("Strategy address:", strategy.address);
  console.log("CapPoolMock address:", capPoolMock.address);
  console.log("CapRewardsMock address:", capRewardsMock.address);
  console.log("USDC address:", usdcToken.address);


  fs.writeFileSync(
    "./resources/deploy_cap_usdc-output.json",
    JSON.stringify({
      vaultAddress: vault.address,
      ethToken: usdcToken.address,
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
