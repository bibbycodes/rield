import hre from "hardhat";

async function main() {

  await hre.run("verify:verify", {
    address: '0xa4E26A1D5Bc60b864e492384B5aF868785b28720',
    constructorArguments: []
  });

  await hre.run("verify:verify", {
    address: '0x9FA9dBc3f434357a0A36bABa4424dE08C2de22bC',
    constructorArguments: [
      '0xa4E26A1D5Bc60b864e492384B5aF868785b28720',
      '0x958cc92297e6F087f41A86125BA8E121F0FbEcF2',
      '0x10f2f3B550d98b6E51461a83AD3FE27123391029',
      '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    ]
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
