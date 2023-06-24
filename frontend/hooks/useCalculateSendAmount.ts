import { BigNumber } from 'ethers';
import { TransactionAction } from '../contexts/SelectedVaultContext';
import { parseUnits } from 'ethers/lib/utils';

export const useCalculateSendAmount = (visibleAmount: string, action: TransactionAction, decimals: number, userStaked: BigNumber, vaultTokenBalanceBn: BigNumber | undefined) => {
  if (visibleAmount == null 
    || visibleAmount === '' 
    || visibleAmount === '0' 
    || parseFloat(visibleAmount) === 0
    || (action === 'withdraw' && userStaked?.eq(BigNumber.from(0)))) {
    return BigNumber.from(0)
  }
  
  const fixedVisibleAmount = parseFloat(visibleAmount).toFixed(decimals - 1)
  
  if (action === 'withdraw' || action === 'withdrawLpTokens') {
    const multiplier = BigNumber.from(10).pow(decimals)
    const withdrawAmountInWant = parseUnits(fixedVisibleAmount.toString(), decimals)
    const ratioOfWithdrawAmountToStakedAmount = withdrawAmountInWant.mul(multiplier).div(userStaked)
    return ratioOfWithdrawAmountToStakedAmount.mul(vaultTokenBalanceBn as BigNumber).div(multiplier)
  }
  return parseUnits(fixedVisibleAmount, decimals)
}
