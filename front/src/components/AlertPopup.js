import React, { useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// status -> error? & message

function AlertPopup({ is_open, setIs_open, status }) {
  const handleClose = (event, reason) => {
    setIs_open(false);
    if (reason === "clickaway") {
      return;
    }
  };

  return (
    <div>
      <Snackbar open={is_open} autoHideDuration={4000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={status?.error ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {status?.message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default AlertPopup;
