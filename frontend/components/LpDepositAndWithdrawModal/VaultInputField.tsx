import Image from "next/image";
import {BigNumber, ethers} from "ethers";
import {TextField} from "@mui/material";
import Box from "@mui/material/Box";
import * as React from "react";
import {SetFunction, TransactionAction} from "../../contexts/SelectedVaultContext";
import {Address} from "wagmi";

export interface VaultInputFieldProps {
  visibleAmount: string;
  formattedTokenBalance: string;
  tokenLogoUrl: string;
  tokenSymbol: string;
  action: TransactionAction;
  userStaked: BigNumber;
  decimals: number;
  handleSetMax: (tokenAddress: Address) => void;
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isBalanceLessThanAmount: (value: number, tokenAddress: Address) => boolean;
  truncateAmount: (amount: string) => string;
  tokenAddress: Address;
  setCurrentToken: SetFunction<Address>;
}

export const VaultInputField = ({
                                  visibleAmount,
                                  tokenLogoUrl,
                                  tokenSymbol,
                                  action,
                                  formattedTokenBalance,
                                  userStaked,
                                  decimals,
                                  handleSetMax,
                                  handleAmountChange,
                                  isBalanceLessThanAmount,
                                  truncateAmount,
                                  tokenAddress,
                                  setCurrentToken
                                }: VaultInputFieldProps) => {
  return (
    <Box className={`bg-backgroundSecondary mt-2 rounded-lg`}>
      <div className="px-2 flex items-center">
        <Image alt={"Token Logo"} height={45} width={45} src={tokenLogoUrl}/>
        <span className="ml-3 text-3xl">{tokenSymbol}</span>
        <div className={'flex items-center ml-[5rem]'}>
          <span className={`text-tSecondary slim-text`}>{action === 'deposit' ? `Balance:` : `Staked:`}</span>
          <span className={`text-tSecondary slim-text`}>{truncateAmount(
            action === 'deposit' ? formattedTokenBalance : ethers.utils.formatUnits(userStaked, decimals)
          )}</span>
        </div>
        <div
          className={`text-tSecondary slim-text w-1/3 bg-none ml-auto hover:text-accentPrimary`}
          onClick={() => handleSetMax(tokenAddress)}
        >
          <p className={`w-8 ml-auto`}>
            Max
          </p>
        </div>
      </div>
      <div className={'flex px-2 pb-2 flex-row items-center h-10'}>
        <TextField
          sx={{
            "& fieldset": {border: 'none'},
            '& .MuiInputBase-input': {
              color: isBalanceLessThanAmount(+visibleAmount, tokenAddress) ? 'red' : 'white',
              fontSize: '2rem',
              padding: 0
            }
          }}
          id="tokenId"
          margin="normal"
          onChange={handleAmountChange}
          onFocus={() => setCurrentToken(tokenAddress)}
          value={visibleAmount}
          placeholder={'0.0'}
          className={`rounded-lg flex-grow`}
        >
        </TextField>
      </div>
    </Box>
  )
}
