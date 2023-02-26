import hre from "hardhat";

async function main() {

  await hre.run("verify:verify", {
    address: '0x24C6865C307ac8f4134b750fEd36325759017b3a',
    constructorArguments: []
  });

  await hre.run("verify:verify", {
    address: '0xBc60c62B282a4BF800aF98A5908Bde0f465b280d',
    constructorArguments: [
      '0x24C6865C307ac8f4134b750fEd36325759017b3a',
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
