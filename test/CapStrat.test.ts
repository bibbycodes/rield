import {expect} from "chai";
import {ethers} from "hardhat";
import {BigNumber, BigNumberish} from "ethers";
import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import type {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {BeefyVaultV7, CapPoolMock, CapRewardsMock, TokenMock} from "../typechain-types";
import {parseEther, parseUnits} from "ethers/lib/utils";

const closeTo = async (
  a: BigNumberish,
  b: BigNumberish,
  margin: BigNumberish
) => {
  expect(a).to.be.closeTo(b, margin);
};

const ONE_USDC: BigNumber = parseUnits("1", 6);
const TEN_USDC: BigNumber = parseUnits("10", 6);
const ONE_THOUSAND_USDC: BigNumber = parseUnits("1000", 6);

describe("Cap ERC20 Strategy", () => {
  async function setupFixture() {
    const [deployer, alice, bob]: SignerWithAddress[] =
      await ethers.getSigners();

    const Token = await ethers.getContractFactory("TokenMock");
    const usdcToken = await Token.deploy("USDC", "USDC", 6);
    await usdcToken.deployed();

    const CapRewardsMock = await ethers.getContractFactory("CapRewardsMock");
    const capRewardsMock: CapRewardsMock = (await CapRewardsMock.deploy(usdcToken.address)) as CapRewardsMock;
    await capRewardsMock.deployed();
    
    const CapPoolMock = await ethers.getContractFactory("CapPoolMock");
    const capPoolMock: CapPoolMock = (await CapPoolMock.deploy(usdcToken.address, capRewardsMock.address)) as CapPoolMock;
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
      usdcToken.address,
    );
    
    await strategy.deployed();

    await vault.initialize(strategy.address, "CAP_ETH_COMP", "CAP_ETH_COMP")

    await usdcToken.mintFor(capRewardsMock.address, ONE_THOUSAND_USDC);
    await usdcToken.mintFor(alice.address, ONE_THOUSAND_USDC);
    await usdcToken.mintFor(bob.address, ONE_THOUSAND_USDC);

    return {
      vault,
      strategy,
      deployer,
      alice,
      bob,
      usdcToken,
      capPool: capPoolMock,
      capRewards: capRewardsMock
    };
  }


  it("Deployer owns the vault and strategy", async () => {
    const {deployer, vault, strategy} = await loadFixture(setupFixture);
    expect(await vault.owner()).to.equal(deployer.address);
    expect(await strategy.owner()).to.equal(deployer.address);
  })

  it("Want is the USDC token address", async () => {
    const {vault, strategy, usdcToken} = await loadFixture(setupFixture);
    expect(await vault.want()).to.equal(usdcToken.address);
    expect(await strategy.want()).to.equal(usdcToken.address);
  })

  it("Vault decimals is the same as the token decimals", async () => {
    const {vault, usdcToken} = await loadFixture(setupFixture);
    expect(await vault.decimals()).to.equal(await usdcToken.decimals());
  })

  describe("Deposit", () => {
    it("Depositing into vault sends want amount to strategy and stakes into pool under the strategy's address, mints token to alice", async () => {
      console.log({ONE_USDC});
      const {alice, vault, strategy, capPool, usdcToken} = await loadFixture(setupFixture);
      expect(await vault.totalSupply()).to.equal(0);
      await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
      await vault.connect(alice)
        .deposit(ONE_USDC);

      expect(await vault.totalSupply()).to.equal(ONE_USDC);
      expect(await capPool.deposits(strategy.address)).to.equal(ONE_USDC);
      expect(await usdcToken.balanceOf(alice.address)).to.equal(parseUnits("999", 6));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_USDC);
    })

    it("Mints token for bob and alice in proportion to their deposits", async () => {
      const {alice, bob, vault, strategy, capPool, usdcToken} = await loadFixture(setupFixture);
      await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
      await vault.connect(alice)
        .deposit(ONE_USDC);

      await usdcToken.connect(bob).approve(vault.address, TEN_USDC);
      await vault.connect(bob)
        .deposit(ONE_USDC);

      const vaultTokenSupply = await vault.totalSupply()
      const capPoolDeposits = await capPool.deposits(strategy.address)
      const aliceUsdcBal = await usdcToken.balanceOf(alice.address)
      const bobUsdcBal = await usdcToken.balanceOf(bob.address)
      const aliceVaultTokenBal = await vault.balanceOf(alice.address)
      const bobVaultTokenBal = await vault.balanceOf(bob.address)
      
      console.log({
        vaultTokenSupply,
        capPoolDeposits,
        aliceUsdcBal,
        bobUsdcBal,
        aliceVaultTokenBal,
        bobVaultTokenBal,
      })

      expect(await vault.totalSupply()).to.equal(parseUnits("2", 6));
      expect(await capPool.deposits(strategy.address)).to.equal(parseUnits("2", 6));
      expect(await usdcToken.balanceOf(alice.address)).to.equal(parseUnits("999", 6));
      expect(await usdcToken.balanceOf(bob.address)).to.equal(parseUnits("999", 6));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_USDC);
      expect(await vault.balanceOf(bob.address)).to.equal(ONE_USDC);
    })
    
    it("Deposits are disabled when the strat is paused", async () => {
      const {alice, vault, strategy, usdcToken} = await loadFixture(setupFixture);
      await strategy.pause();
      await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
      await expect(vault.connect(alice).deposit(ONE_USDC)).to.be.revertedWith("Pausable: paused");
    })
  })

  describe("Harvest", () => {
    it("Compounds, claims and restakes, owner takes 30% of pf, rest goes back into strategy", async () => {
      const {alice, vault, strategy, capPool, capRewards, usdcToken, deployer} = await loadFixture(setupFixture);
      await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
      await vault.connect(alice).deposit(ONE_USDC);

      expect(await vault.totalSupply()).to.equal(ONE_USDC);
      expect(await capPool.deposits(strategy.address)).to.equal(ONE_USDC);
      expect(await usdcToken.balanceOf(alice.address)).to.equal(parseUnits("999", 6));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_USDC);

      const txReceipt = await strategy.harvest();
      
      expect(await usdcToken.balanceOf(deployer.address)).to.equal(parseUnits("0.3", 6));
      expect(await capPool.deposits(strategy.address)).to.equal(parseUnits("1.7", 6));
      await expect(txReceipt).to.emit(capPool, "Deposit")
      await expect(txReceipt).to.emit(capRewards, "CollectRewards")
    })
    
    it("Sends performance fees to staking contract address when a protocolStakingFee is set", async () => {
      
    })
  })

  describe("Withdraw", () => {
    it("Harvests, Returns tokens to depositor with additional harvest", async () => {
      const {alice, vault, strategy, capPool, usdcToken, deployer} = await loadFixture(setupFixture);
      expect(await vault.totalSupply()).to.equal(0);
      await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
      await vault.connect(alice)
        .deposit(ONE_USDC);

      expect(await vault.totalSupply()).to.equal(ONE_USDC);
      expect(await capPool.deposits(strategy.address)).to.equal(ONE_USDC);
      expect(await usdcToken.balanceOf(alice.address)).to.equal(parseUnits("999", 6));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_USDC);

      await strategy.harvest();

      const aliceShares = await vault.balanceOf(alice.address);
      await vault.connect(alice).withdraw(aliceShares);

      const claimAmount = parseUnits("1", 6);
      const claimAmountUserPart = claimAmount.sub(parseUnits("0.3", 6));
      // 30% fee to deployer
      const ownerFee = claimAmount.sub(parseUnits("0.7", 6));

      const expectedAliceGmx = ONE_THOUSAND_USDC.add(claimAmountUserPart);

      expect(await vault.totalSupply()).to.equal(0);
      expect(await vault.balanceOf(alice.address)).to.equal(0);
      expect(await usdcToken.balanceOf(alice.address)).to.equal(expectedAliceGmx);
      expect(await usdcToken.balanceOf(deployer.address)).to.equal(ownerFee);
    })

    it("Returns want amounts requested for withdrawal by multiple parties", async () => {
      const {alice, vault, strategy, capPool, bob, usdcToken} = await loadFixture(setupFixture);
      await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
      await usdcToken.connect(bob).approve(vault.address, TEN_USDC);
      
      expect(await vault.totalSupply()).to.equal(0);

      await vault.connect(alice)
        .deposit(ONE_USDC);

      await vault.connect(bob)
        .deposit(ONE_USDC);

      expect(await vault.totalSupply()).to.equal(parseUnits("2", 6));
      expect(await capPool.deposits(strategy.address)).to.equal(parseUnits("2", 6));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_USDC);
      expect(await vault.balanceOf(bob.address)).to.equal(ONE_USDC);

      await vault.connect(alice).withdraw(parseUnits("0.5", 6))
      expect(await usdcToken.balanceOf(alice.address)).to.equal(parseUnits("999.5", 6));
      expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 6));
      expect(await capPool.deposits(strategy.address)).to.equal(parseUnits("1.5", 6));

      await vault.connect(bob).withdraw(parseUnits("0.5, 6"))
      expect(await usdcToken.balanceOf(bob.address)).to.equal(parseUnits("999.5", 6));
      expect(await vault.balanceOf(bob.address)).to.equal(parseUnits("0.5", 6));
      expect(await capPool.deposits(strategy.address)).to.equal(parseUnits("1", 6));

      expect(await vault.totalSupply()).to.equal(parseUnits("1", 6));
      expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 6));
      expect(await vault.balanceOf(bob.address)).to.equal(parseUnits("0.5", 6));
    })

    it("Returns eth amounts requested for withdrawal by multiple parties with additional harvest", async () => {
      const {alice, vault, strategy, capPool, bob, deployer, usdcToken} = await loadFixture(setupFixture);
      await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
      await usdcToken.connect(bob).approve(vault.address, TEN_USDC);
      
      expect(await vault.totalSupply()).to.equal(0);

      await vault.connect(alice)
        .deposit(ONE_USDC);

      await vault.connect(bob)
        .deposit(ONE_USDC);

      expect(await vault.totalSupply()).to.equal(parseUnits("2", 6));
      expect(await capPool.deposits(strategy.address)).to.equal(parseUnits("2", 6));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_USDC);
      expect(await vault.balanceOf(bob.address)).to.equal(ONE_USDC);

      const ownerFee = parseUnits("0.3, 6");

      await strategy.harvest()

      const capPoolBalanceOfStrategyAfterHarvest = parseUnits("3", 6).sub(ownerFee);
      const expectedEthBalanceForAliceAndBob = (ONE_USDC.add(parseUnits("0.35",  6)).div(2));

      // NB after harvest, one LP token is worth 1.35 ETH for each party
      await vault.connect(alice).withdraw(parseUnits("0.5", 6))
      expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 6));
      expect(await capPool.deposits(strategy.address)).to.equal(capPoolBalanceOfStrategyAfterHarvest.sub(expectedEthBalanceForAliceAndBob));

      const capPoolRemainingBalanceOfStrategyAfterAliceWithdraw = capPoolBalanceOfStrategyAfterHarvest.sub(expectedEthBalanceForAliceAndBob);

      await vault.connect(bob).withdraw(parseUnits("0.5",  6))
      expect(await vault.balanceOf(bob.address)).to.equal(parseUnits("0.5", 6));
      expect(await capPool.deposits(strategy.address)).to.equal(capPoolRemainingBalanceOfStrategyAfterAliceWithdraw.sub(expectedEthBalanceForAliceAndBob));

      expect(await vault.totalSupply()).to.equal(parseUnits("1", 6));
      expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 6));
      expect(await vault.balanceOf(bob.address)).to.equal(parseUnits("0.5", 6));
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
        await strategy.setDevFee(parseUnits("0.5", 6));
        expect(await strategy.getDevFee()).to.equal(parseUnits("0.5", 6));
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
