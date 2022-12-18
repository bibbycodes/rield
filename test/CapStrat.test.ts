import {expect} from "chai";
import {ethers} from "hardhat";
import {BigNumber, BigNumberish} from "ethers";
import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import type {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {BeefyVaultV7, ICapRewards, TokenMock, CapPoolMock, CapRewardsMock} from "../typechain-types";
import {parseEther} from "ethers/lib/utils";
import {deploy} from "@openzeppelin/hardhat-upgrades/dist/utils";

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

describe("Cap Strategies", () => {
  async function setupFixture() {
    const [deployer, alice, bob]: SignerWithAddress[] =
      await ethers.getSigners();

    const Token = await ethers.getContractFactory("TokenMock");
    const ethToken = await Token.deploy("WETH", "WETH", 18);
    await ethToken.deployed();

    const CapRewardsMock = await ethers.getContractFactory("CapRewardsMock");
    const capRewardsMock: CapRewardsMock = (await CapRewardsMock.deploy(ethToken.address)) as CapRewardsMock;
    await capRewardsMock.deployed();
    
    const CapPoolMock = await ethers.getContractFactory("CapPoolMock");
    const capPoolMock: CapPoolMock = (await CapPoolMock.deploy(ethToken.address, capRewardsMock.address)) as CapPoolMock;
    await capPoolMock.deployed();
    await capRewardsMock.init(capPoolMock.address);


    const Vault = await ethers.getContractFactory("BeefyVaultV7");
    const vault: BeefyVaultV7 = (await Vault.deploy()) as BeefyVaultV7;
    await vault.deployed();

    const SingleStakeStrategy = await ethers.getContractFactory("CapSingleStakeStrategy");
    const strategy = await SingleStakeStrategy.deploy(
      vault.address,
      capPoolMock.address,
      capRewardsMock.address,
      ethToken.address,
    );
    
    await strategy.deployed();

    await vault.initialize(strategy.address, "CAP_ETH_COMP", "CAP_ETH_COMP")

    await ethToken.mintFor(capRewardsMock.address, ONE_THOUSAND_ETH);
    await ethToken.mintFor(alice.address, ONE_THOUSAND_ETH);
    await ethToken.mintFor(bob.address, ONE_THOUSAND_ETH);

    return {
      vault,
      strategy,
      deployer,
      alice,
      bob,
      ethToken,
      capPool: capPoolMock,
      capRewards: capRewardsMock
    };
  }


  it("Deployer owns the vault and strategy", async () => {
    const {deployer, vault, strategy} = await loadFixture(setupFixture);
    expect(await vault.owner()).to.equal(deployer.address);
    expect(await strategy.owner()).to.equal(deployer.address);
  })

  it("Want is the ETH token address", async () => {
    const {vault, strategy, ethToken} = await loadFixture(setupFixture);
    expect(await vault.want()).to.equal(ethToken.address);
    expect(await strategy.want()).to.equal(ethToken.address);
  })

  describe("Deposit", () => {
    it("Depositing into vault sends want amount to strategy and stakes into GMX under the strategy's address, mints token to alice", async () => {
      const {alice, vault, strategy, capPool, ethToken} = await loadFixture(setupFixture);
      expect(await vault.totalSupply()).to.equal(0);
      await ethToken.connect(alice).approve(vault.address, TEN_ETHER);
      await vault.connect(alice)
        .deposit(ONE_ETHER);

      expect(await vault.totalSupply()).to.equal(ONE_ETHER);
      expect(await capPool.deposits(strategy.address)).to.equal(ONE_ETHER);
      expect(await ethToken.balanceOf(alice.address)).to.equal(parseEther("999"));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);
    })

    it("Mints token for bob and alice in proportion to their deposits", async () => {
      const {alice, bob, vault, strategy, capPool, ethToken} = await loadFixture(setupFixture);
      await ethToken.connect(alice).approve(vault.address, TEN_ETHER);
      await vault.connect(alice)
        .deposit(ONE_ETHER);

      await ethToken.connect(bob).approve(vault.address, TEN_ETHER);
      await vault.connect(bob)
        .deposit(ONE_ETHER);

      expect(await vault.totalSupply()).to.equal(parseEther("2"));
      expect(await capPool.deposits(strategy.address)).to.equal(parseEther("2"));
      expect(await ethToken.balanceOf(alice.address)).to.equal(parseEther("999"));
      expect(await ethToken.balanceOf(bob.address)).to.equal(parseEther("999"));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);
      expect(await vault.balanceOf(bob.address)).to.equal(ONE_ETHER);
    })
  })

  describe("Harvest", () => {
    it("Compounds, claims and restakes, owner takes 30% of pf, rest goes back into strategy", async () => {
      const {alice, vault, strategy, capPool, capRewards, ethToken, deployer} = await loadFixture(setupFixture);
      await ethToken.connect(alice).approve(vault.address, TEN_ETHER);
      await vault.connect(alice).deposit(ONE_ETHER);

      expect(await vault.totalSupply()).to.equal(ONE_ETHER);
      expect(await capPool.deposits(strategy.address)).to.equal(ONE_ETHER);
      expect(await ethToken.balanceOf(alice.address)).to.equal(parseEther("999"));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);

      const txReceipt = await strategy.harvest();
      
      expect(await ethToken.balanceOf(deployer.address)).to.equal(parseEther("0.3"));
      expect(await capPool.deposits(strategy.address)).to.equal(parseEther("1.7"));
      await expect(txReceipt).to.emit(capPool, "Deposit")
      await expect(txReceipt).to.emit(capRewards, "CollectRewards")
    })
  })

  describe("Withdraw", () => {
    it("Harvests, Returns tokens to depositor with additional harvest", async () => {
      const {alice, vault, strategy, capPool, capRewards, ethToken, deployer} = await loadFixture(setupFixture);
      expect(await vault.totalSupply()).to.equal(0);
      await ethToken.connect(alice).approve(vault.address, TEN_ETHER);
      await vault.connect(alice)
        .deposit(ONE_ETHER);

      expect(await vault.totalSupply()).to.equal(ONE_ETHER);
      expect(await capPool.deposits(strategy.address)).to.equal(ONE_ETHER);
      expect(await ethToken.balanceOf(alice.address)).to.equal(parseEther("999"));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);

      await strategy.harvest();

      const aliceShares = await vault.balanceOf(alice.address);
      await vault.connect(alice).withdraw(aliceShares);

      const claimAmount = parseEther("1");
      const claimAmountUserPart = claimAmount.sub(parseEther("0.3"));
      const ownerFee = claimAmount.sub(parseEther("0.7"));

      const expectedAliceGmx = ONE_THOUSAND_ETH.add(claimAmountUserPart);

      expect(await vault.totalSupply()).to.equal(0);
      expect(await vault.balanceOf(alice.address)).to.equal(0);
      expect(await ethToken.balanceOf(alice.address)).to.equal(expectedAliceGmx);
      expect(await ethToken.balanceOf(deployer.address)).to.equal(ownerFee);
    })
  })
});
