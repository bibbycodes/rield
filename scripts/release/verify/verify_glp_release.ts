import hre from "hardhat";

async function main() {

  await hre.run("verify:verify", {
    address: '0x82A3159C103c4D8e7C56d89AB0566ce899906431',
    constructorArguments: []
  });

  await hre.run("verify:verify", {
    address: '0x91f2452F72E260Aa88b07494F5557504180D7B5a',
    constructorArguments: [
      '0x5402B5F40310bDED796c7D0F3FF6683f5C0cFfdf',
      '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      '0xb95db5b167d75e6d04227cfffa61069348d271f5',
      '0xA906F338CB21815cBc4Bc87ace9e68c87eF8d8F1',
      '0x82A3159C103c4D8e7C56d89AB0566ce899906431',
    ]
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
