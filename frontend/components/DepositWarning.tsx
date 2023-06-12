import Box from "@mui/material/Box";
import WarningIcon from "@mui/icons-material/Warning";
import * as React from "react";

export const DepositWarning = () => {
  return (
    <Box className={`inline-flex mt-4`}>
      <p className={`text-yellow-200`}>
        <WarningIcon fontSize="small" className={`mr-1`}/>
        This vault operates on a withdrawal schedule. For details, click <a
        href={'https://rld-1.gitbook.io/rld/withdrawal-schedules'}
        className={`text-yellow-200 underline`}
        target="_blank" rel="noopener noreferrer">
        here.
      </a>
      </p>
    </Box>
  )
}
