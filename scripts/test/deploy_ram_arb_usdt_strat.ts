import {ethers} from "hardhat";
import {
  MockSolidlyRouter,
  RLDSolidlyLpVault,
  SolidlyLpStrat,
  SolidlyPairMock,
  TokenMock,
  MockGauge
} from "../../typechain-types";
import {BigNumber} from "ethers";
import {parseUnits} from "ethers/lib/utils";
import fs from "fs";

const ONE_USDC: BigNumber = parseUnits("1", 6);
const TEN_USDC: BigNumber = parseUnits("10", 6);
const ONE_THOUSAND_USDC: BigNumber = parseUnits("1000", 6);
const ONE_ETH: BigNumber = parseUnits("1", 18);
const TEN_ETH: BigNumber = parseUnits("10", 18);
const ONE_THOUSAND_ETH: BigNumber = parseUnits("1000", 18);
const rewardAmount = parseUnits("1", 18);

async function main() {
  const [deployer] = await ethers.getSigners();

  const ARBToken = await ethers.getContractFactory("TokenMock");
  const arbToken = await ARBToken.deploy("ARB", "ARB", 18) as TokenMock;
  await arbToken.deployed();

  const USDTToken = await ethers.getContractFactory("TokenMock");
  const usdtToken = await USDTToken.deploy("USDT", "USDT", 18) as TokenMock;
  await usdtToken.deployed();

  const USDCToken = await ethers.getContractFactory("TokenMock");
  const usdcToken = await USDCToken.deploy("USDC", "USDC", 6) as TokenMock;
  await usdcToken.deployed();

  const RAMToken = await ethers.getContractFactory("TokenMock");
  const ramToken = await RAMToken.deploy("RAM", "RAM", 18) as TokenMock;
  await ramToken.deployed();

  const WantToken = await ethers.getContractFactory("SolidlyPairMock");
  const wantToken = await WantToken.deploy(arbToken.address, usdtToken.address, false) as SolidlyPairMock;
  await wantToken.deployed();

  const SolidlyRouterMock = await ethers.getContractFactory("MockSolidlyRouter");
  const router = await SolidlyRouterMock.deploy(wantToken.address) as MockSolidlyRouter;
  await router.deployed();

  const lpToken0 = arbToken
  const lpToken1 = usdtToken
  const rewardToken = ramToken
  const feeToken = usdcToken
  const inputToken = usdcToken
  const lpToken = wantToken

  const MockGauge = await ethers.getContractFactory("GaugeMock");
  const gauge = await MockGauge.deploy([rewardToken.address], wantToken.address) as MockGauge;
  await gauge.deployed();

  const TokenRoutes = {
    rewardTokenToFeeTokenRoute: [
      {from: rewardToken.address, to: feeToken.address, stable: false},
    ],
    rewardTokenToLp0TokenRoute: [
      {from: rewardToken.address, to: lpToken0.address, stable: false},
    ],
    rewardTokenToLp1TokenRoute: [
      {from: rewardToken.address, to: lpToken1.address, stable: false},
    ],
    inputTokenToLp0TokenRoute: [
      {from: inputToken.address, to: lpToken0.address, stable: false},
    ],
    inputTokenToLp1TokenRoute: [
      {from: inputToken.address, to: lpToken1.address, stable: false},
    ],
    lp0ToInputTokenRoute: [
      {from: lpToken0.address, to: inputToken.address, stable: false},
    ],
    lp1ToInputTokenRoute: [
      {from: lpToken1.address, to: inputToken.address, stable: false},
    ],
  };

  const Vault = await ethers.getContractFactory("RLDSolidlyLpVault");
  const vault = await Vault.deploy('RLD_ARB_USDT_RAM', 'RLD_ARB_USDT_RAM') as RLDSolidlyLpVault;
  await vault.deployed();

  const SolidlyLpStrategy = await ethers.getContractFactory("SolidlyLpStrat");
  const strategy = await SolidlyLpStrategy.deploy(
    vault.address,
    wantToken.address,
    inputToken.address,
    gauge.address,
    router.address,
    BigNumber.from(0),
    TokenRoutes
  ) as SolidlyLpStrat;
  await strategy.deployed();

  await vault.initStrategy(strategy.address);

  await usdcToken.mintFor(deployer.address, TEN_USDC.mul(10000))
  await usdcToken.mintFor(router.address, TEN_USDC.mul(100000))

  await arbToken.mintFor(deployer.address, TEN_ETH.mul(10000))
  await arbToken.mintFor(router.address, TEN_ETH.mul(10000))

  await usdtToken.mintFor(router.address, TEN_ETH.mul(10000))
  await usdtToken.mintFor(deployer.address, TEN_ETH.mul(10000))
  await ramToken.mintFor(gauge.address, TEN_ETH.mul(10000))

  await wantToken.mintFor(gauge.address, TEN_ETH.mul(10000).mul(2))
  await wantToken.mintFor(router.address, TEN_ETH.mul(10000).mul(2))
  await wantToken.approve(router.address, TEN_ETH.mul(10000))

  const output = {
    vaultAddress: vault.address,
    inputTokenAddress: usdcToken.address,
    lp0Address: arbToken.address,
    lp1Address: usdtToken.address,
    rewardToken: ramToken.address,
    wantTokenAddress: wantToken.address,
    feeToken: usdcToken.address,
    routerAddress: router.address,
    gaugeAddress: gauge.address,
    deployerAddress: deployer.address,
    strategyAddress: strategy.address,
  }
  
  console.log(output)

  fs.writeFileSync(
    "./resources/deploy_ram_usdc_arb-output.json",
    JSON.stringify(output)
  )
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
