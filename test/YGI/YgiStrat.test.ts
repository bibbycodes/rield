import {expect} from "chai";
import {ethers} from "hardhat";
import {BigNumber, BigNumberish} from "ethers";
import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import type {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {
  GMXRouterMock,
  GNSStakingMock,
  RldTokenVault,
  RldYieldGeneratingIndexVault,
  TokenMock,
  UniswapV3RouterMock
} from "../../typechain-types";
import {parseEther, parseUnits} from "ethers/lib/utils";
import {StrategyGNS} from "../../typechain-types";
import {PromiseOrValue} from "../../typechain-types/common";

const closeTo = async (
  a: BigNumberish,
  b: BigNumberish,
  margin: BigNumberish
) => {
  expect(a).to.be.closeTo(b, margin);
};

const ONE_USDC: BigNumber = parseUnits("1", 6);
const TEN_USDC: BigNumber = parseUnits("10", 6);
const ONE_ETHER: BigNumber = parseEther("1");
const TEN_ETHER: BigNumber = parseEther("10");
const ONE_THOUSAND_USDC: BigNumber = parseUnits("1000", 6);
const CAP_MULTIPLIER: BigNumber = parseUnits("1", 12);

describe("YGI Vault", () => {

  async function getFixture(inputTokenDecimals: number) {
    async function setupFixture() {
      const [deployer, alice, bob]: SignerWithAddress[] =
        await ethers.getSigners();

      const Token = await ethers.getContractFactory("TokenMock");

      const UniSwapMock = await ethers.getContractFactory("UniswapV3RouterMock");
      const uniSwapMock: UniswapV3RouterMock = (await UniSwapMock.deploy()) as UniswapV3RouterMock;
      await uniSwapMock.deployed();

      // GNS
      const gnsToken: TokenMock = (await Token.deploy("GNS", "GNS", 18)) as TokenMock;
      await gnsToken.deployed();

      const daiToken = await Token.deploy("DAI", "DAI", 18);
      await daiToken.deployed();

      const GNSStakingMock = await ethers.getContractFactory("GNSStakingMock");
      const gnsRouterMock: GNSStakingMock = (await GNSStakingMock.deploy(gnsToken.address, daiToken.address)) as GNSStakingMock;
      await gnsRouterMock.deployed();

      const GnsVault = await ethers.getContractFactory("RldTokenVault");
      const gnsVault: RldTokenVault = (await GnsVault.deploy()) as RldTokenVault;
      await gnsVault.deployed();

      const gnsCommonAddresses = {
        vault: gnsVault.address,
        unirouter: uniSwapMock.address,
        owner: deployer.address,
      }

      const GnsStrategy = await ethers.getContractFactory("StrategyGNS");
      const gnsStrategy = await GnsStrategy.deploy(
        gnsRouterMock.address,
        [daiToken.address, gnsToken.address],
        [3000],
        gnsCommonAddresses
      ) as StrategyGNS;
      await gnsStrategy.deployed();

      await gnsVault.initialize(gnsStrategy.address, "gns_AUTO_C", "gns_AUTO_C")

      // GMX
      const gmxToken: TokenMock = (await Token.deploy("GMX", "GMX", 18)) as TokenMock;
      await gmxToken.deployed();

      const ethToken = await Token.deploy("WETH", "WETH", 18);
      await ethToken.deployed();

      const GMXRouterMock = await ethers.getContractFactory("GMXRouterMock");
      const gmxRouterMock: GMXRouterMock = (await GMXRouterMock.deploy(gmxToken.address, ethToken.address)) as GMXRouterMock;
      await gmxRouterMock.deployed();

      const GmxVault = await ethers.getContractFactory("RldTokenVault");
      const gmxVault: RldTokenVault = (await GmxVault.deploy()) as RldTokenVault;
      await gmxVault.deployed();

      const gmxCommonAddresses = {
        vault: gmxVault.address,
        unirouter: uniSwapMock.address,
        owner: deployer.address,
      }

      const GmxStrategy = await ethers.getContractFactory("StrategyGMXUniV3");
      const gmxStrategy = await GmxStrategy.deploy(
        gmxRouterMock.address,
        [ethToken.address, gmxToken.address],
        [3000],
        gmxCommonAddresses
      );
      await gmxStrategy.deployed();
      await gmxVault.initialize(gmxStrategy.address, "GMX_AUTO_C", "GMX_AUTO_C")

      // Master Vault
      const MasterVault = await ethers.getContractFactory("RldYieldGeneratingIndexVault");
      const masterVault: RldYieldGeneratingIndexVault = (await MasterVault.deploy()) as RldYieldGeneratingIndexVault;
      await masterVault.deployed();
      const inputToken = await Token.deploy("USDC", "USDC", inputTokenDecimals) as TokenMock;

      //  Mints
      await inputToken.deployed();
      await inputToken.mintFor(alice.address, inputTokenDecimals === 6 ? TEN_USDC : TEN_ETHER);
      await inputToken.mintFor(bob.address, inputTokenDecimals === 6 ? TEN_USDC : TEN_ETHER);
      await inputToken.mintFor(uniSwapMock.address, inputTokenDecimals === 6 ? TEN_USDC : TEN_ETHER);

      await ethToken.mintFor(gmxRouterMock.address, TEN_ETHER.mul(100));
      await ethToken.mintFor(uniSwapMock.address, TEN_ETHER.mul(100));
      
      await gmxToken.mintFor(uniSwapMock.address, TEN_ETHER.mul(100));
      await gmxToken.mintFor(gmxRouterMock.address, TEN_ETHER.mul(100));

      await daiToken.mintFor(gnsRouterMock.address, TEN_ETHER.mul(100));
      await daiToken.mintFor(uniSwapMock.address, TEN_ETHER.mul(100));
      
      await gnsToken.mintFor(uniSwapMock.address, TEN_ETHER.mul(100));

      await masterVault.initialize(
        "RLD_YGI_GMX_GNS",
        "RLD_YGI_GMX_GNS",
        inputToken.address,
        uniSwapMock.address,
      )

      await masterVault.registerVault(
        "GNS",
        gnsToken.address,
        gnsStrategy.address,
        gnsVault.address,
        [3000],
        ONE_ETHER.div(2)
      );

      await masterVault.registerVault(
        "GMX",
        gmxToken.address,
        gmxStrategy.address,
        gmxVault.address,
        [3000],
        ONE_ETHER.div(2)
      );

      return {
        gnsToken,
        gmxToken,
        ethToken,
        usdcToken: inputToken,
        daiToken,
        uniSwapMock,
        gnsVault,
        gnsStrategy,
        gmxVault,
        gmxStrategy,
        masterVault,
        deployer,
        alice,
        bob,
      };
    }

    return loadFixture(setupFixture)
  }


  it("Deployer owns the vault and strategy", async () => {
    const {deployer, masterVault} = await getFixture(6);
    expect(await masterVault.owner()).to.equal(deployer.address);
  })

  it("Input Token is the USDC token address", async () => {
    const {masterVault, usdcToken} = await getFixture(6);
    expect(await masterVault.inputToken()).to.equal(usdcToken.address);
  })

  it("Vault decimals is 18", async () => {
    const {masterVault} = await getFixture(6);
    expect(await masterVault.decimals()).to.equal(18);
  })

  describe("Deposit", () => {
    it("Depositing into Master vault sends funds in proportion to weights for each vault", async () => {
      const {alice, masterVault, usdcToken, gmxVault, gnsVault} = await getFixture(6);
      expect(await masterVault.totalSupply()).to.equal(0);

      await usdcToken.connect(alice).approve(masterVault.address, TEN_USDC);
      await masterVault.connect(alice)
        .deposit(TEN_USDC);

      expect(await masterVault.totalSupply()).to.equal(TEN_ETHER);
      expect(await gmxVault.balanceOf(masterVault.address)).to.equal(TEN_ETHER.div(2));
      expect(await gnsVault.balanceOf(masterVault.address)).to.equal(TEN_ETHER.div(2));
      expect(await masterVault.balanceOf(alice.address)).to.equal(TEN_ETHER);
    })

    it("Mints token for bob and alice in proportion to their deposits", async () => {
      const {alice, bob, masterVault, usdcToken, gmxVault, gnsVault} = await getFixture(6);
      await usdcToken.connect(alice).approve(masterVault.address, TEN_USDC);
      await masterVault.connect(alice)
        .deposit(TEN_USDC);

      await usdcToken.connect(bob).approve(masterVault.address, TEN_USDC);
      await masterVault.connect(bob)
        .deposit(TEN_USDC);

      expect(await masterVault.totalSupply()).to.equal(TEN_ETHER.mul(2));
      expect(await gmxVault.balanceOf(masterVault.address)).to.equal(TEN_ETHER);
      expect(await gnsVault.balanceOf(masterVault.address)).to.equal(TEN_ETHER);
      expect(await masterVault.balanceOf(alice.address)).to.equal(TEN_ETHER);
      expect(await masterVault.balanceOf(bob.address)).to.equal(TEN_ETHER);
    })
    //
    // it("Deposits are disabled when the strat is stopped", async () => {
    //   const {alice, masterVault, strategy, usdcToken, capPool} = await loadFixture(setupFixture);
    //   const stopTx = await strategy.stop();
    //   await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
    //   await expect(vault.connect(alice).deposit(ONE_USDC)).to.be.revertedWith("Stoppable: stopped");
    //   await expect(stopTx).to.emit(strategy, "Stopped");
    //   await expect(await usdcToken.allowance(strategy.address, capPool.address)).to.equal(0);
    // })
    //
    // it("Deposits are enabled when the strat is resumed", async () => {
    //   const {alice, vault, strategy, usdcToken} = await loadFixture(setupFixture);
    //   await strategy.stop();
    //   const resumeTx = await strategy.resume();
    //   await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
    //   await vault.connect(alice).deposit(ONE_USDC)
    //   await expect(resumeTx).to.emit(strategy, "Resumed");
    //   expect(await vault.balanceOf(alice.address)).to.equal(ONE_USDC);
    // })
  })
  //
  describe("Withdraw", () => {
    it("Withdraws funds in proportion to weights for each vault", async () => {
      const {alice, masterVault, usdcToken, gmxVault, gnsVault} = await getFixture(6);
      await usdcToken.connect(alice).approve(masterVault.address, TEN_USDC);
      await masterVault.connect(alice).deposit(TEN_USDC);

      expect(await masterVault.totalSupply()).to.equal(TEN_ETHER);
      expect(await gmxVault.balanceOf(masterVault.address)).to.equal(TEN_ETHER.div(2));
      expect(await gnsVault.balanceOf(masterVault.address)).to.equal(TEN_ETHER.div(2));
      expect(await masterVault.balanceOf(alice.address)).to.equal(TEN_ETHER);

      const aliceShares = await masterVault.balanceOf(alice.address);
      await masterVault.connect(alice).withdraw(aliceShares);

      expect(await masterVault.totalSupply()).to.equal(0);
      expect(await gmxVault.balanceOf(masterVault.address)).to.equal(0);
      expect(await gnsVault.balanceOf(masterVault.address)).to.equal(0);
      expect(await masterVault.balanceOf(alice.address)).to.equal(0);
      expect(await usdcToken.balanceOf(alice.address)).to.equal(TEN_USDC);
    })
    
    it("Withdraws funds in proportion to weights for each vault for multiple depositors", async () => {
      const {alice, bob, masterVault, usdcToken, gmxVault, gnsVault} = await getFixture(6);
      await usdcToken.connect(alice).approve(masterVault.address, TEN_USDC);
      await masterVault.connect(alice).deposit(TEN_USDC);

      await usdcToken.connect(bob).approve(masterVault.address, TEN_USDC);
      await masterVault.connect(bob).deposit(TEN_USDC.div(5));

      const aliceShares = await masterVault.balanceOf(alice.address);
      await masterVault.connect(alice).withdraw(aliceShares);

      const bobShares = await masterVault.balanceOf(bob.address);
      await masterVault.connect(bob).withdraw(bobShares);

      expect(await masterVault.totalSupply()).to.equal(0);
      expect(await gmxVault.balanceOf(masterVault.address)).to.equal(0);
      expect(await gnsVault.balanceOf(masterVault.address)).to.equal(0);
      expect(await masterVault.balanceOf(alice.address)).to.equal(0);
      
      await closeTo(await usdcToken.balanceOf(alice.address), TEN_USDC, 2);
      await closeTo(TEN_USDC, await usdcToken.balanceOf(bob.address), 2);
    })

  })
  describe("Harvest", () => {
    it("Compounds, claims and restakes, owner takes 5% of pf, rest goes back into strategies", async () => {
      const {alice, masterVault, usdcToken, gmxStrategy, daiToken, ethToken, gnsStrategy, deployer} = await getFixture(6);
      await usdcToken.connect(alice).approve(masterVault.address, TEN_USDC);
      await masterVault.connect(alice).deposit(TEN_USDC);

      expect(await masterVault.totalSupply()).to.equal(TEN_ETHER);
      expect(await masterVault.balanceOf(alice.address)).to.equal(TEN_ETHER);

      await gmxStrategy.harvest();
      await gnsStrategy.harvest();

      const aliceShares = await masterVault.balanceOf(alice.address);
      await masterVault.connect(alice).withdraw(aliceShares);

      const gmxCompoundAmountInEth = parseEther("1").div(2)
      const gmxCompoundAmountInUsdc = parseUnits("1", 6).div(2)
      const ownerFeeGmxInEth = gmxCompoundAmountInEth.div(20); //5% of harvest
      const ownerFeeGmxInUsdc = gmxCompoundAmountInUsdc.div(20);
      const gmxUserHarvestAmountInUsdc = gmxCompoundAmountInUsdc.sub(ownerFeeGmxInUsdc);

      const gnsHarvestAmount = ONE_ETHER.div(2);
      const gnsHarvestAmountInTermsOfUsdc = ONE_USDC.div(2)
      const gnsOwnerCut = gnsHarvestAmount.div(20); //5% of harvest
      const gnsOwnerCutInTermsOfUsdc = gnsHarvestAmountInTermsOfUsdc.div(20);
      const gnsUserHarvestAmount = gnsHarvestAmountInTermsOfUsdc.sub(gnsOwnerCutInTermsOfUsdc);
      
      const expectedAliceUsdc = TEN_USDC
        .add(gmxUserHarvestAmountInUsdc)
        .add(gnsUserHarvestAmount)
      
      expect(await daiToken.balanceOf(deployer.address)).to.equal(gnsOwnerCut);
      expect(await usdcToken.balanceOf(alice.address)).to.equal(expectedAliceUsdc);
      expect(await ethToken.balanceOf(deployer.address)).to.equal(ownerFeeGmxInEth);
    })

    it("Compounds, claims and restakes, owner takes 5% of pf, rest goes back into strategies for multiple depositors", async () => {
      const {alice, bob, masterVault, usdcToken, gmxStrategy, daiToken, ethToken, gnsStrategy, deployer} = await getFixture(6);
      await usdcToken.connect(alice).approve(masterVault.address, TEN_USDC);
      await masterVault.connect(alice).deposit(TEN_USDC);

      await usdcToken.connect(bob).approve(masterVault.address, TEN_USDC);
      await masterVault.connect(bob).deposit(TEN_USDC);

      expect(await masterVault.totalSupply()).to.equal(TEN_ETHER.mul(2));
      expect(await masterVault.balanceOf(alice.address)).to.equal(TEN_ETHER);
      expect(await masterVault.balanceOf(bob.address)).to.equal(TEN_ETHER);

      await gmxStrategy.harvest();
      await gnsStrategy.harvest();

      const aliceShares = await masterVault.balanceOf(alice.address);
      const bobShares = await masterVault.balanceOf(bob.address);
      await masterVault.connect(alice).withdraw(aliceShares);
      await masterVault.connect(bob).withdraw(bobShares);

      const gmxCompoundAmountInEth = parseEther("1")
      const gmxCompoundAmountInUsdc = parseUnits("1", 6)
      const ownerFeeGmxInEth = gmxCompoundAmountInEth.div(20); //5% of harvest
      const ownerFeeGmxInUsdc = gmxCompoundAmountInUsdc.div(20);
      const gmxUserHarvestAmountInUsdc = gmxCompoundAmountInUsdc.sub(ownerFeeGmxInUsdc).div(2)

      const gnsHarvestAmount = ONE_ETHER;
      const gnsHarvestAmountInTermsOfUsdc = ONE_USDC
      const gnsOwnerCut = gnsHarvestAmount.div(20); //5% of harvest
      const gnsOwnerCutInTermsOfUsdc = gnsHarvestAmountInTermsOfUsdc.div(20);
      const gnsUserHarvestAmount = gnsHarvestAmountInTermsOfUsdc.sub(gnsOwnerCutInTermsOfUsdc).div(2);

      const expectedUserAmountAfterHarvest = TEN_USDC
        .add(gmxUserHarvestAmountInUsdc)
        .add(gnsUserHarvestAmount)

      expect(await daiToken.balanceOf(deployer.address)).to.equal(gnsOwnerCut);
      expect(await usdcToken.balanceOf(alice.address)).to.equal(expectedUserAmountAfterHarvest);
      expect(await usdcToken.balanceOf(bob.address)).to.equal(expectedUserAmountAfterHarvest);
      expect(await ethToken.balanceOf(deployer.address)).to.equal(ownerFeeGmxInEth);
    })
    //
    //   it("Sends performance fees to staking contract address when a protocolStakingFee is set", async () => {
    //
    //   })
    // })
    //
    // describe("Withdraw", () => {
    //   it("Withdrawing after harvest returns tokens to depositor with additional harvest", async () => {
    //     const {alice, vault, strategy, capPool, usdcToken, deployer} = await loadFixture(setupFixture);
    //     expect(await vault.totalSupply()).to.equal(0);
    //     await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
    //     await vault.connect(alice)
    //       .deposit(ONE_USDC);
    //
    //     expect(await vault.totalSupply()).to.equal(ONE_USDC);
    //     expect(await capPool.deposits(strategy.address)).to.equal(ONE_USDC);
    //     expect(await usdcToken.balanceOf(alice.address)).to.equal(parseUnits("999", 6));
    //     expect(await vault.balanceOf(alice.address)).to.equal(ONE_USDC);
    //
    //     await strategy.harvest();
    //
    //     const aliceShares = await vault.balanceOf(alice.address);
    //     await vault.connect(alice).withdraw(aliceShares);
    //
    //     const claimAmount = parseUnits("1", 6);
    //     const claimAmountUserPart = claimAmount.sub(parseUnits("0.05", 6));
    //     // 5% fee to deployer
    //     const ownerFee = claimAmount.sub(parseUnits("0.95", 6));
    //
    //     const expectedAliceGmx = ONE_THOUSAND_USDC.add(claimAmountUserPart);
    //
    //     expect(await vault.totalSupply()).to.equal(0);
    //     expect(await vault.balanceOf(alice.address)).to.equal(0);
    //     expect(await usdcToken.balanceOf(alice.address)).to.equal(expectedAliceGmx);
    //     expect(await usdcToken.balanceOf(deployer.address)).to.equal(ownerFee);
    //   })
    //
    //   it("Withdraw in proportion to the shares sent as an argument", async () => {
    //     const {alice, vault, strategy, capPool, usdcToken, deployer} = await loadFixture(setupFixture);
    //     expect(await vault.totalSupply()).to.equal(0);
    //     await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
    //     await vault.connect(alice)
    //       .deposit(ONE_USDC);
    //
    //     expect(await vault.totalSupply()).to.equal(ONE_USDC);
    //     expect(await capPool.deposits(strategy.address)).to.equal(ONE_USDC);
    //     expect(await usdcToken.balanceOf(alice.address)).to.equal(parseUnits("999", 6));
    //     expect(await vault.balanceOf(alice.address)).to.equal(ONE_USDC);
    //
    //     await strategy.harvest();
    //
    //     const aliceShares = await vault.balanceOf(alice.address);
    //     await vault.connect(alice).withdraw(aliceShares.div(2));
    //
    //     const claimAmount = parseUnits("1", 6);
    //     const claimAmountUserPart = claimAmount.sub(parseUnits("0.05", 6));
    //     const ownerFee = claimAmount.sub(parseUnits("0.95", 6));
    //     const expectedAliceWithdrawAmount = parseUnits("999.5", 6).add(claimAmountUserPart.div(2));
    //
    //     expect(await vault.totalSupply()).to.equal(parseUnits("0.5", 6));
    //     expect(await usdcToken.balanceOf(alice.address)).to.equal(expectedAliceWithdrawAmount);
    //     expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 6));
    //     expect(await usdcToken.balanceOf(deployer.address)).to.equal(ownerFee);
    //   })
    //
    //   it("Returns want amounts requested for withdrawal by multiple parties", async () => {
    //     const {alice, vault, strategy, capPool, bob, usdcToken} = await loadFixture(setupFixture);
    //     await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
    //     await usdcToken.connect(bob).approve(vault.address, TEN_USDC);
    //
    //     expect(await vault.totalSupply()).to.equal(0);
    //
    //     await vault.connect(alice)
    //       .deposit(ONE_USDC);
    //
    //     await vault.connect(bob)
    //       .deposit(ONE_USDC);
    //
    //     expect(await vault.totalSupply()).to.equal(parseUnits("2", 6));
    //     expect(await capPool.deposits(strategy.address)).to.equal(parseUnits("2", 6));
    //     expect(await vault.balanceOf(alice.address)).to.equal(ONE_USDC);
    //     expect(await vault.balanceOf(bob.address)).to.equal(ONE_USDC);
    //
    //     await vault.connect(alice).withdraw(parseUnits("0.5", 6))
    //     expect(await usdcToken.balanceOf(alice.address)).to.equal(parseUnits("999.5", 6));
    //     expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 6));
    //     expect(await capPool.deposits(strategy.address)).to.equal(parseUnits("1.5", 6));
    //
    //     await vault.connect(bob).withdraw(parseUnits("0.5", 6))
    //     expect(await usdcToken.balanceOf(bob.address)).to.equal(parseUnits("999.5", 6));
    //     expect(await vault.balanceOf(bob.address)).to.equal(parseUnits("0.5", 6));
    //     expect(await capPool.deposits(strategy.address)).to.equal(parseUnits("1", 6));
    //
    //     expect(await vault.totalSupply()).to.equal(parseUnits("1", 6));
    //     expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 6));
    //     expect(await vault.balanceOf(bob.address)).to.equal(parseUnits("0.5", 6));
    //   })
    //
    //   it("Returns want amounts requested for withdrawal by multiple parties with additional harvest", async () => {
    //     const {alice, vault, strategy, capPool, bob, deployer, usdcToken} = await loadFixture(setupFixture);
    //     await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
    //     await usdcToken.connect(bob).approve(vault.address, TEN_USDC);
    //
    //     expect(await vault.totalSupply()).to.equal(0);
    //
    //     await vault.connect(alice)
    //       .deposit(ONE_USDC);
    //
    //     await vault.connect(bob)
    //       .deposit(ONE_USDC);
    //
    //     expect(await vault.totalSupply()).to.equal(parseUnits("2", 6));
    //     expect(await capPool.deposits(strategy.address)).to.equal(parseUnits("2", 6));
    //     expect(await vault.balanceOf(alice.address)).to.equal(ONE_USDC);
    //     expect(await vault.balanceOf(bob.address)).to.equal(ONE_USDC);
    //
    //     const ownerFee = parseUnits("0.05", 6);
    //
    //     await strategy.harvest()
    //
    //     const capPoolBalanceOfStrategyAfterHarvest = parseUnits("3", 6).sub(ownerFee);
    //     const expectedEthBalanceForAliceAndBob = (ONE_USDC.add(parseUnits("0.475", 6)).div(2));
    //
    //     // NB after harvest, one LP token is worth 1.35 ETH for each party
    //     await vault.connect(alice).withdraw(parseUnits("0.5", 6))
    //     expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 6));
    //     expect(await capPool.deposits(strategy.address)).to.equal(capPoolBalanceOfStrategyAfterHarvest.sub(expectedEthBalanceForAliceAndBob));
    //
    //     const capPoolRemainingBalanceOfStrategyAfterAliceWithdraw = capPoolBalanceOfStrategyAfterHarvest.sub(expectedEthBalanceForAliceAndBob);
    //
    //     await vault.connect(bob).withdraw(parseUnits("0.5", 6))
    //     expect(await vault.balanceOf(bob.address)).to.equal(parseUnits("0.5", 6));
    //     expect(await capPool.deposits(strategy.address)).to.equal(capPoolRemainingBalanceOfStrategyAfterAliceWithdraw.sub(expectedEthBalanceForAliceAndBob));
    //
    //     expect(await vault.totalSupply()).to.equal(parseUnits("1", 6));
    //     expect(await vault.balanceOf(alice.address)).to.equal(parseUnits("0.5", 6));
    //     expect(await vault.balanceOf(bob.address)).to.equal(parseUnits("0.5", 6));
    //   })
    //
    // })
    //
    // describe("Utils", () => {
    //   describe("Pausing and un-pausing", () => {
    //
    //     it("Deposits are enabled when the strat is paused", async () => {
    //       const {alice, vault, strategy, usdcToken} = await loadFixture(setupFixture);
    //       const pauseTx = await strategy.pause();
    //       await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
    //       const depositTx = await vault.connect(alice).deposit(ONE_USDC)
    //       await expect(pauseTx).to.emit(strategy, 'StratHarvest');
    //       await expect(depositTx).to.emit(strategy, 'PendingDeposit');
    //       await expect(await usdcToken.balanceOf(strategy.address)).to.equal(ONE_USDC);
    //     })
    //
    //     it("Gives allowances for the Cap Pools when un-paused", async () => {
    //       const {alice, vault, strategy, usdcToken, capPool} = await loadFixture(setupFixture);
    //       await strategy.pause();
    //       await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
    //       const depositTx = await vault.connect(alice).deposit(ONE_USDC)
    //       const unpauseTx = await strategy.unpause();
    //       await expect(depositTx).to.emit(strategy, 'PendingDeposit');
    //       await expect(unpauseTx).to.emit(strategy, 'Deposit');
    //       await expect(await usdcToken.balanceOf(strategy.address)).to.equal(0);
    //       await expect(await capPool.getCurrencyBalance(strategy.address)).to.equal(ONE_USDC.add(parseUnits('0.95', 6)).mul(CAP_MULTIPLIER));
    //     })
    //
    //     it("Gives right amounts of USDC to each depositor between pauses", async () => {
    //       const {alice, bob, vault, strategy, usdcToken, capPool} = await loadFixture(setupFixture);
    //       const bobStartBalance = await usdcToken.balanceOf(bob.address);
    //       const aliceStartBalance = await usdcToken.balanceOf(alice.address);
    //       await usdcToken.connect(alice).approve(vault.address, TEN_USDC);
    //       await vault.connect(alice).deposit(ONE_USDC)
    //       await strategy.pause();
    //       await usdcToken.connect(bob).approve(vault.address, TEN_USDC);
    //       await vault.connect(bob).deposit(ONE_USDC)
    //       await vault.connect(bob).withdrawAll()
    //       await vault.connect(alice).withdrawAll()
    //       await expect(await usdcToken.balanceOf(strategy.address)).to.equal(0);
    //       await expect(await capPool.getCurrencyBalance(strategy.address)).to.equal(0);
    //       await closeTo(bobStartBalance, await usdcToken.balanceOf(bob.address), 1)
    //       const reward = parseUnits('0.95', 6);
    //       await closeTo(reward.add(aliceStartBalance), await usdcToken.balanceOf(alice.address), 1)
    //     })
    //
    //     it("Removes allowances for the Cap Pools when paused", async () => {
    //
    //     })
    //
    //     it("Reverts when depositing while paused", async () => {
    //
    //     })
    //
    //     it("Allows users to withdraw while paused", async () => {
    //
    //     })
    //   })
    //
    //   describe("Panic", () => {
    //     it("Collects rewards from the strategy and withdraws all funds from the pool", async () => {
    //
    //     })
    //
    //     it("Pauses the strategy", async () => {
    //
    //     })
    //   })
    //
    //   describe("Performance Fees", () => {
    //     it("Can change the fee for the devs", async () => {
    //       const {strategy} = await loadFixture(setupFixture);
    //       await strategy.setDevFee(parseUnits("0.5", 6));
    //       expect(await strategy.getDevFee()).to.equal(parseUnits("0.5", 6));
    //     })
    //
    //     it("Can change the fee for the staking contract", async () => {
    //       const {strategy} = await loadFixture(setupFixture);
    //       await strategy.setStakingFee(parseUnits("0.1", 6));
    //       expect(await strategy.getStakingFee()).to.equal(parseUnits("0.1", 6));
    //     })
    //
    //     it("Only the owner can modify fees", async () => {
    //       const {strategy, alice} = await loadFixture(setupFixture);
    //       await expect(strategy.connect(alice).setDevFee(parseEther("0.5"))).to.be.revertedWith("Manageable: caller is not the manager or owner");
    //     })
    //
    //     it("Combined fees cannot exceed 50%", async () => {
    //       const {strategy} = await loadFixture(setupFixture);
    //       await strategy.setDevFee(parseUnits("0.5", 6));
    //       await expect(strategy.setStakingFee(parseUnits("0.001", 6))).to.be.revertedWith("fee too high")
    //     })
    //   })
  })
});
