import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {bgColor} from "../../pages";
import {useLpDepositAndWithdrawModal} from "./useLpDepositAndWithdrawModal";
import {VaultInputField} from './VaultInputField';
import {DepositWarning} from "../DepositWarning";
import {MenuItem, Select} from "@mui/material";
import {Approvals} from "./Approvals";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 400,
  width: '90vw',
  mitHeight: `100%`,
  boxShadow: 24,
};

export interface StrategyDetailsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function LpDepositAndWithdrawModal({isOpen, setIsOpen}: StrategyDetailsModalProps) {
  const {
    handleAmountChange,
    handleSetMax,
    performAction,
    showApprove,
    isBalanceLessThanAmount,
    truncateAmount,
    hasWithdrawalSchedule,
    formattedToken1Balance,
    userStaked,
    action,
    tokens,
    visibleAmounts,
    handleSetDepositAs,
    depositAs,
    setCurrentToken,
    handleSetAction,
    getActionVerb,
  } = useLpDepositAndWithdrawModal()
  const {lp0Token, lp1Token, inputToken} = tokens
  return (
    <div>
      <Modal
        open={isOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          id={"input-container"}
          className={`${bgColor} border-none text-tPrimary flex p-5 flex-col rounded-2xl`}
        >
          <div className={`flex justify-between`}>
            <div 
              className={`flex items-center border border-solid border-white w-full`}
              onClick={() => handleSetAction('deposit')}
            >
              <Typography id="modal-modal-description" sx={{mt: 0}}>DEPOSIT</Typography>
            </div>
            <div 
              className={`flex items-center border border-solid border-white w-full ml-auto`}
              onClick={() => handleSetAction('withdraw')}
            >
              <Typography id="modal-modal-description" sx={{mt: 0}}>WITHDRAW</Typography>
            </div>
          </div>

          <div  className={`flex justify-between`}>
            <div>{getActionVerb(action)} As</div>
            <Select value={depositAs} onChange={handleSetDepositAs}>
              <MenuItem value={inputToken.symbol}>{inputToken.symbol}</MenuItem>
              <MenuItem value={`${lp0Token.symbol}/${lp1Token.symbol}`}>{`${lp0Token.symbol}/${lp1Token.symbol}`}</MenuItem>
            </Select>
          </div>

          {depositAs === inputToken.symbol ?
            (<VaultInputField
              visibleAmount={visibleAmounts[inputToken.address]}
              tokenLogoUrl={inputToken.logoUrl}
              tokenSymbol={inputToken.symbol}
              action={action}
              formattedTokenBalance={inputToken.balances.formatted || '0'}
              userStaked={userStaked}
              decimals={inputToken.decimals}
              handleSetMax={handleSetMax}
              handleAmountChange={handleAmountChange}
              isBalanceLessThanAmount={isBalanceLessThanAmount}
              truncateAmount={truncateAmount}
              tokenAddress={inputToken.address}
              setCurrentToken={setCurrentToken}
            ></VaultInputField>) : (
              <>
                <VaultInputField
                  visibleAmount={visibleAmounts[lp0Token.address]}
                  tokenLogoUrl={lp0Token.logoUrl}
                  tokenSymbol={lp0Token.symbol}
                  action={action}
                  formattedTokenBalance={lp0Token.balances.formatted || '0'}
                  userStaked={userStaked}
                  decimals={lp0Token.decimals}
                  handleSetMax={handleSetMax}
                  handleAmountChange={handleAmountChange}
                  isBalanceLessThanAmount={isBalanceLessThanAmount}
                  truncateAmount={truncateAmount}
                  tokenAddress={lp0Token.address}
                  setCurrentToken={setCurrentToken}
                ></VaultInputField>

                <VaultInputField
                  visibleAmount={visibleAmounts[lp1Token.address]}
                  tokenLogoUrl={lp1Token.logoUrl}
                  tokenSymbol={lp1Token.symbol}
                  action={action}
                  formattedTokenBalance={formattedToken1Balance || '0'}
                  userStaked={userStaked}
                  decimals={lp1Token.decimals}
                  handleSetMax={handleSetMax}
                  handleAmountChange={handleAmountChange}
                  isBalanceLessThanAmount={isBalanceLessThanAmount}
                  truncateAmount={truncateAmount}
                  tokenAddress={lp1Token.address}
                  setCurrentToken={setCurrentToken}
                ></VaultInputField>
              </>
            )
          }

          {hasWithdrawalSchedule && (
            <DepositWarning/>
          )}

          <Box className={`flex flex-row justify-between`}>
            {showApprove() && <Approvals depositAs={depositAs} tokens={tokens}/>}
            {!showApprove() &&
              <button
                className={`bg-gradient-to-r from-accentPrimary to-accentPrimaryGradient
                        hover:from-accentSecondary hover:to-accentSecondaryGradient 
                        rounded-lg text-tPrimary w-full h-16 mt-6 hover:bg-accentSecondary uppercase`}
                onClick={() => performAction(action)}>{getActionVerb(action)}
              </button>}
          </Box>

          {/*<WithLoader isLoading={isLoading} className={`mt-4`} height={`1.5rem`} width={`6rem`} type={'rectangular'}>*/}
          {/*  <Box className={`ml-auto`}>*/}
          {/*    APY: {apy}%*/}
          {/*  </Box>*/}
          {/*</WithLoader>*/}

          {/*<Box className={`flex flex-col items-center mt-auto mx-2`}>*/}
          {/*  <a href={tokenUrl} target="_blank" rel="noopener noreferrer" className={`text-tSecondary`}>*/}
          {/*    Get Token*/}
          {/*  </a>*/}
          {/*</Box>*/}
        </Box>
      </Modal>
    </div>
  );
}
