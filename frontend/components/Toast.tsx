import {Alert, Snackbar} from "@mui/material";
import {useContext} from "react";
import {ToastContext} from "../contexts/ToastContext";

export const Toast = () => {
  const {open, setOpen, message, setMessage, severity} = useContext(ToastContext)

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
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }} className="capitalize text-center pt-2">
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
