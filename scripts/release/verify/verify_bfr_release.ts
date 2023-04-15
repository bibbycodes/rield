import hre, { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const vaultAddress = '0x07105b2f273EC8E9584237FD1FA40E1236AF1f53'

  await hre.run("verify:verify", {
    address: vaultAddress,
    constructorArguments: [
      'RLD_BFR',
      'RLD_BFR'
    ]
  });

  const bfrRewardRouter = '0xbD5FBB3b2610d34434E316e1BABb9c3751567B67'
  const usdcToken = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'
  const bfrToken = '0x1A5B0aaF478bf1FDA7b934c76E7692D722982a6D'
  const unirouter = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
  const arbToken = '0x912CE59144191C1204E64559FE8253a0e49E6548'
  const wethToken = '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'

  await hre.run("verify:verify", {
    address: '0x9b3c37c45Ac29A2205b35c5a586a34fddb5e9f47',
    constructorArguments: [
    bfrRewardRouter,
    vaultAddress,
    unirouter,
    bfrToken,
    arbToken,
    usdcToken,
    wethToken
    ]
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
