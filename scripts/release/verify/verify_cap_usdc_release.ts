import hre from "hardhat";

async function main() {

  await hre.run("verify:verify", {
    address: '0xE6a4d3724a0C3FC03879c75282a717765bA65dC1',
    constructorArguments: []
  });

  await hre.run("verify:verify", {
    address: '0x64eC93A337395832233dD28E7c4dD13331eA1Bac',
    constructorArguments: [
      '0xE6a4d3724a0C3FC03879c75282a717765bA65dC1',
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
