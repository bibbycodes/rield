export const calculateSimpleAPY = (apr: number, compoundingPeriodsPerYear: number) => {
  return Math.pow(1 + apr / compoundingPeriodsPerYear, compoundingPeriodsPerYear) - 1;
}
