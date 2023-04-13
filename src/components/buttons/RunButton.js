import React from "react";
import { useSelector } from "react-redux";
import { Box, Button, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function RunButton({ handleClick }) {
  const { isRunning } = useSelector((store) => store.app);

  return (
    <Box sx={ { display: "flex", alignItems: "center" } }>
      <Box sx={ { m: 1, position: "relative" } }>
        <Button
          variant="contained"
          size="large"
          color="primary"
          disabled={ isRunning }
          onClick={ handleClick }
          endIcon={ <SendIcon /> }
        >
          Run
        </Button>
        {isRunning && (
          <CircularProgress
            size={ 24 }
            sx={ {
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-12px",
              marginLeft: "-12px"
            } }
          />
        )}
      </Box>
    </Box>
  );
}
