import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {ethers} from "hardhat";
import fs from "fs";
import {RLDSolidlyLpVault, SolidlyLpStrat} from '../../typechain-types';
import {BigNumber} from 'ethers';

async function main() {
  const [deployer]: SignerWithAddress[] =
    await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  //
  const Vault = await ethers.getContractFactory("RLDSolidlyLpVault");
  const vault: RLDSolidlyLpVault = (await Vault.deploy("RLD_RAM_ARB_USDC", "RLD_RAM_ARB_USDC")) as RLDSolidlyLpVault;
  await vault.deployed();

  const gauge = '0xc43e8F9AE4c1Ef6b8b63CBFEfE8Fe90d375fe11C'
  const lp0 = '0x912ce59144191c1204e64559fe8253a0e49e6548'
  const lp1 = '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8'
  const WETH = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
  const router = '0xf26515d5482e2c2fd237149bf6a653da4794b3d0'
  const want = '0x9cB911Cbb270cAE0d132689cE11c2c52aB2DedBC'
  const rewardToken = '0x463913D3a3D3D291667D53B8325c598Eb88D3B0e'

  const TokenRoutes = {
    rewardTokenToFeeTokenRoute: [
      {from: rewardToken, to: WETH, stable: false},
    ],
    rewardTokenToLp0TokenRoute: [
      {from: rewardToken, to: lp1, stable: false},
      {from: lp1, to: lp0, stable: false},
    ],
    rewardTokenToLp1TokenRoute: [
      {from: rewardToken, to: lp0, stable: false},
    ],
    inputTokenToLp0TokenRoute: [
      {from: lp1, to: lp0, stable: false},
    ],
    inputTokenToLp1TokenRoute: [
      {from: lp1, to: lp1, stable: false},
    ],
    lp0ToInputTokenRoute: [
      {from: lp0, to: lp1, stable: false},
    ],
    lp1ToInputTokenRoute: [
      {from: lp1, to: lp1, stable: false},
    ],
  };

  const SolidlyLpStrategy = await ethers.getContractFactory("SolidlyLpStrat");
  const strategy = await SolidlyLpStrategy.deploy(
    vault.address,
    want,
    lp1,
    gauge,
    router,
    BigNumber.from(30),
    TokenRoutes
  ) as SolidlyLpStrat;
  await strategy.deployed();
  await vault.initStrategy(strategy.address);

  console.log("Vault address:", vault.address);
  console.log("Strategy address:", strategy.address);

  fs.writeFileSync(
    "./resources/deploy_solid_lizard_arb_usdc-output.json",
    JSON.stringify({
      vaultAddress: vault.address,
      deployerAddress: deployer.address,
      strategyAddress: strategy.address,
      lp0Address: lp0,
      lp1Address: lp1,
      rewardToken: rewardToken,
      wantTokenAddress: want,
      feeToken: WETH,
      routerAddress: router,
      gaugeAddress: gauge,
      isStable: false
    })
  )
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
