import LoadingButton from "../LoadingButton";
import * as React from "react";
import {TokensByKey} from "./useLpDepositAndWithdrawModal";

export interface ApprovalsInputProps {
  depositAs: string;
  tokens: TokensByKey;
}

export const Approvals = ({depositAs, tokens}: ApprovalsInputProps) => {
  const {inputToken} = tokens
  const remainingApprovals = Object.keys(tokens).filter((token: string) => {
    if (depositAs === inputToken.symbol) {
      return tokens[token].address === inputToken.address && !tokens[token].approvals.isApproved
    } else {
      return tokens[token].address !== inputToken.address && !tokens[token].approvals.isApproved
    }
  }).map((token: string) => tokens[token])

  const tokenToApprove = remainingApprovals[0] ?? {}
  const isLoading = tokenToApprove?.approvals?.isLoading ?? false
  const approve = tokenToApprove?.approvals?.approve ?? (() => {})
  
  return (
    <>
      {!!remainingApprovals.length && (
          <LoadingButton loading={isLoading}
                         className={`w-full h-16 mt-6 uppercase rounded-lg text-tPrimary w-full`}
                         onClick={() => approve()}>
            <button
              className={`bg-gradient-to-r from-accentPrimary to-accentPrimaryGradient
                              hover:from-accentSecondary hover:to-accentSecondaryGradient 
                              rounded-lg text-tPrimary w-full h-16 mt-6 hover:bg-accentSecondary uppercase`}
              onClick={() => approve()}
            >Approve {tokenToApprove.symbol}
            </button>
          </LoadingButton>
        )
      }
    </>
  )
}
