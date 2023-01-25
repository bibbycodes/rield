export const formatDollarAmount = (num: number, decimals: number = 2): string => {
  return num.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export const isEmpty = (obj: any): boolean => {
  return Object.keys(obj).length === 0;
}
