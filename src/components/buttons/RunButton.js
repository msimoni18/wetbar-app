import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import SendIcon from "@mui/icons-material/Send";

export default function RunButton(props) {
  const { active, handleClick } = props;

  return (
    <Box sx={ { display: "flex", alignItems: "center" } }>
      <Box sx={ { m: 1, position: "relative" } }>
        <Button
          variant="contained"
          size="large"
          color="primary"
          disabled={ active }
          onClick={ handleClick }
          endIcon={ <SendIcon /> }
        >
          Run
        </Button>
        {active && (
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
