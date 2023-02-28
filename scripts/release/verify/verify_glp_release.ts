import hre from "hardhat";

async function main() {

  await hre.run("verify:verify", {
    address: '0xB27f5d331b92161e4643AfCA5B086200b21B5d93',
    constructorArguments: []
  });

  await hre.run("verify:verify", {
    address: '0x7b046Db337a50d452998A7350985C29508b5BA9E',
    constructorArguments: [
      '0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf',
      '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      '0xb95db5b167d75e6d04227cfffa61069348d271f5',
      '0xA906F338CB21815cBc4Bc87ace9e68c87eF8d8F1',
      '0xB27f5d331b92161e4643AfCA5B086200b21B5d93',
    ]
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
