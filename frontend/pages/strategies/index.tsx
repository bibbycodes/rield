import {allStrategies} from '../../model/strategy';
import React, {useState} from 'react';
import DepositAndWithdrawModal from '../../components/DepositAndWithdrawModal';
import {useTotalDollarAmountDeposited} from "../../hooks/useTotalDollarAmountDeposited";
import {Toast} from "../../components/Toast";
import {AccountBalance, WalletOutlined} from '@mui/icons-material';
import {useGetTVL} from "../../hooks/useGetTVL";
import {ToolBarDataItem} from "../../components/ToolBarDataItem";
import NonSSRWrapper from '../../components/NonSSRWrapper';
import {formatDollarAmount} from '../../utils/formatters';
import StrategyListItem from '../../components/StrategyListItem';

export default function Compound() {
  const [isStrategyDetailsModalOpen, setIsStrategyDetailsModalOpen] = useState<boolean>(false);
  const {totalDollarAmountDeposited} = useTotalDollarAmountDeposited()
  const {tvl, isLoading: tvlLoading} = useGetTVL()

  return <>
    <Toast/>
    <div className={`flex space-x-7`}>
      <ToolBarDataItem
        MuiIcon={WalletOutlined}
        value={totalDollarAmountDeposited}
        label={"Balance"}
        isLoading={totalDollarAmountDeposited == null}
      />
      <NonSSRWrapper>
        {<ToolBarDataItem
            MuiIcon={AccountBalance}
            value={formatDollarAmount(tvl)}
            label={"TVL"}
            isLoading={tvlLoading}
        />}
      </NonSSRWrapper>
    </div>
    <div className="flex justify-center">
      <div className="flex flex-col [&>*]:mb-2 [&>*]:w-[75vw]">
        {allStrategies
          .map(strategy => <StrategyListItem key={strategy.vaultAddress} strategy={strategy}
                                         openModal={setIsStrategyDetailsModalOpen}/>)}
      </div>
      <DepositAndWithdrawModal
        isOpen={isStrategyDetailsModalOpen}
        setIsOpen={setIsStrategyDetailsModalOpen}
      />
    </div>
  </>
}
