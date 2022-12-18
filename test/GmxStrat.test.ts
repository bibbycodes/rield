import {expect} from "chai";
import {ethers} from "hardhat";
import {BigNumber, BigNumberish} from "ethers";
import {loadFixture} from "@nomicfoundation/hardhat-network-helpers";
import type {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {BeefyVaultV7, GMXRouterMock, TokenMock, UniswapV2RouterMock} from "../typechain-types";
import {parseEther} from "ethers/lib/utils";
import {deploy} from "@openzeppelin/hardhat-upgrades/dist/utils";

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

describe("GMX", () => {
  async function setupFixture() {
    const [deployer, alice, bob]: SignerWithAddress[] =
      await ethers.getSigners();

    const Token = await ethers.getContractFactory("TokenMock");
    const gmxToken: TokenMock = (await Token.deploy("GMX", "GMX", 18)) as TokenMock;
    await gmxToken.deployed();

    const ethToken = await Token.deploy("WETH", "WETH", 18,);
    await ethToken.deployed();

    const UniSwapMock = await ethers.getContractFactory("UniswapV2RouterMock");
    const uniSwapMock: UniswapV2RouterMock = (await UniSwapMock.deploy()) as UniswapV2RouterMock;
    await uniSwapMock.deployed();

    const GMXRouterMock = await ethers.getContractFactory("GMXRouterMock");
    const gmxRouterMock: GMXRouterMock = (await GMXRouterMock.deploy(gmxToken.address, ethToken.address)) as GMXRouterMock;
    await gmxRouterMock.deployed();

    const Vault = await ethers.getContractFactory("BeefyVaultV7");
    const vault: BeefyVaultV7 = (await Vault.deploy()) as BeefyVaultV7;
    await vault.deployed();

    const commonAddresses = {
      vault: vault.address,
      unirouter: uniSwapMock.address,
      owner: deployer.address,
    }

    const Strategy = await ethers.getContractFactory("StrategyGMXUniV2");
    const strategy = await Strategy.deploy(
      gmxRouterMock.address,
      [ethToken.address, gmxToken.address],
      commonAddresses
    );
    await strategy.deployed();

    await vault.initialize(strategy.address, "GMX_AUTO_C", "GMX_AUTO_C")

    await ethToken.mintFor(gmxRouterMock.address, ONE_THOUSAND_ETH);
    await ethToken.mintFor(uniSwapMock.address, ONE_THOUSAND_ETH);
    await gmxToken.mintFor(alice.address, ONE_THOUSAND_ETH);
    await gmxToken.mintFor(bob.address, ONE_THOUSAND_ETH);
    await gmxToken.mintFor(uniSwapMock.address, ONE_THOUSAND_ETH);
    await gmxToken.mintFor(gmxRouterMock.address, ONE_THOUSAND_ETH);

    return {
      gmxRouter: gmxRouterMock,
      vault,
      strategy,
      deployer,
      alice,
      bob,
      ethToken,
      gmx: gmxToken,
      uniswap: uniSwapMock
    };
  }


  it("Deployer owns the vault and strategy", async () => {
    const {deployer, vault, strategy} = await loadFixture(setupFixture);
    expect(await vault.owner()).to.equal(deployer.address);
    expect(await strategy.owner()).to.equal(deployer.address);
  })

  it("Want is the GMX token address", async () => {
    const {vault, strategy, gmx} = await loadFixture(setupFixture);
    expect(await vault.want()).to.equal(gmx.address);
    expect(await strategy.want()).to.equal(gmx.address);
  })

  describe("Deposit", () => {
    it("Depositing into vault sends want amount to strategy and stakes into GMX under the strategy's address, mints token to alice", async () => {
      const {alice, vault, strategy, gmx, gmxRouter} = await loadFixture(setupFixture);
      expect(await vault.totalSupply()).to.equal(0);
      await gmx.connect(alice).approve(vault.address, TEN_ETHER);
      await vault.connect(alice)
        .deposit(ONE_ETHER);

      expect(await vault.totalSupply()).to.equal(ONE_ETHER);
      expect(await gmxRouter.gmxBalances(strategy.address)).to.equal(ONE_ETHER);
      expect(await gmx.balanceOf(alice.address)).to.equal(parseEther("999"));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);
    })

    it("Mints token for bob and alice in proportion to their deposits", async () => {
      const {alice, bob, vault, strategy, gmx, gmxRouter} = await loadFixture(setupFixture);
      await gmx.connect(alice).approve(vault.address, TEN_ETHER);
      await vault.connect(alice)
        .deposit(ONE_ETHER);

      await gmx.connect(bob).approve(vault.address, TEN_ETHER);
      await vault.connect(bob)
        .deposit(ONE_ETHER);

      expect(await vault.totalSupply()).to.equal(parseEther("2"));
      expect(await gmxRouter.gmxBalances(strategy.address)).to.equal(parseEther("2"));
      expect(await gmx.balanceOf(alice.address)).to.equal(parseEther("999"));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);
      expect(await vault.balanceOf(bob.address)).to.equal(ONE_ETHER);
    })
  })

  describe("Harvest", () => {
    it("Compounds, claims and restakes, owner takes 30% of pf, rest goes back into strategy", async () => {
      const {alice, vault, strategy, gmx, gmxRouter, ethToken, deployer} = await loadFixture(setupFixture);
      await gmx.connect(alice).approve(vault.address, TEN_ETHER);
      await vault.connect(alice).deposit(ONE_ETHER);

      expect(await vault.totalSupply()).to.equal(ONE_ETHER);
      expect(await gmxRouter.gmxBalances(strategy.address)).to.equal(ONE_ETHER);
      expect(await gmx.balanceOf(alice.address)).to.equal(parseEther("999"));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);

      const txReceipt = await strategy.harvest();
      expect(await ethToken.balanceOf(deployer.address)).to.equal(parseEther("0.3"));
      expect(await gmxRouter.gmxBalances(strategy.address)).to.equal(parseEther("1.8"));
      await expect(txReceipt).to.emit(gmxRouter, "Compound")
      await expect(txReceipt).to.emit(gmxRouter, "Staked")
      await expect(txReceipt).to.emit(gmxRouter, "Claimed")
    })
  })

  describe("Withdraw", () => {
    it("Harvests, Returns tokens to depositor with additional harvest", async () => {
      const {alice, vault, strategy, gmx, gmxRouter, ethToken, deployer} = await loadFixture(setupFixture);
      expect(await vault.totalSupply()).to.equal(0);
      await gmx.connect(alice).approve(vault.address, TEN_ETHER);
      await vault.connect(alice)
        .deposit(ONE_ETHER);

      expect(await vault.totalSupply()).to.equal(ONE_ETHER);
      expect(await gmxRouter.gmxBalances(strategy.address)).to.equal(ONE_ETHER);
      expect(await gmx.balanceOf(alice.address)).to.equal(parseEther("999"));
      expect(await vault.balanceOf(alice.address)).to.equal(ONE_ETHER);

      await strategy.harvest();
      
      const aliceShares = await vault.balanceOf(alice.address);
      await vault.connect(alice).withdraw(aliceShares);
      
      const compoundAmount = parseEther("0.1");
      const claimAmount = parseEther("1");
      const claimAmountUserPart = claimAmount.sub(parseEther("0.3"));
      const ownerFee = claimAmount.sub(parseEther("0.7"));
      
      const expectedAliceGmx = ONE_THOUSAND_ETH.add(claimAmountUserPart).add(compoundAmount);  
      
      expect(await vault.totalSupply()).to.equal(0);
      expect(await vault.balanceOf(alice.address)).to.equal(0);
      expect(await gmx.balanceOf(alice.address)).to.equal(expectedAliceGmx);
      expect(await ethToken.balanceOf(deployer.address)).to.equal(ownerFee);
    })
  })
});
