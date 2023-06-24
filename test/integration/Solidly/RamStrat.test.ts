import {expect} from "chai";
import {ethers} from "hardhat";
import {BigNumber, BigNumberish} from "ethers";
import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import * as ERC20Abi from './abis/ERC20.json'
import * as GuageAbi from './abis/Gauge.json'
import * as RouterAbi from './abis/Router.json'
import {parseEther, parseUnits} from "ethers/lib/utils";
import {RLDSolidlyLpVault, SolidlyLpStrat} from '../../../typechain-types';
import {ContractInterface} from "@ethersproject/contracts/src.ts";

const expectToHaveIncreasedBy = async (
  initialBalances: any,
  token: any,
  amount: BigNumberish,
  accountAddress: any
) => {
  const balance = await token.balanceOf(accountAddress);
  expect(balance.sub(initialBalances[accountAddress][token.address])).to.be.equal(amount);
}

const expectToHaveDecreasedBy = async (
  initialBalances: any,
  token: any,
  amount: BigNumberish,
  accountAddress: any
) => {
  const balance = await token.balanceOf(accountAddress);
  expect(initialBalances[accountAddress][token.address].sub(balance)).to.be.equal(amount);
}

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
    const vaultDetails = {
      "vaultAddress": "0x862d03C462c67AA0A9349662A89495ACe923B6E8",
      "inputTokenAddress": "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
      "lp0Address": "0x912ce59144191c1204e64559fe8253a0e49e6548",
      "lp1Address": "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8",
      "rewardTokenAddress": "0x463913D3a3D3D291667D53B8325c598Eb88D3B0e",
      "wantTokenAddress": "0x9cB911Cbb270cAE0d132689cE11c2c52aB2DedBC",
      "feeToken": "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      "routerAddress": "0xf26515d5482e2c2fd237149bf6a653da4794b3d0",
      "gaugeAddress": "0xc43e8F9AE4c1Ef6b8b63CBFEfE8Fe90d375fe11C",
      "deployerAddress": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "strategyAddress": "0xAc4D1Ed3c2fd0fF92566F026d6b45C0AF8E15bD0",
      "rewardTokenAddresses": [
        "0x463913D3a3D3D291667D53B8325c598Eb88D3B0e",
        "0x912ce59144191c1204e64559fe8253a0e49e6548",
        "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8"
      ],
      "isStable": false
    }

    const [signer] = await ethers.getSigners();
    const alice = await ethers.getImpersonatedSigner("0xe2055a2A59D3f8CDbB2Bc711E747e1766bDEAcD9");
    const bob = await ethers.getImpersonatedSigner("0x8622Da2cd359D9c6B9855aaF7C28606E87C75915");
    const arbToken = new ethers.Contract(vaultDetails.lp0Address, (ERC20Abi as any).default as ContractInterface, signer);
    const usdcToken = new ethers.Contract(vaultDetails.lp1Address, (ERC20Abi as any).default as ContractInterface, signer);
    const rewardToken = new ethers.Contract(vaultDetails.rewardTokenAddress, (ERC20Abi as any).default as ContractInterface, signer);
    const inputToken = new ethers.Contract(vaultDetails.inputTokenAddress, (ERC20Abi as any).default as ContractInterface, signer);
    const wantToken = new ethers.Contract(vaultDetails.wantTokenAddress, (ERC20Abi as any).default as ContractInterface, signer);
    const gauge = new ethers.Contract(vaultDetails.gaugeAddress, Array.from((GuageAbi as any).default) as ContractInterface, signer);
    const router = new ethers.Contract(vaultDetails.routerAddress, Array.from((RouterAbi as any).default) as ContractInterface, signer);
    
    const bobArbInitialBalance = await arbToken.balanceOf(bob.address);
    const bobUsdcInitialBalance = await usdcToken.balanceOf(bob.address);
    const bobRewardInitialBalance = await rewardToken.balanceOf(bob.address);
    const bobInputInitialBalance = await inputToken.balanceOf(bob.address);
    const bobWantInitialBalance = await wantToken.balanceOf(bob.address);
    
    const aliceArbInitialBalance = await arbToken.balanceOf(alice.address);
    const aliceUsdcInitialBalance = await usdcToken.balanceOf(alice.address);
    const aliceRewardInitialBalance = await rewardToken.balanceOf(alice.address);
    const aliceInputInitialBalance = await inputToken.balanceOf(alice.address);
    const aliceWantInitialBalance = await wantToken.balanceOf(alice.address);
    
    const initialBalances = {
      [bob.address]: {
        [arbToken.address]: bobArbInitialBalance,
        [usdcToken.address]: bobUsdcInitialBalance,
        [rewardToken.address]: bobRewardInitialBalance,
        [inputToken.address]: bobInputInitialBalance,
        [wantToken.address]: bobWantInitialBalance,
      },
      [alice.address]: {
        [arbToken.address]: aliceArbInitialBalance,
        [usdcToken.address]: aliceUsdcInitialBalance,
        [rewardToken.address]: aliceRewardInitialBalance,
        [inputToken.address]: aliceInputInitialBalance,
        [wantToken.address]: aliceWantInitialBalance,
      }
    }
    
    const lpToken0 = arbToken
    const lpToken1 = usdcToken
    const feeToken = usdcToken
    const lpToken = wantToken
    const ramToken = rewardToken

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

    return {
      deployer: signer,
      alice,
      bob,
      vault,
      strategy,
      arbToken,
      usdtToken: usdcToken,
      usdcToken,
      ramToken,
      router,
      gauge,
      lpToken,
      initialBalances
    };
  }

  describe('Variables', () => {
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

    const expectAddressesToBeEqual = async (a: string, b: string) => {
      expect(a.toLowerCase()).to.equal(b.toLowerCase());
    }
    
    it("Lp0, Lp1, rewardToken, feeToken, inputToken are set correctly", async () => {
      const {usdtToken, ramToken, usdcToken, strategy, arbToken, lpToken} = await loadFixture(setupFixture);
      await expectAddressesToBeEqual(await strategy.lp0(), arbToken.address);
      await expectAddressesToBeEqual(await strategy.lp1(), usdtToken.address);
      await expectAddressesToBeEqual(await strategy.reward(), ramToken.address);
      await expectAddressesToBeEqual(await strategy.fee(), usdcToken.address);
      await expectAddressesToBeEqual(await strategy.want(), lpToken.address);
    })

    it("Lp0, Lp1, rewardToken, feeToken, inputToken are accessible from vault", async () => {
      const {vault, usdtToken, ramToken, usdcToken, arbToken, lpToken} = await loadFixture(setupFixture);
      await expectAddressesToBeEqual(await vault.lp0Token(), arbToken.address);
      await expectAddressesToBeEqual(await vault.lp1Token(), usdtToken.address);
      await expectAddressesToBeEqual(await vault.rewardToken(), ramToken.address);
      await expectAddressesToBeEqual(await vault.feeToken(), usdcToken.address);
      await expectAddressesToBeEqual(await vault.want(), lpToken.address);
    })
  })


  describe("Deposits", () => {
    describe("Single Token Deposit", () => {
      it("Depositing into vault sends want amount to strategy and stakes into pool under the strategy's address, mints token to alice", async () => {
        const {alice, vault, strategy, gauge, usdcToken, initialBalances, arbToken} = await loadFixture(setupFixture);
        expect(await vault.totalSupply()).to.equal(0);
        await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
        await vault.connect(alice)
          .deposit(TEN_USDC);
        
        expectToHaveDecreasedBy(initialBalances, usdcToken, TEN_USDC, alice.address)
        const strategyGuageBalance = await gauge.balanceOf(strategy.address);
        expect(await vault.totalSupply()).to.equal(strategyGuageBalance);
        expect(await vault.balanceOf(alice.address)).to.equal(strategyGuageBalance);
        expect(await usdcToken.balanceOf(strategy.address)).to.equal(BigNumber.from(0));
        expect(await arbToken.balanceOf(strategy.address)).to.equal(BigNumber.from(0));
        
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
        const {
          alice,
          vault,
          strategy,
          usdcToken,
          arbToken,
          usdtToken,
          gauge,
          ramToken,
          router
        } = await loadFixture(setupFixture);
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
    describe("Withdraw as inputToken", () => {
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

    describe("Withdraw as LP Tokens", () => {
      it("Withdrawing after harvest returns tokens to depositor with additional harvest", async () => {
        const {alice, vault, strategy, usdcToken, deployer, arbToken, usdtToken, bob} = await loadFixture(setupFixture);
        await arbToken.connect(alice).approve(vault.address, TEN_ETH);
        await usdtToken.connect(alice).approve(vault.address, TEN_ETH);

        expect(await vault.totalSupply()).to.equal(0);

        await vault.connect(alice)
          .depositLpTokens(ONE_ETH.div(2), ONE_ETH.div(2));

        await strategy.harvest();

        const aliceShares = await vault.balanceOf(alice.address);
        await vault.connect(alice).withdrawAsLpTokens(aliceShares);

        const claimAmount = ONE_ETH
        const ownerFee = parseUnits("0.02", 18);
        const claimAmountUserPart = claimAmount.sub(ownerFee)
        const ownerFeeInUSDC = parseUnits("0.02", 6);
        const expectedAlicePerTokenDeposited = TEN_ETH.add(claimAmountUserPart.div(2))

        expect(await vault.totalSupply()).to.equal(0);
        expect(await vault.balanceOf(alice.address)).to.equal(0);
        expect(await vault.balance()).to.equal(0);
        expect(await usdcToken.balanceOf(deployer.address)).to.equal(ownerFeeInUSDC);
        expect(await arbToken.balanceOf(alice.address)).to.equal(expectedAlicePerTokenDeposited);
        expect(await usdtToken.balanceOf(alice.address)).to.equal(expectedAlicePerTokenDeposited);
      })

      it("Withdraws LP Tokens in proportion to the shares sent as an argument", async () => {
        const {alice, vault, strategy, usdcToken, deployer, arbToken, usdtToken} = await loadFixture(setupFixture);

        await arbToken.connect(alice).approve(vault.address, TEN_ETH);
        await usdtToken.connect(alice).approve(vault.address, TEN_ETH);
        const depositAmountPerToken = ONE_ETH.div(2)

        expect(await vault.totalSupply()).to.equal(0);

        await vault.connect(alice)
          .depositLpTokens(depositAmountPerToken, depositAmountPerToken);

        await strategy.harvest();
        const aliceShares = await vault.balanceOf(alice.address);
        await vault.connect(alice).withdrawAsLpTokens(aliceShares.div(2));

        const withdrawAmountForEachToken = ONE_ETH.div(4) // Amount for each token removed
        const claimAmount = ONE_ETH
        const ownerFee = parseUnits("0.02", 18);
        const claimAmountUserPart = claimAmount.sub(ownerFee)
        const claimAmountForWithdrawalPerToken = claimAmountUserPart.div(4)
        const ownerFeeInUSDC = parseUnits("0.02", 6);
        const expectedAlicePerTokenDeposited = TEN_ETH //amount before deposit
          .sub(depositAmountPerToken) // deposit 0.5 eth (combined for both tokens)
          .add(withdrawAmountForEachToken) // withdraw 50% of the deposit, so 0.25 ETH for each token
          .add(claimAmountForWithdrawalPerToken) // add 50% of the claim amount

        expect(await vault.totalSupply()).to.equal(parseUnits("0.5", 18));
        expect(await usdcToken.balanceOf(deployer.address)).to.equal(ownerFeeInUSDC);
        expect(await arbToken.balanceOf(alice.address)).to.equal(expectedAlicePerTokenDeposited);
        expect(await usdtToken.balanceOf(alice.address)).to.equal(expectedAlicePerTokenDeposited);
      })

      it("Returns want amounts requested for withdrawal by multiple parties with additional harvest", async () => {
        const {alice, bob, vault, strategy, usdcToken, deployer, arbToken, usdtToken} = await loadFixture(setupFixture);
        expect(await vault.totalSupply()).to.equal(0);

        const depositAmountPerToken = ONE_ETH.div(2)

        await arbToken.connect(alice).approve(vault.address, TEN_ETH);
        await usdtToken.connect(alice).approve(vault.address, TEN_ETH);
        await vault.connect(alice)
          .depositLpTokens(depositAmountPerToken, depositAmountPerToken);

        await arbToken.connect(bob).approve(vault.address, TEN_ETH);
        await usdtToken.connect(bob).approve(vault.address, TEN_ETH);
        await vault.connect(bob)
          .depositLpTokens(depositAmountPerToken, depositAmountPerToken);

        await strategy.harvest();
        const aliceShares = await vault.balanceOf(alice.address);

        const withdrawAmountForEachToken = ONE_ETH.div(4) // Amount for each token removed
        const claimAmount = ONE_ETH
        const ownerFee = parseUnits("0.02", 18);
        const claimAmountUserPart = claimAmount.sub(ownerFee)
        const claimAmountPerPerson = claimAmountUserPart.div(2)
        const claimAmountPerTokenDepositedPerPerson = claimAmountPerPerson.div(4)
        const ownerFeeInUSDC = parseUnits("0.02", 6);
        const expectedUserPerTokenDeposited = TEN_ETH //amount before deposit
          .sub(depositAmountPerToken) // deposit 0.5 eth (combined for both tokens)
          .add(withdrawAmountForEachToken) // withdraw 50% of the deposit, so 0.25 ETH for each token
          .add(claimAmountPerTokenDepositedPerPerson) // add 50% of the claim amount

        await vault.connect(alice).withdrawAsLpTokens(aliceShares.div(2));
        expect(await vault.totalSupply()).to.equal(parseUnits("1.5", 18));

        expect(await usdcToken.balanceOf(deployer.address)).to.equal(ownerFeeInUSDC);
        expect(await arbToken.balanceOf(alice.address)).to.equal(expectedUserPerTokenDeposited);
        expect(await usdtToken.balanceOf(alice.address)).to.equal(expectedUserPerTokenDeposited);

        await vault.connect(bob).withdrawAsLpTokens(aliceShares.div(2));
        expect(await vault.totalSupply()).to.equal(parseUnits("1", 18));
        expect(await arbToken.balanceOf(bob.address)).to.equal(expectedUserPerTokenDeposited);
        expect(await usdtToken.balanceOf(bob.address)).to.equal(expectedUserPerTokenDeposited);
      })
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
