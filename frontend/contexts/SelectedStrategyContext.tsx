import {createContext, Dispatch, ReactNode, SetStateAction, useState,} from "react";
import {singleStakeStrategies, SingleStakeStrategy} from "../model/strategy";

export type TransactionAction = "deposit" | "withdraw";
export type SetFunction<T> =  Dispatch<SetStateAction<T>>

const SelectedStrategyContext = createContext<{
  selectedStrategy: Strategy;
  setSelectedStrategy: SetFunction<Strategy>;
  action: TransactionAction;
  setAction: SetFunction<TransactionAction>;
}>({
  selectedStrategy: singleStakeStrategies[0],
  action: "deposit",
  setSelectedStrategy: () => singleStakeStrategies[0],
  setAction: () => "deposit",
});

const SelectedStrategyContextProvider = ({children}: {
  children: ReactNode;
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy>(singleStakeStrategies[0]);
  const [action, setAction] = useState<TransactionAction>("deposit");
  
  return (
    <SelectedStrategyContext.Provider value={{ selectedStrategy, setSelectedStrategy, action, setAction}}>
      {children}
    </SelectedStrategyContext.Provider>
  );
};

export { SelectedStrategyContext, SelectedStrategyContextProvider };
