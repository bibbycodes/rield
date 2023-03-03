import hre, { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const vaultAddress = '0x0DD4dD3Ee508CB70C3518951050E4C8620a63620'

  await hre.run("verify:verify", {
    address: vaultAddress,
    constructorArguments: []
  });

  const gnsStakingProxy = '0x6B8D3C08072a020aC065c467ce922e3A36D3F9d6'
  const daiToken = '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'
  const gnsToken = '0x18c11fd286c5ec11c3b683caa813b77f5163a122'
  const unirouter = '0xe592427a0aece92de3edee1f18e0157c05861564'

  const commonAddresses = {
    vault: vaultAddress,
    unirouter,
    owner: deployer.address,
  }

  await hre.run("verify:verify", {
    address: '0x8136A7bACDDcfff060Aea622B6542d9d7BB08440',
    constructorArguments: [
      gnsStakingProxy,
      [daiToken, gnsToken],
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
