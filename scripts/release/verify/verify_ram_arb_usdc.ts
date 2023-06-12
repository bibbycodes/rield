import hre, { ethers } from "hardhat";
import { BigNumber } from 'ethers';

async function main() {
  const [deployer] = await ethers.getSigners();
  const vaultAddress = '0xa91A36edE47DCF289de86cB6400B16Cf5F079156'

  await hre.run("verify:verify", {
    address: vaultAddress,
    constructorArguments: ["RLD_RAM_ARB_USDC", "RLD_RAM_ARB_USDC"]
  });

  const gauge = '0x2951ffb9e7d54c9ca547901d482f2896e7d9a0ed'
  const lp0 = '0x912ce59144191c1204e64559fe8253a0e49e6548'
  const lp1 = '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8'
  const WETH = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
  const router = '0xaaa87963efeb6f7e0a2711f397663105acb1805e'
  const want = '0xba9f17ca67d1c8416bb9b132d50232191e27b45e'
  const rewardToken = '0xAAA6C1E32C55A7Bfa8066A6FAE9b42650F262418'

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
    address: '0x5e81d196f891035Eb0CaBEF546856aDDab1CEF09',
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
