import { createContext, Dispatch, ReactNode, SetStateAction, useState, } from "react";
import { Ygi, ygis } from '../model/ygi';

export type TransactionAction = "deposit" | "withdraw";
export type SetFunction<T> = Dispatch<SetStateAction<T>>

const SelectedYgiContext = createContext<{
  selectedYgi: Ygi;
  setSelectedYgi: SetFunction<Ygi>;
  action: TransactionAction;
  setAction: SetFunction<TransactionAction>;
}>({
  selectedYgi: ygis[0],
  action: "deposit",
  setSelectedYgi: () => ygis[0],
  setAction: () => "deposit",
});

const SelectedYgiContextProvider = ({children}: {
  children: ReactNode;
}) => {
  const [selectedYgi, setSelectedYgi] = useState<Ygi>(ygis[0]);
  const [action, setAction] = useState<TransactionAction>("deposit");

  return (
    <SelectedYgiContext.Provider value={{selectedYgi, setSelectedYgi, action, setAction}}>
      {children}
    </SelectedYgiContext.Provider>
  );
};

export { SelectedYgiContext, SelectedYgiContextProvider };
