import hre, { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const vaultAddress = '0x5227db0d58ddA6d621104F5f08004B98792710c1'
  const usdcToken = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'
  const unirouter = '0xe592427a0aece92de3edee1f18e0157c05861564'
  const wethTokenAddress = '0x82af49447d8a07e3bd95bd0d56f35241523fbab1';

  await hre.run("verify:verify", {
    address: vaultAddress,
    constructorArguments: [
      usdcToken,
      unirouter,
      wethTokenAddress
    ]
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
