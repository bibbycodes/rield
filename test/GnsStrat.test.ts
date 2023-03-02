import {expect} from "chai";
import {ethers} from "hardhat";
import {BigNumber, BigNumberish} from "ethers";
import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import type {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {RldTokenVault, TokenMock, UniswapV3RouterMock, GNSStakingMock, StrategyGNS} from "../typechain-types";
import {parseEther} from "ethers/lib/utils";

const closeTo = async (
  a: BigNumberish,
  b: BigNumberish,
  margin: BigNumberish
) => {
  expect(a).to.be.closeTo(b, margin);
};

const ONE_ETHER: BigNumber = parseEther("1");
const TEN_ETHER: BigNumber = parseEther("10");
const ONE_THOUSAND_ETH: BigNumber = parseEther("1000");

describe("GNS", () => {
  async function setupFixture() {
    const [deployer, alice, bob]: SignerWithAddress[] =
      await ethers.getSigners();

    const Token = await ethers.getContractFactory("TokenMock");
    const gnsToken: TokenMock = (await Token.deploy("GNS", "GNS", 18)) as TokenMock;
    await gnsToken.deployed();

    const daiToken = await Token.deploy("DAI", "DAI", 18);
    await daiToken.deployed();

    const UniSwapMock = await ethers.getContractFactory("UniswapV3RouterMock");
    const uniSwapMock: UniswapV3RouterMock = (await UniSwapMock.deploy()) as UniswapV3RouterMock;
    await uniSwapMock.deployed();

    const GNSStakingMock = await ethers.getContractFactory("GNSStakingMock");
    const gnsRouterMock: GNSStakingMock = (await GNSStakingMock.deploy(gnsToken.address, daiToken.address)) as GNSStakingMock;
    await gnsRouterMock.deployed();

    const Vault = await ethers.getContractFactory("RldTokenVault");
    const vault: RldTokenVault = (await Vault.deploy()) as RldTokenVault;
    await vault.deployed();

    const commonAddresses = {
      vault: vault.address,
      unirouter: uniSwapMock.address,
      owner: deployer.address,
    }

    const Strategy = await ethers.getContractFactory("StrategyGNS");
    const strategy = await Strategy.deploy(
      gnsRouterMock.address,
      [daiToken.address, gnsToken.address],
      [3000],
      commonAddresses
    ) as StrategyGNS;
    await strategy.deployed();

    await vault.initialize(strategy.address, "gns_AUTO_C", "gns_AUTO_C")

    await daiToken.mintFor(gnsRouterMock.address, ONE_THOUSAND_ETH);
    await daiToken.mintFor(uniSwapMock.address, ONE_THOUSAND_ETH);
    await gnsToken.mintFor(alice.address, ONE_THOUSAND_ETH);
    await gnsToken.mintFor(bob.address, ONE_THOUSAND_ETH);
    await gnsToken.mintFor(uniSwapMock.address, ONE_THOUSAND_ETH);
    await gnsToken.mintFor(gnsRouterMock.address, ONE_THOUSAND_ETH);

    return {
      gnsRouter: gnsRouterMock,
      vault,
      strategy,
      deployer,
      alice,
      bob,
      daiToken,
      gns: gnsToken,
      uniswap: uniSwapMock
    };
  }


  it("Deployer owns the vault and strategy", async () => {
    const {deployer, vault, strategy} = await loadFixture(setupFixture);
    expect(await vault.owner()).to.equal(deployer.address);
    expect(await strategy.owner()).to.equal(deployer.address);
  })

  it("Want is the gns token address", async () => {
    const {vault, strategy, gns} = await loadFixture(setupFixture);
    expect(await vault.want()).to.equal(gns.address);
    expect(await strategy.want()).to.equal(gns.address);
  })

  describe("Deposit", () => {
    it("Depositing into vault sends want amount to strategy and stakes into gns under the strategy's address, mints token to alice", async () => {
      const {alice, vault, strategy, gns, gnsRouter} = await loadFixture(setupFixture);
      expect(await vault.totalSupply()).to.equal(0);
      await gns.connect(alice).approve(vault.address, TEN_ETHER);
      await vault.connect(alice)
        .deposit(ONE_ETHER);

      expect(await vault.totalSupply()).to.equal(ONE_ETHER);
      expect(await gnsRouter.gnsBalances(strategy.address)).to.equal(ONE_ETHER);
      expect(await gns.balanceOf(alice.address)).to.equal(parseEther("999"));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);
    })

    it("Mints token for bob and alice in proportion to their deposits", async () => {
      const {alice, bob, vault, strategy, gns, gnsRouter} = await loadFixture(setupFixture);
      await gns.connect(alice).approve(vault.address, TEN_ETHER);
      await vault.connect(alice)
        .deposit(ONE_ETHER);

      await gns.connect(bob).approve(vault.address, TEN_ETHER);
      await vault.connect(bob)
        .deposit(ONE_ETHER);

      expect(await vault.totalSupply()).to.equal(parseEther("2"));
      expect(await gnsRouter.gnsBalances(strategy.address)).to.equal(parseEther("2"));
      expect(await gns.balanceOf(alice.address)).to.equal(parseEther("999"));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);
      expect(await vault.balanceOf(bob.address)).to.equal(ONE_ETHER);
    })

    it("Deposits are disabled when the strat is stopped", async () => {
      const {alice, vault, strategy, gns, gnsRouter} = await loadFixture(setupFixture);
      const stopTx = await strategy.stop();
      await gns.connect(alice).approve(vault.address, TEN_ETHER);
      await expect(vault.connect(alice).deposit(ONE_ETHER)).to.be.revertedWith("Stoppable: stopped");
      await expect(stopTx).to.emit(strategy, "Stopped");
      await expect(await gns.allowance(strategy.address, gnsRouter.address)).to.equal(0);
    })

    it("Deposits are enabled when the strat is resumed", async () => {
      const {alice, vault, strategy, gns} = await loadFixture(setupFixture);
      await strategy.stop();
      const resumeTx = await strategy.resume();
      await gns.connect(alice).approve(vault.address, TEN_ETHER);
      await vault.connect(alice).deposit(ONE_ETHER)
      await expect(resumeTx).to.emit(strategy, "Resumed");
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);
    })
  })

  describe("Harvest", () => {
    it("Compounds, claims and restakes, owner takes 5% of pf, rest goes back into strategy", async () => {
      const {alice, vault, strategy, gns, gnsRouter, daiToken, deployer} = await loadFixture(setupFixture);
      await gns.connect(alice).approve(vault.address, TEN_ETHER);
      await vault.connect(alice).deposit(ONE_ETHER);
      expect(await vault.totalSupply()).to.equal(ONE_ETHER);
      expect(await gnsRouter.gnsBalances(strategy.address)).to.equal(ONE_ETHER);
      expect(await gns.balanceOf(alice.address)).to.equal(parseEther("999"));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);

      const harvestAmount = ONE_ETHER.div(10);
      const ownerCut = harvestAmount.div(20); //5% of harvest
      const txReceipt = await strategy.harvest();

      expect(await daiToken.balanceOf(deployer.address)).to.equal(ownerCut);
      expect(await gnsRouter.gnsBalances(strategy.address)).to.equal(ONE_ETHER.add(harvestAmount.sub(ownerCut)));
      await expect(txReceipt).to.emit(strategy, "StratHarvest")
      await expect(txReceipt).to.emit(gnsRouter, "Harvest")
    })
  })

  describe("Withdraw", () => {
    it("Harvests, Returns tokens to depositor with additional harvest", async () => {
      const {alice, vault, strategy, gns, gnsRouter, daiToken, deployer} = await loadFixture(setupFixture);
      expect(await vault.totalSupply()).to.equal(0);
      await gns.connect(alice).approve(vault.address, TEN_ETHER);
      await vault.connect(alice)
        .deposit(ONE_ETHER);

      expect(await vault.totalSupply()).to.equal(ONE_ETHER);
      expect(await gnsRouter.gnsBalances(strategy.address)).to.equal(ONE_ETHER);
      expect(await gns.balanceOf(alice.address)).to.equal(parseEther("999"));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);

      const txReceipt = await strategy.harvest();

      const aliceShares = await vault.balanceOf(alice.address);
      await vault.connect(alice).withdraw(aliceShares);
      
      const harvestAmount = ONE_ETHER.div(10);
      const ownerCut = harvestAmount.div(20); //5% of harvest
      const claimAmountUserPart = harvestAmount.sub(ownerCut);
      const expectedAliceGns = ONE_THOUSAND_ETH.add(claimAmountUserPart)

      expect(await vault.totalSupply()).to.equal(0);
      expect(await vault.balanceOf(alice.address)).to.equal(0);
      expect(await gns.balanceOf(alice.address)).to.equal(expectedAliceGns);
      expect(await daiToken.balanceOf(deployer.address)).to.equal(ownerCut);
    })
  })
});
