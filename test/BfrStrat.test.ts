import {expect} from "chai";
import {ethers} from "hardhat";
import {BigNumber, BigNumberish} from "ethers";
import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import type {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {
  BFRRouterMock,
  BFRTrackerMock,
  HopPoolStrategy,
  RldTokenVault,
  TokenMock,
  UniswapV3RouterMock
} from "../typechain-types";
import {parseUnits} from "ethers/lib/utils";

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
const ONE_ETH: BigNumber = parseUnits("1", 18);
const TEN_ETH: BigNumber = parseUnits("10", 18);
const ONE_THOUSAND_ETH: BigNumber = parseUnits("1000", 18);

describe("BFR Strategy", () => {
  async function setupFixture() {
    const [deployer, alice, bob]: SignerWithAddress[] =
      await ethers.getSigners();

    const Token = await ethers.getContractFactory("TokenMock");
    const usdcToken = await Token.deploy("USDC", "USDC", 6) as TokenMock;
    await usdcToken.deployed();

    const bfrToken = await Token.deploy("BFR", "BFR", 18) as TokenMock;
    await bfrToken.deployed();

    const arbToken = await Token.deploy("ARB", "ARB", 18) as TokenMock;
    await arbToken.deployed();
    
    const wethToken = await Token.deploy("WETH", "WETH", 18) as TokenMock;
    await wethToken.deployed();

    const UniSwapMock = await ethers.getContractFactory("UniswapV3RouterMock");
    const uniSwapMock: UniswapV3RouterMock = (await UniSwapMock.deploy()) as UniswapV3RouterMock;
    await uniSwapMock.deployed();

    const BFRTrackerMock = await ethers.getContractFactory("BFRTrackerMock");
    const bfrTracker = (await BFRTrackerMock.deploy(bfrToken.address, usdcToken.address)) as BFRTrackerMock;
    await bfrTracker.deployed();

    // Deploy the MockRewardRouter
    const BFRRouterMock = await ethers.getContractFactory("BFRRouterMock");
    const mockRewardRouter = (await BFRRouterMock.deploy(
      bfrToken.address,
      bfrTracker.address,
      bfrTracker.address,
      bfrTracker.address,
      bfrTracker.address,
    )) as BFRRouterMock;
    await mockRewardRouter.deployed();

    const Vault = await ethers.getContractFactory("RldTokenVault");
    const vault: RldTokenVault = (await Vault.deploy('RLD_BFR', 'RLD_BFR_ARB')) as RldTokenVault;
    await vault.deployed();
    //
    const Strategy = await ethers.getContractFactory("StrategyBFR");
    const strategy = await Strategy.deploy(
      mockRewardRouter.address,
      vault.address,
      uniSwapMock.address,
      bfrToken.address,
      arbToken.address,
      usdcToken.address,
      wethToken.address
    ) as HopPoolStrategy;

    console.log({strategy: strategy.address, vault: vault.address})
    await strategy.deployed();
    await vault.initStrategy(strategy.address);
    await bfrToken.mintFor(mockRewardRouter.address, TEN_ETH);
    await bfrToken.mintFor(alice.address, TEN_ETH);
    await bfrToken.mintFor(bob.address, TEN_ETH);
    await bfrToken.mintFor(uniSwapMock.address, ONE_THOUSAND_ETH);

    await usdcToken.mintFor(uniSwapMock.address, ONE_THOUSAND_ETH);
    await usdcToken.mintFor(bfrTracker.address, ONE_THOUSAND_ETH);
    await wethToken.mintFor(uniSwapMock.address, ONE_THOUSAND_ETH);
    await arbToken.mintFor(uniSwapMock.address, ONE_THOUSAND_ETH);

    return {
      vault,
      strategy,
      deployer,
      alice,
      bob,
      usdcToken,
      bfrRouter: mockRewardRouter,
      bfrTracker,
      bfrToken,
    };
  }


  it("Deployer owns the vault and strategy", async () => {
    const {deployer, vault, strategy} = await loadFixture(setupFixture);
    expect(await vault.owner()).to.equal(deployer.address);
    expect(await strategy.owner()).to.equal(deployer.address);
  })

  it("Want is the LP token address", async () => {
    const {vault, strategy, bfrToken} = await loadFixture(setupFixture);
    expect(await vault.want()).to.equal(bfrToken.address);
    expect(await strategy.want()).to.equal(bfrToken.address);
  })

  it("Vault decimals is the same as the token decimals", async () => {
    const {vault, bfrToken} = await loadFixture(setupFixture);
    expect(await vault.decimals()).to.equal(await bfrToken.decimals());
  })
  //
    describe("Deposit", () => {
      it("Depositing into vault sends want amount to strategy and stakes into pool under the strategy's address, mints token to alice", async () => {
        const {alice, vault, bfrTracker, bfrToken} = await loadFixture(setupFixture);
        expect(await vault.totalSupply()).to.equal(0);
        await bfrToken.connect(alice).approve(vault.address, ONE_ETH);
        await vault.connect(alice)
          .deposit(ONE_ETH);

        expect(await vault.totalSupply()).to.equal(ONE_ETH);
        expect(await bfrToken.balanceOf(bfrTracker.address)).to.equal(ONE_ETH);
        expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETH);
      })

      it("Mints token for bob and alice in proportion to their deposits", async () => {
        const {alice, bob, vault, strategy, bfrTracker, bfrToken} = await loadFixture(setupFixture);
        await bfrToken.connect(alice).approve(vault.address, ONE_ETH);
        await vault.connect(alice)
          .deposit(ONE_ETH);

        await bfrToken.connect(bob).approve(vault.address, ONE_ETH);
        await vault.connect(bob)
          .deposit(ONE_ETH);

        expect(await bfrToken.balanceOf(alice.address)).to.equal(TEN_ETH.sub(ONE_ETH));
        expect(await bfrToken.balanceOf(bob.address)).to.equal(TEN_ETH.sub(ONE_ETH));
        expect(await bfrToken.balanceOf(bfrTracker.address)).to.equal(ONE_ETH.mul(2));
        expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETH);
        expect(await vault.balanceOf(bob.address)).to.equal(ONE_ETH);
        expect(await vault.totalSupply()).to.equal(ONE_ETH.mul(2));
      })
      //
      it("Deposits are disabled when the strat is stopped", async () => {
        const {alice, vault, strategy, bfrToken, bfrTracker} = await loadFixture(setupFixture);
        const stopTx = await strategy.stop();
        await bfrToken.connect(alice).approve(vault.address, ONE_ETH);
        await expect(vault.connect(alice).deposit(ONE_ETH)).to.be.revertedWith("Stoppable: stopped");
        await expect(stopTx).to.emit(strategy, "Stopped");
        await expect(await bfrToken.allowance(strategy.address, bfrTracker.address)).to.equal(0);
      })
      //
      it("Deposits are enabled when the strat is resumed", async () => {
        const {alice, vault, strategy, bfrToken} = await loadFixture(setupFixture);
        await strategy.stop();
        const resumeTx = await strategy.resume();
        await bfrToken.connect(alice).approve(vault.address, TEN_ETH);
        await vault.connect(alice).deposit(ONE_ETH)
        await expect(resumeTx).to.emit(strategy, "Resumed");
        expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETH);
      })
    })
  //
    describe("Harvest", () => {
      it("Compounds, claims and restakes, owner takes 30% of pf, rest goes back into strategy", async () => {
        const {alice, vault, strategy,  bfrTracker, bfrToken, deployer} = await loadFixture(setupFixture);
        await bfrToken.connect(alice).approve(vault.address, TEN_ETH);
        await vault.connect(alice).deposit(ONE_ETH);

        expect(await vault.totalSupply()).to.equal(ONE_ETH);
        expect(await bfrToken.balanceOf(bfrTracker.address)).to.equal(ONE_ETH);
        expect(await bfrToken.balanceOf(alice.address)).to.equal(TEN_ETH.sub(ONE_ETH));
        expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETH);

        const txReceipt = await strategy.harvest();

        expect(await bfrToken.balanceOf(deployer.address)).to.equal(parseUnits("0.05", 18));
        expect(await bfrToken.balanceOf(bfrTracker.address)).to.equal(parseUnits("1.95", 18));
      })

  //     it("Sends performance fees to staking contract address when a protocolStakingFee is set", async () => {
  //
  //     })
  //   })
  //
  //   describe("Withdraw", () => {
  //     it("Withdrawing after harvest returns tokens to depositor with additional harvest", async () => {
  //       const {alice, vault, strategy, hopPool, usdcToken, deployer} = await loadFixture(setupFixture);
  //       expect(await vault.totalSupply()).to.equal(0);
  //       await usdcToken.connect(alice).approve(vault.address, TEN_ETH);
  //       await vault.connect(alice)
  //         .deposit(ONE_ETH);
  //
  //       expect(await vault.totalSupply()).to.equal(ONE_ETH);
  //       expect(await hopPool.deposits(strategy.address)).to.equal(ONE_ETH);
  //       expect(await usdcToken.balanceOf(alice.address)).to.equal(parseUnits("999", 6));
  //       expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETH);
  //
  //       await strategy.harvest();
  //
  //       const aliceShares = await vault.balanceOf(alice.address);
  //       await vault.connect(alice).withdraw(aliceShares);
  //
  //       const claimAmount = parseUnits("1", 6);
  //       const claimAmountUserPart = claimAmount.sub(parseUnits("0.05", 6));
  //       // 5% fee to deployer
  //       const ownerFee = claimAmount.sub(parseUnits("0.95", 6));
  //
  //       const expectedAliceGmx = ONE_THOUSAND_USDC.add(claimAmountUserPart);
  //
  //       expect(await vault.totalSupply()).to.equal(0);
  //       expect(await vault.balanceOf(alice.address)).to.equal(0);
  //       expect(await usdcToken.balanceOf(alice.address)).to.equal(expectedAliceGmx);
  //       expect(await usdcToken.balanceOf(deployer.address)).to.equal(ownerFee);
  //     })
  //
  //     it("Withdraw in proportion to the shares sent as an argument", async () => {
  //       const {alice, vault, strategy, hopPool, usdcToken, deployer} = await loadFixture(setupFixture);
  //       expect(await vault.totalSupply()).to.equal(0);
  //       await usdcToken.connect(alice).approve(vault.address, TEN_ETH);
  //       await vault.connect(alice)
  //         .deposit(ONE_ETH);
  //
  //       expect(await vault.totalSupply()).to.equal(ONE_ETH);
  //       expect(await hopPool.deposits(strategy.address)).to.equal(ONE_ETH);
  //       expect(await usdcToken.balanceOf(alice.address)).to.equal(parseUnits("999", 6));
  //       expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETH);
  //
  //       await strategy.harvest();
  //
  //       const aliceShares = await vault.balanceOf(alice.address);
  //       await vault.connect(alice).withdraw(aliceShares.div(2));
  //
  //       const claimAmount = parseUnits("1", 6);
  //       const claimAmountUserPart = claimAmount.sub(parseUnits("0.05", 6));
  //       const ownerFee = claimAmount.sub(parseUnits("0.95", 6));
  //       const expectedAliceWithdrawAmount = parseUnits("999.5", 6).add(claimAmountUserPart.div(2));
  //
  //       expect(await vault.totalSupply()).to.equal(parseUnits("0.5", 18));
  //       expect(await usdcToken.balanceOf(alice.address)).to.equal(expectedAliceWithdrawAmount);
  //       expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 18));
  //       expect(await usdcToken.balanceOf(deployer.address)).to.equal(ownerFee);
  //     })
  //
  //     it("Returns want amounts requested for withdrawal by multiple parties", async () => {
  //       const {alice, vault, strategy, hopPool, bob, usdcToken} = await loadFixture(setupFixture);
  //       await usdcToken.connect(alice).approve(vault.address, TEN_ETH);
  //       await usdcToken.connect(bob).approve(vault.address, TEN_ETH);
  //
  //       expect(await vault.totalSupply()).to.equal(0);
  //
  //       await vault.connect(alice)
  //         .deposit(ONE_ETH);
  //
  //       await vault.connect(bob)
  //         .deposit(ONE_ETH);
  //
  //       expect(await vault.totalSupply()).to.equal(parseUnits("2", 18));
  //       expect(await hopPool.deposits(strategy.address)).to.equal(parseUnits("2", 18));
  //       expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETH);
  //       expect(await vault.balanceOf(bob.address)).to.equal(ONE_ETH);
  //
  //       await vault.connect(alice).withdraw(parseUnits("0.5", 18))
  //       expect(await usdcToken.balanceOf(alice.address)).to.equal(parseUnits("999.5", 6));
  //       expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 18));
  //       expect(await hopPool.deposits(strategy.address)).to.equal(parseUnits("1.5", 18));
  //
  //       await vault.connect(bob).withdraw(parseUnits("0.5", 18))
  //       expect(await usdcToken.balanceOf(bob.address)).to.equal(parseUnits("999.5", 6));
  //       expect(await vault.balanceOf(bob.address)).to.equal(parseUnits("0.5", 18));
  //       expect(await hopPool.deposits(strategy.address)).to.equal(parseUnits("1", 18));
  //
  //       expect(await vault.totalSupply()).to.equal(parseUnits("1", 18));
  //       expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 18));
  //       expect(await vault.balanceOf(bob.address)).to.equal(parseUnits("0.5", 18));
  //     })
  //
  //     it("Returns want amounts requested for withdrawal by multiple parties with additional harvest", async () => {
  //       const {alice, vault, strategy, hopPool, bob, deployer, usdcToken} = await loadFixture(setupFixture);
  //       await usdcToken.connect(alice).approve(vault.address, TEN_ETH);
  //       await usdcToken.connect(bob).approve(vault.address, TEN_ETH);
  //
  //       expect(await vault.totalSupply()).to.equal(0);
  //
  //       await vault.connect(alice)
  //         .deposit(ONE_ETH);
  //
  //       await vault.connect(bob)
  //         .deposit(ONE_ETH);
  //
  //       expect(await vault.totalSupply()).to.equal(parseUnits("2", 18));
  //       expect(await hopPool.deposits(strategy.address)).to.equal(parseUnits("2", 18));
  //       expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETH);
  //       expect(await vault.balanceOf(bob.address)).to.equal(ONE_ETH);
  //
  //       const ownerFee = parseUnits("0.05", 18);
  //
  //       await strategy.harvest()
  //
  //       const hopPoolBalanceOfStrategyAfterHarvest = parseUnits("3", 18).sub(ownerFee);
  //       const expectedEthBalanceForAliceAndBob = (ONE_ETH.add(parseUnits("0.475", 18)).div(2));
  //
  //       // NB after harvest, one LP token is worth 1.35 ETH for each party
  //       await vault.connect(alice).withdraw(parseUnits("0.5", 18))
  //       expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 18));
  //       expect(await hopPool.deposits(strategy.address)).to.equal(hopPoolBalanceOfStrategyAfterHarvest.sub(expectedEthBalanceForAliceAndBob));
  //
  //       const hopPoolRemainingBalanceOfStrategyAfterAliceWithdraw = hopPoolBalanceOfStrategyAfterHarvest.sub(expectedEthBalanceForAliceAndBob);
  //
  //       await vault.connect(bob).withdraw(parseUnits("0.5", 18))
  //       expect(await vault.balanceOf(bob.address)).to.equal(parseUnits("0.5", 18));
  //       expect(await hopPool.deposits(strategy.address)).to.equal(hopPoolRemainingBalanceOfStrategyAfterAliceWithdraw.sub(expectedEthBalanceForAliceAndBob));
  //
  //       expect(await vault.totalSupply()).to.equal(parseUnits("1", 18));
  //       expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 18));
  //       expect(await vault.balanceOf(bob.address)).to.equal(parseUnits("0.5", 18));
  //     })
  //
  //   })
  //
  //   describe("Utils", () => {
  //     describe("Pausing and un-pausing", () => {
  //
  //       it("Deposits are disabled when the strat is stopped", async () => {
  //         const {alice, vault, strategy, usdcToken} = await loadFixture(setupFixture);
  //         await strategy.stop();
  //         await usdcToken.connect(alice).approve(vault.address, TEN_ETH);
  //         const depositTx = vault.connect(alice).deposit(ONE_ETH)
  //         await expect(depositTx).to.revertedWith('Stoppable: stopped');
  //       })
  //
  //       it("Removes allowances for the Hop Pools when paused", async () => {
  //
  //       })
  //
  //       it("Reverts when depositing while paused", async () => {
  //
  //       })
  //
  //       it("Allows users to withdraw while paused", async () => {
  //
  //       })
  //     })
  //
  //     describe("Panic", () => {
  //       it("Collects rewards from the strategy and withdraws all funds from the pool", async () => {
  //
  //       })
  //
  //       it("Pauses the strategy", async () => {
  //
  //       })
  //     })
  //
  //     describe("Performance Fees", () => {
  //       it("Can change the fee for the devs", async () => {
  //         const {strategy} = await loadFixture(setupFixture);
  //         await strategy.setDevFee(parseUnits("0.5", 6));
  //         expect(await strategy.getDevFee()).to.equal(parseUnits("0.5", 6));
  //       })
  //
  //       it("Can change the fee for the staking contract", async () => {
  //         const {strategy} = await loadFixture(setupFixture);
  //         await strategy.setStakingFee(parseUnits("0.1", 6));
  //         expect(await strategy.getStakingFee()).to.equal(parseUnits("0.1", 6));
  //       })
  //
  //       it("Only the owner can modify fees", async () => {
  //         const {strategy, alice} = await loadFixture(setupFixture);
  //         await expect(strategy.connect(alice).setDevFee(parseEther("0.5"))).to.be.revertedWith("Manageable: caller is not the manager or owner");
  //       })
  //
  //       it("Combined fees cannot exceed 50%", async () => {
  //         const {strategy} = await loadFixture(setupFixture);
  //         await strategy.setDevFee(parseUnits("0.5", 6));
  //         await expect(strategy.setStakingFee(parseUnits("0.001", 6))).to.be.revertedWith("fee too high")
  //       })
  //     })
  })
});
