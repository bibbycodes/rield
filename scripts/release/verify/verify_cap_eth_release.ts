import hre from "hardhat";

async function main() {

  await hre.run("verify:verify", {
    address: '0x6e6c69997B0000CbF3661102152E432695c6D97C',
    constructorArguments: []
  });

  await hre.run("verify:verify", {
    address: '0x470AAE9c435B1C7189d1497D749e7C4916cF32F9',
    constructorArguments: [
      '0x6e6c69997B0000CbF3661102152E432695c6D97C',
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
