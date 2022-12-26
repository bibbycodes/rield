import {availableStrategies} from '../../model/strategy';
import StrategyCard from '../../components/StrategyCard';
import {useState} from 'react';
import StrategyDetailsModal from '../../components/StrategyDetailsModal';
import {useGetUserStaked} from "../../hooks/useGetUserStaked";
import {Typography} from "@mui/material";

export default function Compound() {
  const [isStrategyDetailsModalOpen, setIsStrategyDetailsModalOpen] = useState<boolean>(false);
  const {userStaked} = useGetUserStaked()

  return <>
    <div>
      <Typography className={`text-2xl text-tPrimary mb-4`}>Total Deposits: ${userStaked}</Typography>
    </div>
    <div className={`grid md:grid-cols-2 grid-cols-1 gap-4`}>
      {availableStrategies.map(strategy => <StrategyCard key={strategy.vaultAddress} strategy={strategy} openModal={setIsStrategyDetailsModalOpen}/>)}
      <StrategyDetailsModal
        isOpen={isStrategyDetailsModalOpen}
        setIsOpen={setIsStrategyDetailsModalOpen}
      ></StrategyDetailsModal>
    </div>
  </>
}
