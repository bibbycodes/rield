import hre from "hardhat";

async function main() {

  await hre.run("verify:verify", {
    address: '0x61935ba8EaB57172C39e7d8DF57586AcFa92876d',
    constructorArguments: []
  });

  await hre.run("verify:verify", {
    address: '0xEA1E3E88849b1eDE46eCDc0b1909Dc46b67B04a9',
    constructorArguments: [
      '0x61935ba8EaB57172C39e7d8DF57586AcFa92876d',
      '0xE0cCd451BB57851c1B2172c07d8b4A7c6952a54e', // capETHPool
      '0x29163356bBAF0a3bfeE9BA5a52a5C6463114Cb5f', // capETHRewards
    ]
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
