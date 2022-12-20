import {BigNumber, ethers} from "ethers";

export function convertToEther(amount: BigNumber): string {
  return ethers.utils.formatEther(amount);
}

export function shortenAddress(address: string) {
  return (
    address.slice(0, 5) +
    "..." +
    address.slice(address.length - 4, address.length)
  );
}

export const convertMillisToSeconds = (timestampInMillis: number): number => {
  return Math.floor(timestampInMillis / 1000);
};

export const sortArrayOfDictsByKey = (
  arrayOfDicts: any[],
  sortBy: string,
  order: "asc" | "desc" = "desc"
) => {
  let orderInt = 1;
  if (order === "desc") {
    orderInt = -orderInt;
  }
  const sortFunction = (itemA: any, itemB: any) => {
    if (itemA[sortBy] > itemB[sortBy]) return orderInt;
    return -orderInt;
  };
  return arrayOfDicts.sort(sortFunction);
};
