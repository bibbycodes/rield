import {expect} from "chai";
import {ethers} from "hardhat";
import {BigNumber, BigNumberish} from "ethers";
import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import type {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {
  HopPoolMock,
  HopPoolStrategy,
  HopTrackerMock,
  RldEthLpTokenVault,
  TokenMock,
  UniswapV3RouterMock,
  WETHMock
} from "../typechain-types";
import {parseEther, parseUnits} from "ethers/lib/utils";

const closeTo = async (
  a: BigNumberish,
  b: BigNumberish,
  margin: BigNumberish
) => {
  expect(a).to.be.closeTo(b, margin);
};

const ONE_ETH: BigNumber = parseUnits("1", 18);
const ONE_THOUSAND_ETH: BigNumber = parseUnits("1000", 18);

describe("HOP ERC20 Strategy", () => {
  async function setupFixture() {
    const [deployer, alice, bob]: SignerWithAddress[] =
      await ethers.getSigners();

    const WETH = await ethers.getContractFactory("WETHMock");
    const wethToken = await WETH.deploy() as WETHMock;
    await wethToken.deployed();

    const Token = await ethers.getContractFactory("TokenMock");
    const hopTokenVariant = await Token.deploy("hWETH", "hWETH", 18) as TokenMock;
    await hopTokenVariant.deployed();

    const lpToken = await Token.deploy("ETH-hETH", "ETH-hETH-LP", 18) as TokenMock;
    await lpToken.deployed();

    const rewardToken = await Token.deploy("HOP", "HOP", 18) as TokenMock;
    await rewardToken.deployed();

    const HopTrackerMock = await ethers.getContractFactory("HopTrackerMock");
    const hopTrackerMock: HopTrackerMock = (
      await HopTrackerMock.deploy(wethToken.address,
        hopTokenVariant.address,
        lpToken.address)) as HopTrackerMock;
    await hopTrackerMock.deployed();

    const HopPoolMock = await ethers.getContractFactory("HopPoolMock");
    const hopPoolMock: HopPoolMock = (await HopPoolMock.deploy(lpToken.address, rewardToken.address)) as HopPoolMock;
    await hopPoolMock.deployed();

    const UniSwapMock = await ethers.getContractFactory("UniswapV3RouterMock");
    const uniSwapMock: UniswapV3RouterMock = (await UniSwapMock.deploy()) as UniswapV3RouterMock;
    await uniSwapMock.deployed();

    const Vault = await ethers.getContractFactory("RldEthLpTokenVault");
    const vault: RldEthLpTokenVault = (await Vault.deploy('RLD_TOKEN', 'RLD Token Vault LP')) as RldEthLpTokenVault;
    await vault.deployed();

    const SingleStakeStrategy = await ethers.getContractFactory("HopPoolStrategy");
    const strategy = await SingleStakeStrategy.deploy(
      vault.address,
      hopPoolMock.address,
      hopTrackerMock.address,
      rewardToken.address,
      wethToken.address,
      hopTokenVariant.address,
      uniSwapMock.address
    ) as HopPoolStrategy;

    await strategy.deployed();

    await vault.initStrategy(strategy.address);

    // await usdcToken.mintFor(hopTrackerMock.address, ONE_THOUSAND_ETH);
    // await usdcToken.mintFor(alice.address, ONE_THOUSAND_ETH);
    // await usdcToken.mintFor(bob.address, ONE_THOUSAND_ETH);
    // await usdcToken.mintFor(uniSwapMock.address, ONE_THOUSAND_ETH);

    await lpToken.mintFor(hopTrackerMock.address, ONE_THOUSAND_ETH);

    await hopTokenVariant.mintFor(hopTrackerMock.address, ONE_THOUSAND_ETH);
    await hopTokenVariant.mintFor(hopPoolMock.address, ONE_THOUSAND_ETH);
    await hopTokenVariant.mintFor(uniSwapMock.address, ONE_THOUSAND_ETH);

    await rewardToken.mintFor(hopTrackerMock.address, ONE_THOUSAND_ETH);
    await rewardToken.mintFor(hopPoolMock.address, ONE_THOUSAND_ETH);
    await rewardToken.mintFor(uniSwapMock.address, ONE_THOUSAND_ETH);

    return {
      vault,
      strategy,
      deployer,
      alice,
      bob,
      wethToken,
      lpToken,
      rewardToken,
      hopPool: hopPoolMock,
      hopTracker: hopTrackerMock
    };
  }


  it("Deployer owns the vault and strategy", async () => {
    const {deployer, vault, strategy} = await loadFixture(setupFixture);
    expect(await vault.owner()).to.equal(deployer.address);
    expect(await strategy.owner()).to.equal(deployer.address);
  })

  it("Want is the LP token address", async () => {
    const {vault, strategy, lpToken} = await loadFixture(setupFixture);
    expect(await vault.want()).to.equal(lpToken.address);
    expect(await strategy.want()).to.equal(lpToken.address);
  })

  it("Vault decimals is the same as the token decimals", async () => {
    const {vault, lpToken} = await loadFixture(setupFixture);
    expect(await vault.decimals()).to.equal(await lpToken.decimals());
  })

  describe("Depositing Input token", () => {
    it("Depositing into vault sends want amount to strategy and stakes into pool under the strategy's address, mints token to alice", async () => {
      const {alice, vault, strategy, hopTracker} = await loadFixture(setupFixture);
      expect(await vault.totalSupply()).to.equal(0);
      await vault.connect(alice).deposit({value: ONE_ETH});

      expect(await vault.totalSupply()).to.equal(ONE_ETH);
      expect(await hopTracker.deposits(strategy.address)).to.equal(ONE_ETH);
      expect(await alice.getBalance()).to.equal(parseUnits("999", 18));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETH);
    })

    it("Mints token for bob and alice in proportion to their deposits", async () => {
      const {alice, bob, vault, strategy, hopPool} = await loadFixture(setupFixture);
      await vault.connect(alice).deposit({value: ONE_ETH});

      await vault.connect(bob).deposit({value: ONE_ETH});

      expect(await vault.totalSupply()).to.equal(parseUnits("2", 18));
      expect(await hopPool.deposits(strategy.address)).to.equal(parseUnits("2", 18));
      expect(await bob.getBalance()).to.equal(parseUnits("999", 18));
      expect(await alice.getBalance()).to.equal(parseUnits("999", 18));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETH);
      expect(await vault.balanceOf(bob.address)).to.equal(ONE_ETH);
    })

    it("Deposits are disabled when the strat is stopped", async () => {
      const {alice, vault, strategy, hopPool, wethToken} = await loadFixture(setupFixture);
      const stopTx = await strategy.stop();
      await expect(vault.connect(alice).deposit({value: ONE_ETH})).to.be.revertedWith("Stoppable: stopped");
      await expect(stopTx).to.emit(strategy, "Stopped");
      await expect(await wethToken.allowance(strategy.address, hopPool.address)).to.equal(0);
    })

    it("Deposits are enabled when the strat is resumed", async () => {
      const {alice, vault, strategy} = await loadFixture(setupFixture);
      await strategy.stop();
      const resumeTx = await strategy.resume();
      await vault.connect(alice).deposit(ONE_ETH)
      await expect(resumeTx).to.emit(strategy, "Resumed");
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETH);
    })
  })

  describe("Harvest", () => {
    it("Compounds, claims and restakes, owner takes 30% of pf, rest goes back into strategy", async () => {
      const {alice, vault, strategy, hopPool, hopTracker, deployer, wethToken} = await loadFixture(setupFixture);
      await vault.connect(alice).deposit({value: ONE_ETH});

      expect(await vault.totalSupply()).to.equal(ONE_ETH);
      expect(await hopPool.deposits(strategy.address)).to.equal(ONE_ETH);
      expect(await alice.getBalance()).to.equal(parseUnits("999", 18));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETH);

      const txReceipt = await strategy.harvest();

      expect(await wethToken.balanceOf(deployer.address)).to.equal(parseUnits("0.05", 18));
      expect(await hopPool.deposits(strategy.address)).to.equal(parseUnits("1.95", 18));
      await expect(txReceipt).to.emit(hopTracker, "Deposit")
      await expect(txReceipt).to.emit(hopPool, "CollectRewards")
    })

    it("Sends performance fees to staking contract address when a protocolStakingFee is set", async () => {

    })
  })

  describe("Withdraw", () => {
    it("Withdrawing after harvest returns tokens to depositor with additional harvest", async () => {
      const {alice, vault, strategy, hopPool, deployer, wethToken} = await loadFixture(setupFixture);
      expect(await vault.totalSupply()).to.equal(0);
      await vault.connect(alice).deposit({value: ONE_ETH});

      expect(await vault.totalSupply()).to.equal(ONE_ETH);
      expect(await hopPool.deposits(strategy.address)).to.equal(ONE_ETH);
      expect(await alice.getBalance()).to.equal(parseUnits("999", 18));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETH);

      await strategy.harvest();

      const aliceShares = await vault.balanceOf(alice.address);
      await vault.connect(alice).withdraw(aliceShares);

      const claimAmount = parseUnits("1", 18);
      const claimAmountUserPart = claimAmount.sub(parseUnits("0.05", 18));
      // 5% fee to deployer
      const ownerFee = claimAmount.sub(parseUnits("0.95", 18));

      const expectedAliceGmx = ONE_THOUSAND_ETH.add(claimAmountUserPart);

      expect(await vault.totalSupply()).to.equal(0);
      expect(await vault.balanceOf(alice.address)).to.equal(0);
      expect(await alice.getBalance()).to.equal(expectedAliceGmx);
      expect(await wethToken.balanceOf(deployer.address)).to.equal(ownerFee);
    })

    it("Withdraw in proportion to the shares sent as an argument", async () => {
      const {alice, vault, strategy, hopPool, deployer, wethToken} = await loadFixture(setupFixture);
      expect(await vault.totalSupply()).to.equal(0);
      await vault.connect(alice).deposit({value: ONE_ETH});

      expect(await vault.totalSupply()).to.equal(ONE_ETH);
      expect(await hopPool.deposits(strategy.address)).to.equal(ONE_ETH);
      expect(await alice.getBalance()).to.equal(parseUnits("999", 18));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETH);

      await strategy.harvest();

      const aliceShares = await vault.balanceOf(alice.address);
      await vault.connect(alice).withdraw(aliceShares.div(2));

      const claimAmount = parseUnits("1", 18);
      const claimAmountUserPart = claimAmount.sub(parseUnits("0.05", 18));
      const ownerFee = claimAmount.sub(parseUnits("0.95", 18));
      const expectedAliceWithdrawAmount = parseUnits("999.5", 18).add(claimAmountUserPart.div(2));

      expect(await vault.totalSupply()).to.equal(parseUnits("0.5", 18));
      expect(await alice.getBalance()).to.equal(expectedAliceWithdrawAmount);
      expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 18));
      expect(await wethToken.balanceOf(deployer.address)).to.equal(ownerFee);
    })

    it("Returns want amounts requested for withdrawal by multiple parties", async () => {
      const {alice, vault, strategy, hopPool, bob} = await loadFixture(setupFixture);
      expect(await vault.totalSupply()).to.equal(0);

      await vault.connect(alice).deposit({value: ONE_ETH});
      await vault.connect(bob).deposit({value: ONE_ETH});

      expect(await vault.totalSupply()).to.equal(parseUnits("2", 18));
      expect(await hopPool.deposits(strategy.address)).to.equal(parseUnits("2", 18));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETH);
      expect(await vault.balanceOf(bob.address)).to.equal(ONE_ETH);

      await vault.connect(alice).withdraw(parseUnits("0.5", 18))
      expect(await alice.getBalance()).to.equal(parseUnits("999.5", 18));
      expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 18));
      expect(await hopPool.deposits(strategy.address)).to.equal(parseUnits("1.5", 18));

      await vault.connect(bob).withdraw(parseUnits("0.5", 18))
      expect(await bob.getBalance()).to.equal(parseUnits("999.5", 18));
      expect(await vault.balanceOf(bob.address)).to.equal(parseUnits("0.5", 18));
      expect(await hopPool.deposits(strategy.address)).to.equal(parseUnits("1", 18));

      expect(await vault.totalSupply()).to.equal(parseUnits("1", 18));
      expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 18));
      expect(await vault.balanceOf(bob.address)).to.equal(parseUnits("0.5", 18));
    })

    it("Returns want amounts requested for withdrawal by multiple parties with additional harvest", async () => {
      const {alice, vault, strategy, hopPool, bob} = await loadFixture(setupFixture);
      expect(await vault.totalSupply()).to.equal(0);

      await vault.connect(alice).deposit({value: ONE_ETH});

      await vault.connect(bob).deposit({value: ONE_ETH});

      expect(await vault.totalSupply()).to.equal(parseUnits("2", 18));
      expect(await hopPool.deposits(strategy.address)).to.equal(parseUnits("2", 18));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETH);
      expect(await vault.balanceOf(bob.address)).to.equal(ONE_ETH);

      const ownerFee = parseUnits("0.05", 18);

      await strategy.harvest()

      const hopPoolBalanceOfStrategyAfterHarvest = parseUnits("3", 18).sub(ownerFee);
      const expectedEthBalanceForAliceAndBob = (ONE_ETH.add(parseUnits("0.475", 18)).div(2));

      // NB after harvest, one LP token is worth 1.35 ETH for each party
      await vault.connect(alice).withdraw(parseUnits("0.5", 18))
      expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 18));
      expect(await hopPool.deposits(strategy.address)).to.equal(hopPoolBalanceOfStrategyAfterHarvest.sub(expectedEthBalanceForAliceAndBob));

      const hopPoolRemainingBalanceOfStrategyAfterAliceWithdraw = hopPoolBalanceOfStrategyAfterHarvest.sub(expectedEthBalanceForAliceAndBob);

      await vault.connect(bob).withdraw(parseUnits("0.5", 18))
      expect(await vault.balanceOf(bob.address)).to.equal(parseUnits("0.5", 18));
      expect(await hopPool.deposits(strategy.address)).to.equal(hopPoolRemainingBalanceOfStrategyAfterAliceWithdraw.sub(expectedEthBalanceForAliceAndBob));

      expect(await vault.totalSupply()).to.equal(parseUnits("1", 18));
      expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 18));
      expect(await vault.balanceOf(bob.address)).to.equal(parseUnits("0.5", 18));
    })

  })

  describe("Utils", () => {
    describe("Pausing and un-pausing", () => {

      it("Deposits are disabled when the strat is stopped", async () => {
        const {alice, vault, strategy} = await loadFixture(setupFixture);
        await strategy.stop();
        const depositTx = vault.connect(alice).deposit({value: ONE_ETH})
        await expect(depositTx).to.revertedWith('Stoppable: stopped');
      })

      it("Removes allowances for the Hop Pools when paused", async () => {

      })

      it("Reverts when depositing while paused", async () => {

      })

      it("Allows users to withdraw while paused", async () => {

      })
    })

    describe("Panic", () => {
      it("Collects rewards from the strategy and withdraws all funds from the pool", async () => {

      })

      it("Pauses the strategy", async () => {

      })
    })

    describe("Performance Fees", () => {
      it("Can change the fee for the devs", async () => {
        const {strategy} = await loadFixture(setupFixture);
        await strategy.setDevFee(parseUnits("0.5", 18));
        expect(await strategy.getDevFee()).to.equal(parseUnits("0.5", 18));
      })

      it("Can change the fee for the staking contract", async () => {
        const {strategy} = await loadFixture(setupFixture);
        await strategy.setStakingFee(parseUnits("0.1", 18));
        expect(await strategy.getStakingFee()).to.equal(parseUnits("0.1", 18));
      })

      it("Only the owner can modify fees", async () => {
        const {strategy, alice} = await loadFixture(setupFixture);
        await expect(strategy.connect(alice).setDevFee(parseEther("0.5"))).to.be.revertedWith("Manageable: caller is not the manager or owner");
      })

      it("Combined fees cannot exceed 50%", async () => {
        const {strategy} = await loadFixture(setupFixture);
        await strategy.setDevFee(parseUnits("0.5", 18));
        await expect(strategy.setStakingFee(parseUnits("0.001", 18))).to.be.revertedWith("fee too high")
      })
    })
  })
});
