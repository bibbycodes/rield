export const calculateSimpleAPY = (apr: number, compoundingPeriodsPerYear: number) => {
  return Math.pow(1 + apr / compoundingPeriodsPerYear, compoundingPeriodsPerYear) - 1;
}

export const calculateApyWithFee = (apr: number, fee: number, compoundingPeriodsPerYear: number) => {
  apr = apr / 100;
  fee = fee / 100;
  const yieldPerPeriod = apr / compoundingPeriodsPerYear;
  const yieldPerPeriodAfterFee = yieldPerPeriod - fee * yieldPerPeriod;
  return ((Math.pow(1 + yieldPerPeriodAfterFee, compoundingPeriodsPerYear - 1) - 1) * 100).toFixed(2)
}
