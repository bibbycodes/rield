import {createContext, Dispatch, ReactNode, SetStateAction, useState,} from "react";
import {singleStakeStrategies} from "../model/strategy";
import {RldVault} from "../lib/types/strategy-types";

export type TransactionAction = "deposit" | "withdraw" | 'depositLpTokens' | 'withdrawLpTokens'
export type SetFunction<T> =  Dispatch<SetStateAction<T>>

const SelectedVaultContext = createContext<{
  selectedVault: RldVault;
  setSelectedVault: SetFunction<RldVault>;
  action: TransactionAction;
  setAction: SetFunction<TransactionAction>;
}>({
  selectedVault: singleStakeStrategies[0],
  action: "deposit",
  setSelectedVault: () => singleStakeStrategies[0],
  setAction: () => "deposit",
});

const SelectedVaultContextProvider = ({children}: {
  children: ReactNode;
}) => {
  const [selectedVault, setSelectedVault] = useState<RldVault>(singleStakeStrategies[0]);
  const [action, setAction] = useState<TransactionAction>("deposit");
  
  return (
    <SelectedVaultContext.Provider value={{ selectedVault, setSelectedVault, action, setAction}}>
      {children}
    </SelectedVaultContext.Provider>
  );
};

export { SelectedVaultContext, SelectedVaultContextProvider };
