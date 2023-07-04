import { BigNumber } from 'ethers';
import { TransactionAction } from '../contexts/SelectedStrategyContext';
import { parseUnits } from 'ethers/lib/utils';

export const useCalculateSendAmountYgi = (visibleAmount: string, action: TransactionAction, decimals: number, userStaked: BigNumber) => {
  if (visibleAmount == null
    || visibleAmount === ''
    || visibleAmount === '0'
    || (action === 'withdraw' && userStaked?.eq(BigNumber.from(0)))) {
    return BigNumber.from(0)
  }

  if (action === 'withdraw') {
    const multiplier = BigNumber.from(10).pow(decimals)
    const withdrawAmountInWant = parseUnits(visibleAmount.toString(), decimals)
    return withdrawAmountInWant.mul(multiplier).div(userStaked)
  }
  return parseUnits(String(visibleAmount), decimals)
}
