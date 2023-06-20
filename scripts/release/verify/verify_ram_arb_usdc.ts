import hre, { ethers } from "hardhat";
import { BigNumber } from 'ethers';

async function main() {
  const [deployer] = await ethers.getSigners();
  const vaultAddress = '0x862d03C462c67AA0A9349662A89495ACe923B6E8'

  await hre.run("verify:verify", {
    address: vaultAddress,
    constructorArguments: ["RLD_RAM_ARB_USDC", "RLD_RAM_ARB_USDC"]
  });

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

  await hre.run("verify:verify", {
    address: '0xAc4D1Ed3c2fd0fF92566F026d6b45C0AF8E15bD0',
    constructorArguments: [
      vaultAddress,
      want,
      lp1,
      gauge,
      router,
      BigNumber.from(30),
      TokenRoutes
    ]
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
