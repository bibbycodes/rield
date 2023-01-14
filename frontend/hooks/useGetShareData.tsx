import {useAccount, useContractRead} from "wagmi";
import {abi} from "../../artifacts/contracts/vaults/BeefyVaultV7.sol/BeefyVaultV7.json";
import {Strategy} from "../model/strategy";

export const useGetShareData = ({vaultAddress}: Strategy) => {
  const {address: userAddress} = useAccount();
  const {data: fullPricePerShare, refetch: refetchFullPricePerShare} = useContractRead({
    abi,
    address: vaultAddress,
    functionName: 'getPricePerFullShare',
    args: []
  });

  const {data: userBalance, refetch: refetchUserBalance} = useContractRead({
    abi,
    address: vaultAddress,
    functionName: 'balanceOf',
    args: [userAddress]
  })
  
  return {
    refetchFullPricePerShare,
    refetchUserBalance,
    fullPricePerShare,
    userBalance
  }
}
