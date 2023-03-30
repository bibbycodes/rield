import { strategies } from '../../model/strategy';
import StrategyCard from '../../components/StrategyCard';
import React, { useState } from 'react';
import DepositAndWithdrawModal from '../../components/DepositAndWithdrawModal';
import { useTotalDollarAmountDeposited } from "../../hooks/useTotalDollarAmountDeposited";
import { Toast } from "../../components/Toast";
import { AccountBalance, WalletOutlined } from '@mui/icons-material';
import { useGetTVL } from "../../hooks/useGetTVL";
import { ToolBarDataItem } from "../../components/ToolBarDataItem";
import { useAccount } from "wagmi";
import NonSSRWrapper from '../../components/NonSSRWrapper';

export default function Compound() {
  const [isStrategyDetailsModalOpen, setIsStrategyDetailsModalOpen] = useState<boolean>(false);
  const {totalDollarAmountDeposited} = useTotalDollarAmountDeposited()
  const {tvl, isLoading: tvlLoading} = useGetTVL()
  const {isConnected} = useAccount()

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
        {isConnected && <ToolBarDataItem
            MuiIcon={AccountBalance}
            value={tvl.toFixed(2)}
            label={"TVL"}
            isLoading={tvlLoading}
        />}
      </NonSSRWrapper>
    </div>
    <div className="flex justify-center">
      <div className={`grid md:grid-cols-2 grid-cols-1 gap-4 [&>*]:shadow-xl max-w-6xl w-full`}>
        {strategies
          .map(strategy => <StrategyCard key={strategy.vaultAddress} strategy={strategy}
                                         openModal={setIsStrategyDetailsModalOpen}/>)}
      </div>
      <DepositAndWithdrawModal
        isOpen={isStrategyDetailsModalOpen}
        setIsOpen={setIsStrategyDetailsModalOpen}
      />
    </div>
  </>
}
