import hre, { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const vaultAddress = '0x1848bF090705D0E83dfb350f363316693e8f38A6'

  await hre.run("verify:verify", {
    address: vaultAddress,
    constructorArguments: ["RLD_YGI_GNS", "RLD_YGI_GNS"]
  });
  // const gnsStakingProxy = '0x6B8D3C08072a020aC065c467ce922e3A36D3F9d6'
  // const daiToken = '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'
  // const gnsToken = '0x18c11fd286c5ec11c3b683caa813b77f5163a122'
  // const unirouter = '0xe592427a0aece92de3edee1f18e0157c05861564'
  // const ygiVault = '0x5227db0d58ddA6d621104F5f08004B98792710c1'
  //
  // await hre.run("verify:verify", {
  //   address: vaultAddress,
  //   constructorArguments: [
  //     usdcToken,
  //     unirouter,
  //     wethTokenAddress
  //   ]
  // });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
