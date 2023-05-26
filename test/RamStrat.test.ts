import {expect} from "chai";
import {ethers} from "hardhat";
import {BigNumber, BigNumberish} from "ethers";
import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import {
  MockGauge,
  MockSolidlyRouter,
  RLDSolidlyLpVault,
  SolidlyLpStrat,
  SolidlyPairMock,
  TokenMock
} from "../typechain-types";
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
const ONE_ETH: BigNumber = parseUnits("1", 18);
const TEN_ETH: BigNumber = parseUnits("10", 18);
const ONE_THOUSAND_ETH: BigNumber = parseUnits("1000", 18);
const rewardAmount = parseUnits("1", 18);

describe("RAM ERC20 Strategy", () => {
  async function setupFixture() {
    const [deployer, alice, bob] = await ethers.getSigners();

    const ARBToken = await ethers.getContractFactory("TokenMock");
    const arbToken = await ARBToken.deploy("ARB", "ARB", 18) as TokenMock;
    await arbToken.deployed();

    const USDTToken = await ethers.getContractFactory("TokenMock");
    const usdtToken = await USDTToken.deploy("USDT", "USDT", 18) as TokenMock;
    await usdtToken.deployed();

    const USDCToken = await ethers.getContractFactory("TokenMock");
    const usdcToken = await USDCToken.deploy("USDC", "USDC", 6) as TokenMock;
    await usdcToken.deployed();

    const RAMToken = await ethers.getContractFactory("TokenMock");
    const ramToken = await RAMToken.deploy("RAM", "RAM", 18) as TokenMock;
    await ramToken.deployed();

    const WantToken = await ethers.getContractFactory("SolidlyPairMock");
    const wantToken = await WantToken.deploy(arbToken.address, usdtToken.address, false) as SolidlyPairMock;
    await wantToken.deployed();

    const SolidlyRouterMock = await ethers.getContractFactory("MockSolidlyRouter");
    const router = await SolidlyRouterMock.deploy(wantToken.address) as MockSolidlyRouter;
    await router.deployed();

    const lpToken0 = arbToken
    const lpToken1 = usdtToken
    const rewardToken = ramToken
    const feeToken = usdcToken
    const inputToken = usdcToken
    const lpToken = wantToken

    const MockGauge = await ethers.getContractFactory("MockGauge");
    const gauge = await MockGauge.deploy([rewardToken.address], wantToken.address) as MockGauge;
    await gauge.deployed();

    const TokenRoutes = {
      rewardTokenToFeeTokenRoute: [
        {from: rewardToken.address, to: feeToken.address, stable: false},
      ],
      rewardTokenToLp0TokenRoute: [
        {from: rewardToken.address, to: lpToken0.address, stable: false},
      ],
      rewardTokenToLp1TokenRoute: [
        {from: rewardToken.address, to: lpToken1.address, stable: false},
      ],
      inputTokenToLp0TokenRoute: [
        {from: inputToken.address, to: lpToken0.address, stable: false},
      ],
      inputTokenToLp1TokenRoute: [
        {from: inputToken.address, to: lpToken1.address, stable: false},
      ],
      lp0ToInputTokenRoute: [
        {from: lpToken0.address, to: inputToken.address, stable: false},
      ],
      lp1ToInputTokenRoute: [
        {from: lpToken1.address, to: inputToken.address, stable: false},
      ],
    };

    const Vault = await ethers.getContractFactory("RLDSolidlyLpVault");
    const vault = await Vault.deploy('RLD_ARB_USDT_RAM', 'RLD_ARB_USDT_RAM') as RLDSolidlyLpVault;
    await vault.deployed();

    const SolidlyLpStrategy = await ethers.getContractFactory("SolidlyLpStrat");
    const strategy = await SolidlyLpStrategy.deploy(
      vault.address,
      wantToken.address,
      inputToken.address,
      gauge.address,
      router.address,
      BigNumber.from(0),
      TokenRoutes
    ) as SolidlyLpStrat;
    await strategy.deployed();

    await vault.initStrategy(strategy.address);

    await usdcToken.mintFor(alice.address, TEN_USDC)
    await usdcToken.mintFor(bob.address, TEN_USDC)
    await usdcToken.mintFor(router.address, TEN_USDC)

    await arbToken.mintFor(alice.address, TEN_ETH)
    await arbToken.mintFor(bob.address, TEN_ETH)
    await arbToken.mintFor(router.address, TEN_ETH)

    await usdtToken.mintFor(router.address, TEN_ETH)
    await usdtToken.mintFor(alice.address, TEN_ETH)
    await usdtToken.mintFor(bob.address, TEN_ETH)
    await ramToken.mintFor(gauge.address, TEN_ETH)

    await wantToken.mintFor(gauge.address, TEN_ETH.mul(2))
    await wantToken.mintFor(router.address, TEN_ETH.mul(2))
    await wantToken.approve(router.address, TEN_ETH)

    return {
      deployer,
      alice,
      bob,
      vault,
      strategy,
      arbToken,
      usdtToken,
      usdcToken,
      ramToken,
      router,
      gauge,
      lpToken
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

  describe("Deposits", () => {
    describe("Single Token Deposit", () => {
      it("Depositing into vault sends want amount to strategy and stakes into pool under the strategy's address, mints token to alice", async () => {
        const {alice, vault, strategy, gauge, usdcToken} = await loadFixture(setupFixture);
        expect(await vault.totalSupply()).to.equal(0);
        await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
        await vault.connect(alice)
          .deposit(ONE_USDC);

        expect(await usdcToken.balanceOf(alice.address)).to.equal(TEN_USDC.sub(ONE_USDC));
        expect(await gauge.balanceOf(strategy.address)).to.equal(ONE_ETH);
        expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETH);
        expect(await vault.totalSupply()).to.equal(ONE_ETH);
      })
      //
      it("Mints token for bob and alice in proportion to their deposits", async () => {
        const {alice, bob, vault, strategy, gauge, usdcToken} = await loadFixture(setupFixture);
        await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
        await vault.connect(alice)
          .deposit(ONE_USDC);

        await usdcToken.connect(bob).approve(vault.address, TEN_USDC);
        await vault.connect(bob)
          .deposit(ONE_USDC);

        expect(await vault.totalSupply()).to.equal(parseUnits("2", 18));
        expect(await gauge.balanceOf(strategy.address)).to.equal(parseUnits("2", 18));
        expect(await usdcToken.balanceOf(alice.address)).to.equal(TEN_USDC.sub(ONE_USDC));
        expect(await usdcToken.balanceOf(bob.address)).to.equal(TEN_USDC.sub(ONE_USDC));
        expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETH);
        expect(await vault.balanceOf(bob.address)).to.equal(ONE_ETH);
      })

      it("Deposits are disabled when the strat is stopped", async () => {
        const {alice, vault, strategy, usdcToken, gauge, ramToken, router} = await loadFixture(setupFixture);
        const stopTx = await strategy.stop();
        await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
        await expect(stopTx).to.emit(strategy, "Stopped");
        await expect(vault.connect(alice).deposit(ONE_USDC)).to.be.revertedWith("Stoppable: stopped");
        await expect(await usdcToken.allowance(strategy.address, gauge.address)).to.equal(0);
        await expect(await ramToken.allowance(strategy.address, router.address)).to.equal(0);
      })
      //
      it("Deposits are enabled when the strat is resumed", async () => {
        const {alice, vault, strategy, usdcToken} = await loadFixture(setupFixture);
        await strategy.stop();
        const resumeTx = await strategy.resume();
        await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
        await vault.connect(alice).deposit(ONE_USDC)
        await expect(resumeTx).to.emit(strategy, "Resumed");
        expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETH);
      })
    })
    
    describe("LpToken Deposits", () => {
      it("Depositing LP tokens into vault sends want amount to strategy and stakes into pool under the strategy's address, mints token to alice", async () => {
        const {alice, vault, strategy, gauge, arbToken, usdtToken} = await loadFixture(setupFixture);
        await arbToken.connect(alice).approve(vault.address, TEN_ETH);
        await usdtToken.connect(alice).approve(vault.address, TEN_ETH);
        
        await vault.connect(alice)
          .depositLpTokens(ONE_ETH.div(2), ONE_ETH.div(2));

        expect(await arbToken.balanceOf(alice.address)).to.equal(TEN_ETH.sub(ONE_ETH.div(2)));
        expect(await usdtToken.balanceOf(alice.address)).to.equal(TEN_ETH.sub(ONE_ETH.div(2)));
        expect(await gauge.balanceOf(strategy.address)).to.equal(ONE_ETH);
        expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETH);
        expect(await vault.totalSupply()).to.equal(ONE_ETH);
      })
      
      it("Mints token for bob and alice in proportion to their deposits", async () => {
        const {alice, vault, strategy, gauge, bob, arbToken, usdtToken} = await loadFixture(setupFixture);
        await arbToken.connect(alice).approve(vault.address, TEN_ETH);
        await usdtToken.connect(alice).approve(vault.address, TEN_ETH);

        await arbToken.connect(bob).approve(vault.address, TEN_ETH);
        await usdtToken.connect(bob).approve(vault.address, TEN_ETH);

        await vault.connect(alice)
          .depositLpTokens(ONE_ETH.div(2), ONE_ETH.div(2));

        await vault.connect(bob)
          .depositLpTokens(ONE_ETH.div(2), ONE_ETH.div(2));

        expect(await arbToken.balanceOf(alice.address)).to.equal(TEN_ETH.sub(ONE_ETH.div(2)));
        expect(await usdtToken.balanceOf(alice.address)).to.equal(TEN_ETH.sub(ONE_ETH.div(2)));

        expect(await arbToken.balanceOf(bob.address)).to.equal(TEN_ETH.sub(ONE_ETH.div(2)));
        expect(await usdtToken.balanceOf(bob.address)).to.equal(TEN_ETH.sub(ONE_ETH.div(2)));

        expect(await gauge.balanceOf(strategy.address)).to.equal(ONE_ETH.mul(2));
        expect(await vault.totalSupply()).to.equal(ONE_ETH.mul(2));

        expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETH);
        expect(await vault.balanceOf(bob.address)).to.equal(ONE_ETH);
      })


      it("Deposits are disabled when the strat is stopped", async () => {
        const {alice, vault, strategy, usdcToken, arbToken, usdtToken, gauge, ramToken, router} = await loadFixture(setupFixture);
        const stopTx = await strategy.stop();
        await arbToken.connect(alice).approve(vault.address, TEN_ETH);
        await usdtToken.connect(alice).approve(vault.address, TEN_ETH);

        await expect(stopTx).to.emit(strategy, "Stopped");
        await expect(vault.connect(alice).depositLpTokens(ONE_ETH.div(2), ONE_ETH.div(2))).to.be.revertedWith("Stoppable: stopped");
        await expect(await arbToken.allowance(strategy.address, gauge.address)).to.equal(0);
        await expect(await usdtToken.allowance(strategy.address, gauge.address)).to.equal(0);
        await expect(await ramToken.allowance(strategy.address, router.address)).to.equal(0);
      })
      
      it("Deposits are enabled when the strat is resumed", async () => {
        const {alice, vault, strategy, arbToken, usdtToken} = await loadFixture(setupFixture);
        await arbToken.connect(alice).approve(vault.address, TEN_ETH);
        await usdtToken.connect(alice).approve(vault.address, TEN_ETH);
        await strategy.stop();
        const resumeTx = await strategy.resume();
        await vault.connect(alice).depositLpTokens(ONE_ETH.div(2), ONE_ETH.div(2))
        await expect(resumeTx).to.emit(strategy, "Resumed");
        expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETH);
      })
    })
  })
  
  //
  describe("Harvest", () => {
    it("Compounds, claims and restakes, owner takes 2% of pf, rest goes back into strategy", async () => {
      const {alice, vault, strategy, gauge, usdcToken, deployer} = await loadFixture(setupFixture);
      await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
      await vault.connect(alice).deposit(ONE_USDC);

      const txReceipt = await strategy.harvest();
      expect(await usdcToken.balanceOf(deployer.address)).to.equal(parseUnits("0.02", 6));
      expect(await gauge.balanceOf(strategy.address)).to.equal(parseUnits("1.98", 18));
      await expect(txReceipt).to.emit(strategy, "CollectRewards")
    })
    //
    it("Sends performance fees to staking contract address when a protocolStakingFee is set", async () => {
      const {alice, vault, strategy, gauge, usdcToken, bob, deployer} = await loadFixture(setupFixture);
      await strategy.setStakingFee(ONE_ETH.div(10)) // 10%
      await strategy.setStakingAddress(bob.address)
      await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
      const bobBalanceBefore = await usdcToken.balanceOf(bob.address);
      await vault.connect(alice).deposit(ONE_USDC);

      const txReceipt = await strategy.harvest();
      expect(await usdcToken.balanceOf(deployer.address)).to.equal(parseUnits("0.02", 6));
      expect(await usdcToken.balanceOf(bob.address)).to.equal(parseUnits("0.1", 6).add(bobBalanceBefore));
      expect(await gauge.balanceOf(strategy.address)).to.equal(parseUnits("1.88", 18));
      await expect(txReceipt).to.emit(strategy, "CollectRewards")
    })
  })
  //
  describe("Withdraw", () => {
    it("Withdrawing after harvest returns tokens to depositor with additional harvest", async () => {
      const {alice, vault, strategy, usdcToken, deployer} = await loadFixture(setupFixture);
      expect(await vault.totalSupply()).to.equal(0);
      await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
      await vault.connect(alice)
        .deposit(ONE_USDC);

      await strategy.harvest();

      const aliceShares = await vault.balanceOf(alice.address);
      await vault.connect(alice).withdraw(aliceShares);

      const claimAmount = parseUnits("1", 6);
      const claimAmountUserPart = claimAmount.sub(parseUnits("0.02", 6));
      const ownerFee = claimAmount.sub(parseUnits("0.98", 6));

      const expectedAliceGmx = TEN_USDC.add(claimAmountUserPart);

      expect(await vault.totalSupply()).to.equal(0);
      expect(await vault.balanceOf(alice.address)).to.equal(0);
      expect(await usdcToken.balanceOf(alice.address)).to.equal(expectedAliceGmx);
      expect(await usdcToken.balanceOf(deployer.address)).to.equal(ownerFee);
    })

    it("Withdraw in proportion to the shares sent as an argument", async () => {
      const {alice, vault, strategy, usdcToken, deployer} = await loadFixture(setupFixture);
      expect(await vault.totalSupply()).to.equal(0);
      await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
      await vault.connect(alice)
        .deposit(ONE_USDC);

      await strategy.harvest();

      const aliceShares = await vault.balanceOf(alice.address);
      await vault.connect(alice).withdraw(aliceShares.div(2));

      const claimAmount = parseUnits("1", 6);
      const devFee = parseUnits("0.02", 6)
      const claimAmountUserPart = claimAmount.sub(devFee);
      const withdrawAmount = ONE_USDC.div(2);
      const expectedAliceWithdrawAmount = (withdrawAmount).add(claimAmountUserPart.div(2));

      expect(await vault.totalSupply()).to.equal(parseUnits("0.5", 18));
      expect(await usdcToken.balanceOf(alice.address)).to.equal(TEN_USDC.sub(ONE_USDC).add(expectedAliceWithdrawAmount));
      expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 18));
      expect(await usdcToken.balanceOf(deployer.address)).to.equal(devFee);
    })

    it("Returns want amounts requested for withdrawal by multiple parties", async () => {
      const {alice, vault, strategy, gauge, bob, usdcToken} = await loadFixture(setupFixture);
      await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
      await usdcToken.connect(bob).approve(vault.address, TEN_USDC);

      expect(await vault.totalSupply()).to.equal(0);

      await vault.connect(alice)
        .deposit(ONE_USDC);

      await vault.connect(bob)
        .deposit(ONE_USDC);

      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETH);
      expect(await vault.balanceOf(bob.address)).to.equal(ONE_ETH);

      await vault.connect(alice).withdraw(parseUnits("0.5", 18))
      expect(await usdcToken.balanceOf(alice.address)).to.equal(TEN_USDC.sub(ONE_USDC.div(2)));
      expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 18));
      expect(await gauge.balanceOf(strategy.address)).to.equal(parseUnits("1.5", 18));

      await vault.connect(bob).withdraw(parseUnits("0.5", 18))
      expect(await usdcToken.balanceOf(bob.address)).to.equal(TEN_USDC.sub(ONE_USDC.div(2)));
      expect(await vault.balanceOf(bob.address)).to.equal(parseUnits("0.5", 18));
      expect(await gauge.balanceOf(strategy.address)).to.equal(parseUnits("1", 18));

      expect(await vault.totalSupply()).to.equal(parseUnits("1", 18));
      expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 18));
      expect(await vault.balanceOf(bob.address)).to.equal(parseUnits("0.5", 18));
    })
    //
    it("Returns want amounts requested for withdrawal by multiple parties with additional harvest", async () => {
      const {alice, vault, strategy, gauge, bob, usdcToken} = await loadFixture(setupFixture);
      await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
      await usdcToken.connect(bob).approve(vault.address, TEN_USDC);

      expect(await vault.totalSupply()).to.equal(0);

      await vault.connect(alice)
        .deposit(ONE_USDC);

      await vault.connect(bob)
        .deposit(ONE_USDC);

      await strategy.harvest()

      const ownerFeeInUSDC = parseUnits("0.02", 6);
      const withdrawAmountInUSDC = ONE_USDC.div(2);
      const harvestAmountMinusOwnerFee = ONE_USDC.sub(ownerFeeInUSDC);
      // 0.5 USDC (principal) + ((1 USDC - fee) / 2 (harvest amount for each user)) / 2 (half of the user's share)
      const expectedUserWithdrawAmount = withdrawAmountInUSDC.add(harvestAmountMinusOwnerFee.div(2).div(2))
      const expectedUserBalanceInUSDCAfterWithdraw = TEN_USDC.sub(ONE_USDC).add(expectedUserWithdrawAmount)

      await vault.connect(alice).withdraw(parseUnits("0.5", 18))
      expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 18));
      expect(await usdcToken.balanceOf(alice.address)).to.equal(expectedUserBalanceInUSDCAfterWithdraw);

      await vault.connect(bob).withdraw(parseUnits("0.5", 18))
      expect(await vault.balanceOf(bob.address)).to.equal(parseUnits("0.5", 18));
      expect(await usdcToken.balanceOf(bob.address)).to.equal(expectedUserBalanceInUSDCAfterWithdraw);

      expect(await vault.totalSupply()).to.equal(parseUnits("1", 18));
      expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 18));
      expect(await vault.balanceOf(bob.address)).to.equal(parseUnits("0.5", 18));
    })
  })
  //
  describe("Performance Fees", () => {
    it("Can change the fee for the devs", async () => {
      const {strategy} = await loadFixture(setupFixture);
      await strategy.setDevFee(parseUnits("0.5", 6));
      expect(await strategy.getDevFee()).to.equal(parseUnits("0.5", 6));
    })

    it("Can change the fee for the staking contract", async () => {
      const {strategy} = await loadFixture(setupFixture);
      await strategy.setStakingFee(parseUnits("0.1", 6));
      expect(await strategy.getStakingFee()).to.equal(parseUnits("0.1", 6));
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
});
