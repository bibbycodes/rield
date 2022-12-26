export const calculateSimpleAPY = (apr: number, compoundingPeriodsPerYear: number) => {
  return Math.pow(1 + apr / compoundingPeriodsPerYear, compoundingPeriodsPerYear) - 1;
}

export const calculateApyWithFee = (apr: number, fee: number, compoundingPeriodsPerYear: number) => {
  apr = apr / 100;
  fee = fee / 100;
  let yieldPerPeriod = apr / compoundingPeriodsPerYear;
  let yieldAfterFee = yieldPerPeriod - fee * yieldPerPeriod;
  return Math.pow(1 + yieldAfterFee, compoundingPeriodsPerYear - 1) - 1
}
