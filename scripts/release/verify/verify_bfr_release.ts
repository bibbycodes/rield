import hre, { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const vaultAddress = '0x518CE90E0E932Fe23f994A29f095D03aB4095551'

  await hre.run("verify:verify", {
    address: vaultAddress,
    constructorArguments: []
  });

  const bfrRewardRouter = '0xbD5FBB3b2610d34434E316e1BABb9c3751567B67'
  const usdcToken = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8'
  const bfrToken = '0x1A5B0aaF478bf1FDA7b934c76E7692D722982a6D'
  const unirouter = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
  const commonAddresses = {
    vault: vaultAddress,
    unirouter,
    owner: deployer.address,
  }
  await hre.run("verify:verify", {
    address: '0x5dD16199CAbB361922BA1d77375975Ec69b406cD',
    constructorArguments: [
      bfrRewardRouter,
      [usdcToken, bfrToken],
      [10000],
      commonAddresses
    ]
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
