import hre, { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const vaultAddress = '0x269F1806F1BFEF7586C53dB5e3E022E7E56d316F'
  const hopPool = '0x755569159598f3702bdD7DFF6233A317C156d3Dd'
  const hopTracker = '0x652d27c0F72771Ce5C76fd400edD61B406Ac6D97'
  const rewardToken = '0xc5102fe9359fd9a28f877a67e36b0f050d81a3cc'
  const token = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'
  const hopToken = '0xDa7c0de432a9346bB6e96aC74e3B61A36d8a77eB'
  const unirouter = '0xE592427A0AEce92De3Edee1F18E0157C05861564'


  await hre.run("verify:verify", {
    address: vaultAddress,
    constructorArguments: [
     "RLD_HOP_ETH",
     "RLD_HOP_ETH"
    ]
  });

  await hre.run("verify:verify", {
    address: '0xd6FBF492489EBBB1890B7149dA64BB96f043131D',
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
