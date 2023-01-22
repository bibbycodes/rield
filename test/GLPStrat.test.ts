import {expect} from "chai";
import {ethers} from "hardhat";
import {BigNumber, BigNumberish} from "ethers";
import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import type {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {BeefyVaultV7, GLPManager, GMXRouter, GMXTracker} from "../typechain-types";
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
const ONE_THOUSAND_ETHER: BigNumber = parseEther("1000");

describe("GLP", () => {
  async function setupFixture() {
    const [deployer, alice, bob]: SignerWithAddress[] =
      await ethers.getSigners();

    const Token = await ethers.getContractFactory("TokenMock");

    const ethToken = await Token.deploy("WETH", "WETH", 18);
    await ethToken.deployed();

    const gmxToken = await Token.deploy("GMX", "GMX", 18);
    await gmxToken.deployed();
    //
    const GLPRewardTracker = await ethers.getContractFactory("GMXTracker");
    const glpRewardTracker: GMXTracker = (await GLPRewardTracker.deploy()) as GMXTracker;
    await glpRewardTracker.deployed();
    //
    const GMXRewardTracker = await ethers.getContractFactory("GMXTracker");
    const gmxRewardTracker: GMXTracker = (await GMXRewardTracker.deploy()) as GMXTracker;
    await gmxRewardTracker.deployed();
    //
    const GLPManager = await ethers.getContractFactory("GLPManager");
    const glpManager: GLPManager = (await GLPManager.deploy()) as GLPManager;
    await glpManager.deployed();
    
    const glpToken = glpManager;

    const GMXRouter = await ethers.getContractFactory("GMXRouter");
    const gmxRouter: GMXRouter = (await GMXRouter.deploy(
      glpRewardTracker.address,
      gmxRewardTracker.address,
      glpManager.address,
      ethToken.address,
      gmxToken.address,
    )) as GMXRouter;
    
    await gmxRouter.deployed();

    const minter: GMXRouter = (await GMXRouter.deploy(
      glpRewardTracker.address,
      gmxRewardTracker.address,
      glpManager.address,
      ethToken.address,
      gmxToken.address,
    )) as GMXRouter;

    const Vault = await ethers.getContractFactory("BeefyVaultV7");
    const vault: BeefyVaultV7 = (await Vault.deploy()) as BeefyVaultV7;
    await vault.deployed();

    const Strategy = await ethers.getContractFactory("StrategyGLP");
    const strategy = await Strategy.deploy(
      glpToken.address,
      ethToken.address,
      minter.address,
      gmxRouter.address,
      vault.address,
    );
    await strategy.deployed();

    await vault.initialize(strategy.address, "RLD_GLP", "RLD_GLP")

    await ethToken.mintFor(gmxRouter.address, TEN_ETHER);
    await ethToken.mintFor(alice.address, TEN_ETHER);
    await ethToken.mintFor(bob.address, TEN_ETHER);
    await glpToken.mintFor(alice.address, TEN_ETHER);
    await glpToken.mintFor(bob.address, TEN_ETHER);

    return {
      gmxRouter,
      vault,
      strategy,
      deployer,
      glpManager,
      alice,
      bob,
      ethToken,
      eth: ethToken,
      glp: glpToken
    };
  }

  it("Deployer owns the vault and strategy", async () => {
    const {deployer, vault, strategy} = await loadFixture(setupFixture);
    expect(await vault.owner()).to.equal(deployer.address);
    expect(await strategy.owner()).to.equal(deployer.address);
  })

  it("Want is the GLP token address", async () => {
    const {vault, strategy, glp} = await loadFixture(setupFixture);
    expect(await vault.want()).to.equal(glp.address);
    expect(await strategy.want()).to.equal(glp.address);
  })
  
  it("Vault decimals is the same as the token decimals", async () => {
    const {vault, ethToken} = await loadFixture(setupFixture);
    expect(await vault.decimals()).to.equal(await ethToken.decimals());
  })

  describe("Deposit", () => {
    it("Depositing into vault mints token to alice, transfers GLP to strategy", async () => {
      const {alice, vault, strategy, glp} = await loadFixture(setupFixture);
      expect(await vault.totalSupply()).to.equal(0);
      await glp.connect(alice).approve(vault.address, TEN_ETHER);
      await vault.connect(alice)
        .deposit(ONE_ETHER);
      expect(await glp.balanceOf(strategy.address)).to.equal(ONE_ETHER);
      expect(await vault.totalSupply()).to.equal(ONE_ETHER);
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);
    })

    it("Mints token for bob and alice in proportion to their deposits", async () => {
      const {alice, bob, vault, glp, strategy} = await loadFixture(setupFixture);
      await glp.connect(alice).approve(vault.address, ONE_ETHER);
      await vault.connect(alice)
        .deposit(ONE_ETHER);

      await glp.connect(bob).approve(vault.address, ONE_ETHER);
      await vault.connect(bob)
        .deposit(ONE_ETHER);

      expect(await vault.totalSupply()).to.equal(parseEther("2"));
      expect(await glp.balanceOf(alice.address)).to.equal(parseEther("9"));
      expect(await glp.balanceOf(bob.address)).to.equal(parseEther("9"));
      expect(await glp.balanceOf(strategy.address)).to.equal(parseEther("2"));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);
      expect(await vault.balanceOf(bob.address)).to.equal(ONE_ETHER);
    })
    
    it("Deposits are disabled when the strat is paused", async () => {
      const {alice, vault, strategy, glp} = await loadFixture(setupFixture);
      await strategy.pause();
      await glp.connect(alice).approve(vault.address, ONE_ETHER);
      await expect(vault.connect(alice).deposit(ONE_ETHER)).to.be.revertedWith("Pausable: paused");
    })
  })

  describe("Harvest", () => {
    it("Claims and re-stakes, owner takes 3% of pf, rest goes back into strategy", async () => {
      const {alice, vault, strategy, glp, ethToken,  deployer} = await loadFixture(setupFixture);
      await glp.connect(alice).approve(vault.address, TEN_ETHER);
      await vault.connect(alice).deposit(ONE_ETHER);
      
      expect(await vault.totalSupply()).to.equal(ONE_ETHER);
      expect(await glp.balanceOf(alice.address)).to.equal(parseEther("9"));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);

      await strategy.harvest();
      expect(await ethToken.balanceOf(deployer.address)).to.equal(parseEther("0.03"));
      expect(await glp.balanceOf(strategy.address)).to.equal(parseEther("1.97"));
    })
  })

  describe("Withdraw", () => {
    it("Withdrawing after harvest returns tokens to depositor with additional harvest", async () => {
      const {alice, vault, strategy, ethToken, deployer, glp} = await loadFixture(setupFixture);
      expect(await vault.totalSupply()).to.equal(0);
      await glp.connect(alice).approve(vault.address, TEN_ETHER);
      await vault.connect(alice)
        .deposit(ONE_ETHER);

      expect(await vault.totalSupply()).to.equal(ONE_ETHER);
      expect(await glp.balanceOf(alice.address)).to.equal(parseEther("9"));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);

      await strategy.harvest();

      const aliceShares = await vault.balanceOf(alice.address);
      await vault.connect(alice).withdraw(aliceShares);

      const claimAmount = parseEther("1");
      const claimAmountUserPart = claimAmount.sub(parseEther("0.03"));
      // 3% fee to deployer
      const ownerFee = claimAmount.sub(parseEther("0.97"));

      const expectedAliceGLP = TEN_ETHER.add(claimAmountUserPart);

      expect(await vault.totalSupply()).to.equal(0);
      expect(await vault.balanceOf(alice.address)).to.equal(0);
      expect(await glp.balanceOf(alice.address)).to.equal(expectedAliceGLP);
      expect(await ethToken.balanceOf(deployer.address)).to.equal(ownerFee);
    })

    it("Withdraw in proportion to the requested withdraw amount", async () => {
      const {alice, vault, strategy, glp, ethToken, deployer} = await loadFixture(setupFixture);
      expect(await vault.totalSupply()).to.equal(0);
      await glp.connect(alice).approve(vault.address, TEN_ETHER);
      await vault.connect(alice)
        .deposit(ONE_ETHER);

      expect(await vault.totalSupply()).to.equal(ONE_ETHER);
      expect(await glp.balanceOf(alice.address)).to.equal(parseEther("9"));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);

      await strategy.harvest();

      const aliceShares = await vault.balanceOf(alice.address);
      await vault.connect(alice).withdraw(aliceShares.div(2));

      const claimAmount = parseEther("1");
      const claimAmountUserPart = claimAmount.sub(parseEther("0.03"));
      // 3% fee to deployer
      const ownerFee = claimAmount.sub(parseEther("0.97"));
      const expectedAliceWithdrawAmount = parseEther("9.5").add(claimAmountUserPart.div(2));

      expect(await vault.totalSupply()).to.equal(parseEther("0.5"));
      expect(await glp.balanceOf(alice.address)).to.equal(expectedAliceWithdrawAmount);
      expect(await vault.balanceOf(alice.address)).to.equal(parseEther("0.5"));
      expect(await ethToken.balanceOf(deployer.address)).to.equal(ownerFee);
    })
    
    it("Returns want amounts requested for withdrawal by multiple parties", async () => {
      const {alice, bob, vault, strategy, glp} = await loadFixture(setupFixture);
      expect(await vault.totalSupply()).to.equal(0);
      await glp.connect(alice).approve(vault.address, TEN_ETHER);
      expect(await vault.totalSupply()).to.equal(0);
      await glp.connect(bob).approve(vault.address, TEN_ETHER);
      
      await vault.connect(alice)
        .deposit(ONE_ETHER);

      await vault.connect(bob)
        .deposit(ONE_ETHER);
      

      expect(await vault.totalSupply()).to.equal(parseEther("2"));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);
      expect(await vault.balanceOf(bob.address)).to.equal(ONE_ETHER);

      await vault.connect(alice).withdraw(parseEther("0.5"))
      expect(await glp.balanceOf(alice.address)).to.equal(parseEther("9.5"));
      expect(await vault.balanceOf(alice.address)).to.equal(parseEther("0.5"));
      expect(await glp.balanceOf(strategy.address)).to.equal(parseEther("1.5"));

      await vault.connect(bob).withdraw(parseEther("0.5"))
      expect(await glp.balanceOf(bob.address)).to.equal(parseEther("9.5"));
      expect(await vault.balanceOf(bob.address)).to.equal(parseEther("0.5"));

      expect(await vault.totalSupply()).to.equal(parseEther("1"));
      expect(await vault.balanceOf(alice.address)).to.equal(parseEther("0.5"));
      expect(await vault.balanceOf(bob.address)).to.equal(parseEther("0.5"));
      expect(await glp.balanceOf(strategy.address)).to.equal(parseEther("1"));
    })
    
    it("Returns want amounts requested for withdrawal by multiple parties with additional harvest", async () => {
      const {alice, bob, vault, strategy, glp, ethToken} = await loadFixture(setupFixture);
      await glp.connect(alice).approve(vault.address, TEN_ETHER);
      await glp.connect(bob).approve(vault.address, TEN_ETHER);

      expect(await vault.totalSupply()).to.equal(0);

      await vault.connect(alice)
        .deposit(ONE_ETHER);

      await vault.connect(bob)
        .deposit(ONE_ETHER);

      expect(await vault.totalSupply()).to.equal(parseEther("2"));
      expect(await glp.balanceOf(strategy.address)).to.equal(parseEther("2"));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);
      expect(await vault.balanceOf(bob.address)).to.equal(ONE_ETHER);

      const ownerFee = parseEther("0.03");

      await strategy.harvest()

      const glpPoolBalanceOfStrategyAfterHarvest = parseEther("3").sub(ownerFee);
      const expectedGlpBalanceForAliceAndBob = (ONE_ETHER.add(parseEther("0.485")).div(2));

      // NB after harvest, one LP token is worth 1.35 ETH for each party
      await vault.connect(alice).withdraw(parseEther("0.5"))
      expect(await vault.balanceOf(alice.address)).to.equal(parseEther("0.5"));
      expect(await glp.balanceOf(strategy.address)).to.equal(glpPoolBalanceOfStrategyAfterHarvest.sub(expectedGlpBalanceForAliceAndBob));

      const capPoolRemainingBalanceOfStrategyAfterAliceWithdraw = glpPoolBalanceOfStrategyAfterHarvest.sub(expectedGlpBalanceForAliceAndBob);

      await vault.connect(bob).withdraw(parseEther("0.5"))
      expect(await vault.balanceOf(bob.address)).to.equal(parseEther("0.5"));
      expect(await glp.balanceOf(strategy.address)).to.equal(capPoolRemainingBalanceOfStrategyAfterAliceWithdraw.sub(expectedGlpBalanceForAliceAndBob));

      expect(await vault.totalSupply()).to.equal(parseEther("1"));
      expect(await vault.balanceOf(alice.address)).to.equal(parseEther("0.5"));
      expect(await vault.balanceOf(bob.address)).to.equal(parseEther("0.5"));
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
});
