import {Alert, Snackbar} from "@mui/material";
import {useContext} from "react";
import {ToastContext} from "../contexts/ToastContext";

export const Toast = () => {
  const {open, setOpen, message, setMessage} = useContext(ToastContext)
  
  const handleClose = () => {
    setOpen(false);
    setMessage("");
  };

  return (
    <div>
      <Snackbar 
        open={open} 
        autoHideDuration={3000} 
        onClose={handleClose} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
