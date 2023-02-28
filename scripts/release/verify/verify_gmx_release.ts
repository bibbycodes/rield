import hre, { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const vaultAddress = '0x667a8Fb002A0742E4e243F659f05670e301FbE63'

  await hre.run("verify:verify", {
    address: vaultAddress,
    constructorArguments: []
  });

  const gmxRewardRouter = '0xa906f338cb21815cbc4bc87ace9e68c87ef8d8f1'
  const ethToken = '0x82af49447d8a07e3bd95bd0d56f35241523fbab1'
  const gmxToken = '0xfc5a1a6eb076a2c7ad06ed22c90d7e710e35ad0a'
  const unirouter = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
  const commonAddresses = {
    vault: vaultAddress,
    unirouter,
    owner: deployer.address,
  }
  await hre.run("verify:verify", {
    address: '0x6B1A79741719CA781307eeE78e9fd3E5Db0cF42A',
    constructorArguments: [
      gmxRewardRouter,
      [ethToken, gmxToken],
      [3000],
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
