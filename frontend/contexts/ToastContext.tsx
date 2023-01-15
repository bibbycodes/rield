import {createContext, ReactNode, useState} from "react";
import {SetFunction} from "./SelectedStrategyContext";

type ToastSeverity = "success" | "error" | "warning" | "info";

const ToastContext = createContext<{
  open: boolean, 
  setOpen: SetFunction<boolean>, 
  message: string,
  setMessage: SetFunction<string>,
  severity: ToastSeverity,
  setSeverity: SetFunction<ToastSeverity>
}>
({
  open: false,
  setOpen: () => false,
  message: "",
  setMessage: () => "",
  severity: "success",
  setSeverity: () => "success"
})

const ToastContextProvider = ({children}: {
  children: ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<ToastSeverity>("success");

  return (
    <ToastContext.Provider value={{open, setOpen, message, setMessage, severity, setSeverity}}>
      {children}
    </ToastContext.Provider>
  )
}

export {ToastContext, ToastContextProvider}
