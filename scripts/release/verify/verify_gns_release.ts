import hre, { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const vaultAddress = '0xb3a2AFa70483b72bE8CfEE0413C70f6c3A0186E5'

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
    address: '0xA67102F5324a1FD95a2c2be550E33693019ac4D3',
    constructorArguments: [
      gnsStakingProxy,
      [daiToken, gnsToken],
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
