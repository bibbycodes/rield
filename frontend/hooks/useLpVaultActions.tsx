import {BigNumber} from "ethers";
import {Address, useContractWrite, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import {useSingleStakeVaultActions} from "./useSingleStakeVaultActions";
import {ADDRESS_ZERO} from "../lib/apy-getter-functions/cap";

export interface LpVaultActionsProps {
  vaultAddress: Address,
  inputTokenAmount: BigNumber,
  abi: any,
  inputTokenDecimals: number,
  inputTokenAddress: Address,
  isInputTokenApproved: boolean,
  isLp0TokenApproved: boolean,
  isLp1TokenApproved: boolean,
  lp0TokenAddress: Address,
  lp1TokenAddress: Address,
  lp0Amount: BigNumber,
  lp1Amount: BigNumber,
}

export function useLpVaultActions({
                                    vaultAddress,
                                    inputTokenAmount,
                                    abi,
                                    inputTokenDecimals,
                                    inputTokenAddress,
                                    isInputTokenApproved,
                                    isLp0TokenApproved, 
                                    isLp1TokenApproved,
                                    lp0Amount,
                                    lp1Amount,
                                  }: LpVaultActionsProps) {
  const {deposit, withdraw} = useSingleStakeVaultActions({
    vaultAddress,
    decimals: inputTokenDecimals,
    amount: inputTokenAmount,
    abi,
    tokenAddress: inputTokenAddress,
    isApproved: isInputTokenApproved
  })
  
  const {config: depositLpTokensConfig} = usePrepareContractWrite({
    address: vaultAddress,
    functionName: "depositLpTokens",
    abi,
    enabled: isLp0TokenApproved && isLp1TokenApproved && lp0Amount.gt(0) && lp1Amount.gt(0),
    args: inputTokenAddress === ADDRESS_ZERO ? [] : [lp0Amount, lp1Amount],
    // overrides: inputTokenAddress === ADDRESS_ZERO ? {value: amount} : undefined
  })
  
  const {data: depositLpTokensData, writeAsync: depositIntoVault} = useContractWrite(depositLpTokensConfig)
  const {
    isLoading: isDepositLpLoading,
    isSuccess: isDepositLpSuccess,
    isError: isDepositLpError,
    isFetching: isDepositLpFetching
  } = useWaitForTransaction({
    hash: depositLpTokensData?.hash,
  })

  const {config: withdrawLpTokensConfig} = usePrepareContractWrite({
    address: vaultAddress,
    args: [
      lp0Amount, lp1Amount
    ],
    functionName: "withdrawLpTokens",
    abi,
    enabled: lp1Amount.gt(0) && lp0Amount.gt(0),
  })

  const {data: withdrawLpTokensData, writeAsync: withdrawFromVault} = useContractWrite(withdrawLpTokensConfig)
  const {
    isLoading: isWithdrawLoading,
    isSuccess: isWithdrawSuccess,
    isError: isWithdrawError,
    isFetching: isWithdrawFetching
  } = useWaitForTransaction({
    hash: withdrawLpTokensData?.hash,
  })

  return {
    deposit,
    withdraw,
    withdrawLpTokens: {
      isLoading: isWithdrawLoading,
      isSuccess: isWithdrawSuccess,
      isError: isWithdrawError,
      isFetching: isWithdrawFetching,
      write: withdrawFromVault,
    },
    depositLpTokens: {
      isLoading: isDepositLpLoading,
      isSuccess: isDepositLpSuccess,
      isError: isDepositLpError,
      isFetching: isDepositLpFetching,
      write: depositIntoVault,
    }
  }
}
