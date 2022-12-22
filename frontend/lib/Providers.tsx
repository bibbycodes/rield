import {SelectedStrategyContextProvider} from "../contexts/SelectedStrategyContext";

export const Providers = ({children}: { children: ReactNode }) => {
  return (
    <SelectedStrategyContextProvider>
      {children}
    </SelectedStrategyContextProvider>
  );
}
