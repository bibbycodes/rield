import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber, BigNumberish } from "ethers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  GMXRouterMock,
  GNSStakingMock,
  RldTokenVault,
  TokenMock,
  UniswapV3RouterMock,
  YgiPoolStrategy
} from "../../typechain-types";
import { parseEther, parseUnits } from "ethers/lib/utils";
import { StrategyGNS } from "../../typechain-types";

const closeTo = async (
  a: BigNumberish,
  b: BigNumberish,
  margin: BigNumberish
) => {
  expect(a).to.be.closeTo(b, margin);
};

const ONE_USDC: BigNumber = parseUnits("1", 6);
const TEN_USDC: BigNumber = parseUnits("10", 6);
const ONE_ETHER: BigNumber = parseEther("1");
const TEN_ETHER: BigNumber = parseEther("10");
const ONE_THOUSAND_USDC: BigNumber = parseUnits("1000", 6);
const CAP_MULTIPLIER: BigNumber = parseUnits("1", 12);

describe("YGI Vault", () => {

  async function getFixture(inputTokenDecimals: number) {
    async function setupFixture() {
      const [deployer, alice, bob]: SignerWithAddress[] =
        await ethers.getSigners();

      const Token = await ethers.getContractFactory("TokenMock");

      const UniSwapMock = await ethers.getContractFactory("UniswapV3RouterMock");
      const uniSwapMock: UniswapV3RouterMock = (await UniSwapMock.deploy()) as UniswapV3RouterMock;
      await uniSwapMock.deployed();

      // GNS
      const gnsToken: TokenMock = (await Token.deploy("GNS", "GNS", 18)) as TokenMock;
      await gnsToken.deployed();

      const daiToken = await Token.deploy("DAI", "DAI", 18);
      await daiToken.deployed();

      const GNSStakingMock = await ethers.getContractFactory("GNSStakingMock");
      const gnsRouterMock: GNSStakingMock = (await GNSStakingMock.deploy(gnsToken.address, daiToken.address)) as GNSStakingMock;
      await gnsRouterMock.deployed();

      const GnsVault = await ethers.getContractFactory("RldTokenVault");
      const gnsVault: RldTokenVault = (await GnsVault.deploy("gns_AUTO_C", "gns_AUTO_C")) as RldTokenVault;
      await gnsVault.deployed();

      const gnsCommonAddresses = {
        vault: gnsVault.address,
        unirouter: uniSwapMock.address,
        owner: deployer.address,
      }

      const GnsStrategy = await ethers.getContractFactory("StrategyGNS");
      const gnsStrategy = await GnsStrategy.deploy(
        gnsRouterMock.address,
        [daiToken.address, gnsToken.address],
        [3000],
        gnsCommonAddresses
      ) as StrategyGNS;
      await gnsStrategy.deployed();

      await gnsVault.initStrategy(gnsStrategy.address)

      // GMX
      const gmxToken: TokenMock = (await Token.deploy("GMX", "GMX", 18)) as TokenMock;
      await gmxToken.deployed();

      const ethToken = await Token.deploy("WETH", "WETH", 18);
      await ethToken.deployed();

      const GMXRouterMock = await ethers.getContractFactory("GMXRouterMock");
      const gmxRouterMock: GMXRouterMock = (await GMXRouterMock.deploy(gmxToken.address, ethToken.address)) as GMXRouterMock;
      await gmxRouterMock.deployed();

      const GmxVault = await ethers.getContractFactory("RldTokenVault");
      const gmxVault: RldTokenVault = (await GmxVault.deploy('GMX', 'GMX')) as RldTokenVault;
      await gmxVault.deployed();

      const gmxCommonAddresses = {
        vault: gmxVault.address,
        unirouter: uniSwapMock.address,
        owner: deployer.address,
      }

      const GmxStrategy = await ethers.getContractFactory("StrategyGMXUniV3");
      const gmxStrategy = await GmxStrategy.deploy(
        gmxRouterMock.address,
        [ethToken.address, gmxToken.address],
        [3000],
        gmxCommonAddresses
      );
      await gmxStrategy.deployed();
      await gmxVault.initStrategy(gmxStrategy.address)

      // Master Vault
      const inputToken = await Token.deploy("USDC", "USDC", inputTokenDecimals) as TokenMock;

      //  Mints
      await inputToken.deployed();
      const MasterVault = await ethers.getContractFactory("YgiPoolStrategy");
      const masterVault: YgiPoolStrategy = (await MasterVault.deploy(
        inputToken.address,
        uniSwapMock.address
      )) as YgiPoolStrategy;
      await masterVault.deployed();

      await inputToken.mintFor(alice.address, inputTokenDecimals === 6 ? TEN_USDC : TEN_ETHER);
      await inputToken.mintFor(bob.address, inputTokenDecimals === 6 ? TEN_USDC : TEN_ETHER);
      await inputToken.mintFor(uniSwapMock.address, inputTokenDecimals === 6 ? TEN_USDC : TEN_ETHER);

      await ethToken.mintFor(gmxRouterMock.address, TEN_ETHER.mul(100));
      await ethToken.mintFor(uniSwapMock.address, TEN_ETHER.mul(100));

      await gmxToken.mintFor(uniSwapMock.address, TEN_ETHER.mul(100));
      await gmxToken.mintFor(gmxRouterMock.address, TEN_ETHER.mul(100));

      await daiToken.mintFor(gnsRouterMock.address, TEN_ETHER.mul(100));
      await daiToken.mintFor(uniSwapMock.address, TEN_ETHER.mul(100));

      await gnsToken.mintFor(uniSwapMock.address, TEN_ETHER.mul(100));

      await masterVault.registerYgiComponent(
        "GNS",
        gnsToken.address,
        gnsVault.address,
        ethers.utils.parseEther('70'),
        [inputToken.address, gnsToken.address],
        [3000],
        [gnsToken.address, inputToken.address],
        [3000]
      );

      await masterVault.registerYgiComponent(
        "GMX",
        gmxToken.address,
        gmxVault.address,
        ethers.utils.parseEther('30'),
        [inputToken.address, gmxToken.address],
        [3000],
        [gmxToken.address, inputToken.address],
        [3000]
      );

      return {
        gnsToken,
        gmxToken,
        ethToken,
        usdcToken: inputToken,
        daiToken,
        uniSwapMock,
        gnsVault,
        gnsStrategy,
        gmxVault,
        gmxStrategy,
        masterVault,
        deployer,
        alice,
        bob,
      };
    }

    return loadFixture(setupFixture)
  }


  it("Deployer owns the vault and strategy", async () => {
    const {deployer, masterVault} = await getFixture(6);
    expect(await masterVault.owner()).to.equal(deployer.address);
  })

  it("Should return the correct total value in the vault", async () => {
    const { alice, bob, usdcToken, uniSwapMock, masterVault, gnsVault, gmxVault } = await getFixture(6);
    const aliceDeposit = ONE_USDC.mul(1);
    const bobDeposit = ONE_USDC.mul(2);
    await usdcToken.connect(alice).approve(masterVault.address, aliceDeposit);
    await usdcToken.connect(bob).approve(masterVault.address, bobDeposit);
    await masterVault.connect(alice).deposit(aliceDeposit);
    await masterVault.connect(bob).deposit(bobDeposit);
    expect(await gnsVault.totalSupply()).to.be.closeTo(ethers.utils.parseEther('2.1'), ethers.utils.parseUnits('0.01', 6));
    expect(await gmxVault.totalSupply()).to.be.closeTo(ethers.utils.parseEther('0.9'), ethers.utils.parseUnits('0.01', 6));
  });

  it("Should emit a Deposit event with the correct amount", async () => {
    const { alice, usdcToken, masterVault } = await getFixture(6);
    const amountToDeposit = ONE_USDC.mul(10);
    await usdcToken.connect(alice).approve(masterVault.address, amountToDeposit);

    await expect(masterVault.connect(alice).deposit(amountToDeposit))
      .to.emit(masterVault, "Deposit")
      .withArgs(amountToDeposit);
  });

  it("Should update the user's balance in the mapping", async () => {
    const { alice, usdcToken, masterVault } = await getFixture(6);
    const amountToDeposit = ONE_USDC.mul(10);
    await usdcToken.connect(alice).approve(masterVault.address, amountToDeposit);

    await masterVault.connect(alice).deposit(amountToDeposit);

    const userBalance = await masterVault.userToVaultToAmount(alice.address, masterVault.address);
    expect(userBalance).to.equal(amountToDeposit);
  });

  it("Should update the lastPoolDepositTime", async () => {
    const { alice, usdcToken, masterVault } = await getFixture(6);
    const amountToDeposit = ONE_USDC.mul(10);
    await usdcToken.connect(alice).approve(masterVault.address, amountToDeposit);

    await masterVault.connect(alice).deposit(amountToDeposit);

    const lastDepositTime = await masterVault.lastPoolDepositTime();
    expect(lastDepositTime).to.not.equal(0);
  });

  it("Should revert if the user tries to deposit zero amount", async () => {
    const { alice, masterVault } = await getFixture(6);

    await expect(masterVault.connect(alice).deposit(0)).to.be.revertedWith("Cannot deposit zero amount");
  });

  it("Should revert if the user has not approved the transfer of tokens", async () => {
    const { alice, usdcToken, masterVault } = await getFixture(6);
    const amountToDeposit = ONE_USDC.mul(10);

    await expect(masterVault.connect(alice).deposit(amountToDeposit)).to.be.revertedWith(
      "ERC20: transfer amount exceeds allowance"
    );
  });

  it("Should allow withdrawing", async () => {
    const { alice, usdcToken, uniSwapMock, masterVault } = await getFixture(6);
    const aliceDeposit = ONE_USDC.mul(10);
    await usdcToken.connect(alice).approve(masterVault.address, aliceDeposit);
    await masterVault.connect(alice).deposit(aliceDeposit);
    await masterVault.connect(alice).withdraw(ONE_USDC, false);
    expect(await usdcToken.balanceOf(alice.address)).to.be.closeTo(ONE_USDC.mul(10), ONE_USDC.div(10));
  });

  it("Should not allow withdrawing more than deposited", async () => {
    const { alice, usdcToken, uniSwapMock, masterVault } = await getFixture(6);
    const aliceDeposit = ONE_USDC.mul(10);
    await usdcToken.connect(alice).approve(masterVault.address, aliceDeposit);
    await masterVault.connect(alice).deposit(aliceDeposit);
    await expect(masterVault.connect(alice).withdraw(ethers.utils.parseUnits('1.01', 6), false)).to.be.revertedWith("Ratio too high");
  });


});
