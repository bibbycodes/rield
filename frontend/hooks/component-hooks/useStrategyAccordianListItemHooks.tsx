import {LpPoolVault, SingleStakeVault, RldVault, StrategyType} from "../../lib/types/strategy-types";
import {useGetUserDepositedInVault} from "../useGetUserDepositedInVault";
import {useContext} from "react";
import {TokenPricesContext} from "../../contexts/TokenPricesContext";
import {APYsContext} from "../../contexts/ApyContext";
import {BigNumber, ethers} from "ethers";
import {formatDollarAmount, roundToNDecimals} from "../../utils/formatters";
import * as capEth from "../../resources/vault-details/deploy_cap_eth-output.json";
import * as capUSDC from "../../resources/vault-details/deploy_cap_usdc-output.json";
import {isLpPoolStrategy, isSingleStakeStrategy} from "../../lib/utils";

export const useStrategyAccordianListItemHooks = (strategy: RldVault) => {
  const {userStaked} = useGetUserDepositedInVault(strategy)
  const {prices} = useContext(TokenPricesContext)
  const {apys, isLoading} = useContext(APYsContext)
  
  const getUserStakedInDollarsSingleStake = (amount: BigNumber, strat: SingleStakeVault) => {
    const isAmountPositive = amount.gt(BigNumber.from(0))
    if (!prices[strat.coinGeckoId] || !isAmountPositive) {
      return 0
    }
    
    const balanceInUsd = ethers.utils.formatUnits(
      amount.mul((prices[strat.coinGeckoId] * 10000).toFixed(0)).div(10000),
      strat.decimals);
    return formatDollarAmount(+balanceInUsd, 2)
  }
  
  const getUserStakedInDollarsLpPool = (amount: BigNumber, strat: LpPoolVault) => {
    const lp0TokenPrice = prices[strat.lp0CoinGeckoId]
    const lp1TokenPrice = prices[strat.lp1CoinGeckoId]
    const isAmountPositive = amount.gt(BigNumber.from(0))
    if (!lp0TokenPrice || !lp1TokenPrice || !isAmountPositive) {
      return 0
    }
    //  TODO Fix calculation
    const balanceInUsd = ethers.utils.formatUnits(
      amount.mul((lp0TokenPrice + lp1TokenPrice * 10000).toFixed(0)).div(10000),
      // TODO decimals for each token needs to be considered
      strat.inputTokenDecimals);
    return formatDollarAmount(+balanceInUsd, 2)
  }
  const getUserStakedInDollars = (amount: BigNumber) => {
    if (strategy.type.includes(StrategyType.SINGLE_STAKE)) {
      return getUserStakedInDollarsSingleStake(amount, strategy as SingleStakeVault)
    }
    if (strategy.type.includes(StrategyType.LP_POOL)) {
      return getUserStakedInDollarsLpPool(amount, strategy as LpPoolVault)
    }
    return 0;
  }

  const formatTokenStakedAmount = (amount: BigNumber) => {
    const numberAmount = parseFloat(ethers.utils.formatUnits(amount, strategy.decimals))
    return roundToNDecimals(numberAmount, 6)
  }

  const getApy = (apy: number) => {
    if ([capEth.strategyAddress, capUSDC.strategyAddress].includes(strategy.strategyAddress)) {
      return `~${apy}`
    }
    return apy
  }
  
  const apy = getApy(apys[strategy.strategyAddress])
  
  const getTokenSymbol = () => {
    if (isSingleStakeStrategy(strategy.type)) {
      return (strategy as SingleStakeVault).tokenSymbol
    }
    if (isLpPoolStrategy(strategy.type)) {
      return (strategy as LpPoolVault).name
    }
    return ''
  }
  
  const tokenSymbol = getTokenSymbol()
  
  return  {
    getUserStakedInDollars,
    formatTokenStakedAmount,
    userStaked,
    apy,
    isLoading,
    tokenSymbol
  }
}
