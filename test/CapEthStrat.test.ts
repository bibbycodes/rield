import {expect} from "chai";
import {ethers} from "hardhat";
import {BigNumber, BigNumberish} from "ethers";
import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import type {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import { CapETHPoolMock, CapEthPoolStrategy, CapETHRewardsMock, RldEthVault } from "../typechain-types";
import { parseEther, parseUnits } from "ethers/lib/utils";
import { getBalance } from '../frontend/lib/apy-getter-functions/cap';

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

    const Vault = await ethers.getContractFactory("RldEthVault");
    const vault: RldEthVault = (await Vault.deploy()) as RldEthVault;
    await vault.deployed();

    const SingleStakeStrategy = await ethers.getContractFactory("CapEthPoolStrategy");
    const strategy = await SingleStakeStrategy.deploy(
      vault.address,
      capPoolMock.address,
      capRewardsMock.address,
    ) as CapEthPoolStrategy;

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
      const tx = await vault.connect(alice)
        .deposit({value: ONE_ETHER})

      expect(await vault.totalSupply()).to.equal(ONE_ETHER);
      expect(await capPool.deposits(strategy.address)).to.equal(ONE_ETHER);
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);
      expect(tx).to.emit(capPool, 'Deposit');
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

    it("Deposits are disabled when the strat is stopped", async () => {
      const {alice, vault, strategy} = await loadFixture(setupFixture);
      const stopTx = await strategy.stop();
      await expect(vault.connect(alice).deposit({value: ONE_ETHER})).to.be.revertedWith("Stoppable: stopped");
      await expect(stopTx).to.emit(strategy, "Stopped");
    })

    it("Deposits are enabled when the strat is resumed", async () => {
      const {alice, vault, strategy} = await loadFixture(setupFixture);
      await strategy.stop();
      const resumeTx = await strategy.resume();
      await vault.connect(alice).deposit({value: ONE_ETHER})
      await expect(resumeTx).to.emit(strategy, "Resumed");
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);
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
      ).to.changeEtherBalance(deployer, parseEther("0.05"));

      expect(await capPool.deposits(strategy.address)).to.equal(parseEther("1.95"));
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

      const ownerFee = parseEther("0.05");

      await expect(() =>
        strategy.harvest()
      ).to.changeEtherBalance(deployer, ownerFee);

      const capPoolBalanceOfStrategyAfterHarvest = parseEther("3").sub(ownerFee);
      const expectedEthBalanceForAliceAndBob = (ONE_ETHER.add(parseEther("0.475")).div(2));

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

  describe("Utils", () => {
    describe("Pausing and un-pausing", () => {
      it("Deposits are enabled when the strat is paused", async () => {
        const {alice, vault, strategy} = await loadFixture(setupFixture);
        const pauseTx = await strategy.pause();
        const depositTx = await vault.connect(alice).deposit({value: ONE_ETHER});
        await expect(pauseTx).to.emit(strategy, 'StratHarvest');
        await expect(depositTx).to.emit(strategy, 'PendingDeposit');
        await expect(await ethers.provider.getBalance(strategy.address)).to.equal(ONE_ETHER);
      })

      it("Gives allowances for the Cap Pools when un-paused", async () => {
        const {alice, vault, strategy, capPool} = await loadFixture(setupFixture);
        await strategy.pause();
        const depositTx = await vault.connect(alice).deposit({value: ONE_ETHER})
        const unpauseTx = await strategy.unpause();
        await expect(depositTx).to.emit(strategy, 'PendingDeposit');
        await expect(unpauseTx).to.emit(strategy, 'Deposit');
        await expect(await ethers.provider.getBalance(strategy.address)).to.equal(0);
        await expect(await capPool.getCurrencyBalance(strategy.address)).to.equal(ONE_ETHER.add(parseUnits('0.95', 18)));
      })

      it("Gives right amounts of USDC to each depositor between pauses", async () => {
        const {alice, bob, vault, strategy, capPool} = await loadFixture(setupFixture);
        const bobStartBalance = await ethers.provider.getBalance(bob.address);
        const aliceStartBalance = await ethers.provider.getBalance(alice.address);
        await vault.connect(alice).deposit({value: ONE_ETHER})
        await strategy.pause();
        await vault.connect(bob).deposit({value: ONE_ETHER})
        await vault.connect(bob).withdrawAll()
        await vault.connect(alice).withdrawAll()
        await expect(await ethers.provider.getBalance(strategy.address)).to.equal(0);
        await expect(await capPool.getCurrencyBalance(strategy.address)).to.equal(0);
        await closeTo(bobStartBalance, await ethers.provider.getBalance(bob.address), ethers.utils.parseUnits('0.05', 18))
        const reward = parseUnits('0.95', 18);
        await closeTo(reward.add(aliceStartBalance), await ethers.provider.getBalance(alice.address), ethers.utils.parseUnits('0.05', 18))
      })

      it("Removes allowances for the Cap Pools when paused", async () => {

      })

      it("Gives allowances for the Cap Pools when un-paused", async () => {

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
        await expect(strategy.connect(alice).setDevFee(parseEther("0.5"))).to.be.revertedWith("Manageable: caller is not the manager or owner");
      })

      it("Combined fees cannot exceed 50%", async () => {
        const {strategy} = await loadFixture(setupFixture);
        await strategy.setDevFee(parseEther("0.5"));
        await expect(strategy.setStakingFee(parseEther("0.5"))).to.be.revertedWith("fee too high")
      })
    })
  })
})
