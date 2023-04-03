import hre, { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const vaultAddress = '0x1848bF090705D0E83dfb350f363316693e8f38A6'

  // await hre.run("verify:verify", {
  //   address: vaultAddress,
  //   constructorArguments: [
  //    "RLD_HOP_USDT",
  //    "RLD_HOP_USDT"
  //   ]
  // });

  const hopPool = '0x9Dd8685463285aD5a94D2c128bda3c5e8a6173c8'
  const hopTracker = '0x18f7402B673Ba6Fb5EA4B95768aABb8aaD7ef18a'
  const rewardToken = '0xc5102fe9359fd9a28f877a67e36b0f050d81a3cc'
  const token = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'
  const hopToken = '0x12e59C59D282D2C00f3166915BED6DC2F5e2B5C7'
  const unirouter = '0xE592427A0AEce92De3Edee1F18E0157C05861564'

  await hre.run("verify:verify", {
    address: '0x1C75d2923E03b0D083a8682cDfefBf06F6dDe286',
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
