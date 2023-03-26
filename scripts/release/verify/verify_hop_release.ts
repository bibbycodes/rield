import hre, { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const vaultAddress = '0x03E82e9d1F3ca8C41Fa235eE763b055d5f2F83B7'

  await hre.run("verify:verify", {
    address: vaultAddress,
    constructorArguments: []
  });

  const hopPool = '0xb0CabFE930642AD3E7DECdc741884d8C3F7EbC70'
  const hopTracker = '0x10541b07d8ad2647dc6cd67abd4c03575dade261'
  const rewardToken = '0xc5102fe9359fd9a28f877a67e36b0f050d81a3cc'
  const token = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'
  const hopToken = '0x0ce6c85cF43553DE10FC56cecA0aef6Ff0DD444d'
  const unirouter = '0xE592427A0AEce92De3Edee1F18E0157C05861564'

  await hre.run("verify:verify", {
    address: '0x77aa8b4fcc2cfFbf2A63EeE83dE292DA9f4008AE',
    constructorArguments: [
      vaultAddress,
      hopPool,
      hopTracker,
      rewardToken, // HOP
      token, // USDC
      hopToken, // hUSDC
      unirouter
    ]
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
