import {expect} from "chai";
import {ethers} from "hardhat";
import {BigNumber, BigNumberish} from "ethers";
import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import type {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {BeefyVaultV7, CapPoolMock, CapRewardsMock, TokenMock} from "../typechain-types";
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

describe("Cap ERC20 Strategy", () => {
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
    
    it("Deposits are disabled when the strat is paused", async () => {
      const {alice, vault, strategy, ethToken} = await loadFixture(setupFixture);
      await strategy.pause();
      await ethToken.connect(alice).approve(vault.address, TEN_ETHER);
      await expect(vault.connect(alice).deposit(ONE_ETHER)).to.be.revertedWith("Pausable: paused");
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
    
    it("Sends performance fees to staking contract address when a protocolStakingFee is set", async () => {
      
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

    it("Returns want amounts requested for withdrawal by multiple parties", async () => {
      const {alice, vault, strategy, capPool, bob, ethToken} = await loadFixture(setupFixture);
      await ethToken.connect(alice).approve(vault.address, TEN_ETHER);
      await ethToken.connect(bob).approve(vault.address, TEN_ETHER);
      
      expect(await vault.totalSupply()).to.equal(0);

      await vault.connect(alice)
        .deposit(ONE_ETHER);

      await vault.connect(bob)
        .deposit(ONE_ETHER);

      expect(await vault.totalSupply()).to.equal(parseEther("2"));
      expect(await capPool.deposits(strategy.address)).to.equal(parseEther("2"));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);
      expect(await vault.balanceOf(bob.address)).to.equal(ONE_ETHER);

      await vault.connect(alice).withdraw(parseEther("0.5"))
      expect(await ethToken.balanceOf(alice.address)).to.equal(parseEther("999.5"));
      expect(await vault.balanceOf(alice.address)).to.equal(parseEther("0.5"));
      expect(await capPool.deposits(strategy.address)).to.equal(parseEther("1.5"));

      await vault.connect(bob).withdraw(parseEther("0.5"))
      expect(await ethToken.balanceOf(bob.address)).to.equal(parseEther("999.5"));
      expect(await vault.balanceOf(bob.address)).to.equal(parseEther("0.5"));
      expect(await capPool.deposits(strategy.address)).to.equal(parseEther("1"));

      expect(await vault.totalSupply()).to.equal(parseEther("1"));
      expect(await vault.balanceOf(alice.address)).to.equal(parseEther("0.5"));
      expect(await vault.balanceOf(bob.address)).to.equal(parseEther("0.5"));
    })

    it("Returns eth amounts requested for withdrawal by multiple parties with additional harvest", async () => {
      const {alice, vault, strategy, capPool, bob, deployer, ethToken} = await loadFixture(setupFixture);
      await ethToken.connect(alice).approve(vault.address, TEN_ETHER);
      await ethToken.connect(bob).approve(vault.address, TEN_ETHER);
      
      expect(await vault.totalSupply()).to.equal(0);

      await vault.connect(alice)
        .deposit(ONE_ETHER);

      await vault.connect(bob)
        .deposit(ONE_ETHER);

      expect(await vault.totalSupply()).to.equal(parseEther("2"));
      expect(await capPool.deposits(strategy.address)).to.equal(parseEther("2"));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);
      expect(await vault.balanceOf(bob.address)).to.equal(ONE_ETHER);

      const ownerFee = parseEther("0.3");

      await strategy.harvest()

      const capPoolBalanceOfStrategyAfterHarvest = parseEther("3").sub(ownerFee);
      const expectedEthBalanceForAliceAndBob = (ONE_ETHER.add(parseEther("0.35")).div(2));

      // NB after harvest, one LP token is worth 1.35 ETH for each party
      await vault.connect(alice).withdraw(parseEther("0.5"))
      expect(await vault.balanceOf(alice.address)).to.equal(parseEther("0.5"));
      expect(await capPool.deposits(strategy.address)).to.equal(capPoolBalanceOfStrategyAfterHarvest.sub(expectedEthBalanceForAliceAndBob));

      const capPoolRemainingBalanceOfStrategyAfterAliceWithdraw = capPoolBalanceOfStrategyAfterHarvest.sub(expectedEthBalanceForAliceAndBob);

      await vault.connect(bob).withdraw(parseEther("0.5"))
      expect(await vault.balanceOf(bob.address)).to.equal(parseEther("0.5"));
      expect(await capPool.deposits(strategy.address)).to.equal(capPoolRemainingBalanceOfStrategyAfterAliceWithdraw.sub(expectedEthBalanceForAliceAndBob));

      expect(await vault.totalSupply()).to.equal(parseEther("1"));
      expect(await vault.balanceOf(alice.address)).to.equal(parseEther("0.5"));
      expect(await vault.balanceOf(bob.address)).to.equal(parseEther("0.5"));
    })
    
  })
  
  describe("Utils", () => {
    describe("Pausing and un-pausing", () => {
      it("Sets the strategy as paused and unpaused", async () => {
        
      })
      
      it("Removes allowances for the Cap Pools when paused", async () => {
        
      })
      
      it("Gives allowances for the Cap Pools when un-paused", async () => {

      })
      
      it("Reverts when depositing while paused", async () => {
        
      })
      
      it ("Allows users to withdraw while paused", async () => {
        
      })
    })
    
    describe("Panic", () => {
      it("Collects rewards from the strategy and withdraws all funds from the pool", async () => {
        
      })
      
      it ("Pauses the strategy", async () => {
        
      })
    })
    
    describe("Performance Fees", () => {
      it("Can change the fee for the devs", async () => {
        const {strategy} = await loadFixture(setupFixture);
        await strategy.setDevFee(parseEther("0.5"));
        expect(await strategy.getDevFee()).to.equal(parseEther("0.5"));
      })

      it("Can change the fee for the staking contract", async () => {
        const {strategy} = await loadFixture(setupFixture);
        await strategy.setStakingFee(parseEther("0.1"));
        expect(await strategy.getStakingFee()).to.equal(parseEther("0.1"));
      })

      it("Only the owner can modify fees", async () => {
        const {strategy, alice} = await loadFixture(setupFixture);
        await expect(strategy.connect(alice).setDevFee(parseEther("0.5"))).to.be.revertedWith("Ownable: caller is not the owner");
      })
      
      it("Combined fees cannot exceed 50%", async () => {
        const {strategy} = await loadFixture(setupFixture);
        await strategy.setDevFee(parseEther("0.5"));
        await expect(strategy.setStakingFee(parseEther("0.5"))).to.be.revertedWith("fee too high")
      })
    })
  })
});
