export const formatDollarAmount = (num: number, decimals: number = 2): string => {
  return num.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export const isEmpty = (obj: any): boolean => {
  return Object.keys(obj).length === 0;
}
export const roundToNDecimals = (amount: number, decimals: number): number => {
  const factor = Math.pow(10, decimals);
  const roundedAmount = Math.round(amount * factor) / factor;
  if (roundedAmount - amount >= 0.0001) {
    return Math.floor(amount * factor) / factor;
  } else if (amount - roundedAmount >= 0.9999) {
    return Math.ceil(amount * factor) / factor;
  } else {
    return roundedAmount;
  }
}
