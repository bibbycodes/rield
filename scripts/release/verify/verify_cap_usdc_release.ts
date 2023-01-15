import hre from "hardhat";

async function main() {

  await hre.run("verify:verify", {
    address: '0x30D082c9e3400f29e863243988c462BA3A03099B',
    constructorArguments: []
  });

  await hre.run("verify:verify", {
    address: '0x6E765d918919C84075B4E087CBD73DF2a13e54E0',
    constructorArguments: [
      '0x30D082c9e3400f29e863243988c462BA3A03099B',
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
