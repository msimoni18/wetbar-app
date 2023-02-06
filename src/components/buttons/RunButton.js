import React from "react";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

export default function RunButton(props) {
  const { handleClick } = props;

  return (
    <Button
      variant="contained"
      size="large"
      color="primary"
      onClick={ handleClick }
      endIcon={ <SendIcon /> }
    >
      Run
    </Button>
  );
}
