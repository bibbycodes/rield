import {expect} from "chai";
import {ethers} from "hardhat";
import {BigNumber, BigNumberish} from "ethers";
import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import type {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {BeefyETHVault, CapETHPoolMock, CapETHRewardsMock} from "../typechain-types";
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

describe("Cap Eth Strategy", () => {
  async function setupFixture() {
    const [deployer, alice, bob]: SignerWithAddress[] =
      await ethers.getSigners();
    
    const nullAddress = "0x0000000000000000000000000000000000000000"

    const CapRewardsMock = await ethers.getContractFactory("CapETHRewardsMock");
    const capRewardsMock: CapETHRewardsMock = (await CapRewardsMock.deploy()) as CapETHRewardsMock;
    await capRewardsMock.deployed();

    const CapPoolMock = await ethers.getContractFactory("CapETHPoolMock");
    const capPoolMock: CapETHPoolMock = (await CapPoolMock.deploy(capRewardsMock.address)) as CapETHPoolMock;
    await capPoolMock.deployed();
    await capRewardsMock.init(capPoolMock.address);
    
    

    const Vault = await ethers.getContractFactory("BeefyETHVault");
    const vault: BeefyETHVault = (await Vault.deploy()) as BeefyETHVault;
    await vault.deployed();

    const SingleStakeStrategy = await ethers.getContractFactory("CapSingleStakeStrategyETH");
    const strategy = await SingleStakeStrategy.deploy(
      vault.address,
      capPoolMock.address,
      capRewardsMock.address,
    );

    await strategy.deployed();

    await vault.initialize(strategy.address, "RLD_CAP_ETH", "RLD_CAP_ETH")
    await deployer.sendTransaction({to: capRewardsMock.address, value: ONE_THOUSAND_ETH});
    
    return {
      vault,
      strategy,
      deployer,
      alice,
      bob,
      nullAddress,
      capPool: capPoolMock,
      capRewards: capRewardsMock
    };
  }


  it("Deployer owns the vault and strategy", async () => {
    const {deployer, vault, strategy} = await loadFixture(setupFixture);
    expect(await vault.owner()).to.equal(deployer.address);
    expect(await strategy.owner()).to.equal(deployer.address);
  })

  describe("Deposit", () => {
    it("Depositing into vault sends want amount to strategy and stakes into Cap under the strategy's address, mints token to alice", async () => {
      const {alice, vault, strategy, capPool} = await loadFixture(setupFixture);
      expect(await vault.totalSupply()).to.equal(0);
      await vault.connect(alice)
        .deposit({value: ONE_ETHER})

      expect(await vault.totalSupply()).to.equal(ONE_ETHER);
      expect(await capPool.deposits(strategy.address)).to.equal(ONE_ETHER);
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);
    })

    it("Mints token for bob and alice in proportion to their deposits", async () => {
      const {alice, bob, vault, strategy, capPool} = await loadFixture(setupFixture);
      await vault.connect(alice)
        .deposit({value: ONE_ETHER});

      await vault.connect(bob)
        .deposit({value: ONE_ETHER});

      expect(await vault.totalSupply()).to.equal(parseEther("2"));
      expect(await capPool.deposits(strategy.address)).to.equal(parseEther("2"));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);
      expect(await vault.balanceOf(bob.address)).to.equal(ONE_ETHER);
    })
  })

  describe("Harvest", () => {
    it("Compounds, claims and restakes, owner takes 30% of pf, rest goes back into strategy", async () => {
      const {alice, vault, strategy, capPool, capRewards, deployer} = await loadFixture(setupFixture);
      await vault.connect(alice)
        .deposit({value: ONE_ETHER});

      expect(await vault.totalSupply()).to.equal(ONE_ETHER);
      expect(await capPool.deposits(strategy.address)).to.equal(ONE_ETHER);
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);
      
      await expect(() =>
        strategy.harvest()
      ).to.changeEtherBalance(deployer, parseEther("0.3"));
      
      expect(await capPool.deposits(strategy.address)).to.equal(parseEther("1.7"));
    })
  })

  describe("Withdraw", () => {
    it("Returns tokens to depositor without additional harvest if harvest is not called", async () => {
      const {alice, vault, strategy, capPool} = await loadFixture(setupFixture);
      expect(await vault.totalSupply()).to.equal(0);
      await vault.connect(alice)
        .deposit({value: ONE_ETHER});

      expect(await vault.totalSupply()).to.equal(ONE_ETHER);
      expect(await capPool.deposits(strategy.address)).to.equal(ONE_ETHER);
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);
      
      const aliceShares = await vault.balanceOf(alice.address);
      await expect(vault.connect(alice).withdraw(aliceShares)).to.changeEtherBalance(alice, ONE_ETHER);

      expect(await vault.totalSupply()).to.equal(0);
      expect(await vault.balanceOf(alice.address)).to.equal(0);
    })

    it("Returns eth amounts requested for withdrawal by multiple parties", async () => {
      const {alice, vault, strategy, capPool, bob} = await loadFixture(setupFixture);
      expect(await vault.totalSupply()).to.equal(0);
      
      await vault.connect(alice)
        .deposit({value: ONE_ETHER});

      await vault.connect(bob)
        .deposit({value: ONE_ETHER});

      expect(await vault.totalSupply()).to.equal(parseEther("2"));
      expect(await capPool.deposits(strategy.address)).to.equal(parseEther("2"));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);
      expect(await vault.balanceOf(bob.address)).to.equal(ONE_ETHER);

      await expect(vault.connect(alice).withdraw(parseEther("0.5"))).to.changeEtherBalance(alice, parseEther("0.5"));
      expect(await vault.balanceOf(alice.address)).to.equal(parseEther("0.5"));
      expect(await capPool.deposits(strategy.address)).to.equal(parseEther("1.5"));

      await expect(vault.connect(bob).withdraw(parseEther("0.5"))).to.changeEtherBalance(bob, parseEther("0.5"));
      expect(await vault.balanceOf(bob.address)).to.equal(parseEther("0.5"));
      expect(await capPool.deposits(strategy.address)).to.equal(parseEther("1"));

      expect(await vault.totalSupply()).to.equal(parseEther("1"));
      expect(await vault.balanceOf(alice.address)).to.equal(parseEther("0.5"));
      expect(await vault.balanceOf(bob.address)).to.equal(parseEther("0.5"));
    })

    it("Returns eth amounts requested for withdrawal by multiple parties with additional harvest", async () => {
      const {alice, vault, strategy, capPool, bob, deployer} = await loadFixture(setupFixture);
      expect(await vault.totalSupply()).to.equal(0);

      await vault.connect(alice)
        .deposit({value: ONE_ETHER});

      await vault.connect(bob)
        .deposit({value: ONE_ETHER});

      expect(await vault.totalSupply()).to.equal(parseEther("2"));
      expect(await capPool.deposits(strategy.address)).to.equal(parseEther("2"));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);
      expect(await vault.balanceOf(bob.address)).to.equal(ONE_ETHER);
      
      const ownerFee = parseEther("0.3");

      await expect(() =>
        strategy.harvest()
      ).to.changeEtherBalance(deployer, ownerFee);
      
      const capPoolBalanceOfStrategyAfterHarvest = parseEther("3").sub(ownerFee);
      const expectedEthBalanceForAliceAndBob = (ONE_ETHER.add(parseEther("0.35")).div(2));

      // NB after harvest, one LP token is worth 1.35 ETH for each party
      await expect(vault.connect(alice).withdraw(parseEther("0.5"))).to.changeEtherBalance(alice, expectedEthBalanceForAliceAndBob);
      expect(await vault.balanceOf(alice.address)).to.equal(parseEther("0.5"));
      expect(await capPool.deposits(strategy.address)).to.equal(capPoolBalanceOfStrategyAfterHarvest.sub(expectedEthBalanceForAliceAndBob));

      const capPoolRemainingBalanceOfStrategyAfterAliceWithdraw = capPoolBalanceOfStrategyAfterHarvest.sub(expectedEthBalanceForAliceAndBob);
      
      await expect(vault.connect(bob).withdraw(parseEther("0.5"))).to.changeEtherBalance(bob, expectedEthBalanceForAliceAndBob);
      expect(await vault.balanceOf(bob.address)).to.equal(parseEther("0.5"));
      expect(await capPool.deposits(strategy.address)).to.equal(capPoolRemainingBalanceOfStrategyAfterAliceWithdraw.sub(expectedEthBalanceForAliceAndBob));

      expect(await vault.totalSupply()).to.equal(parseEther("1"));
      expect(await vault.balanceOf(alice.address)).to.equal(parseEther("0.5"));
      expect(await vault.balanceOf(bob.address)).to.equal(parseEther("0.5"));
    })
  })
});
