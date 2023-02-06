import React from "react";
import { post } from "utils/requests";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";
import Button from "@mui/material/Button";

export default function LoadingButton(props) {
  const { setCount1, setCount2 } = props;
  const [counting, setCounting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleResponse = (response) => {
    setSuccess(true);
    setCounting(false);
    setCount1(response);
  };

  const handleClick = () => {
    setSuccess(false);
    setCounting(true);

    post(
      JSON.stringify(),
      "test-counter",
      (response) => handleResponse(response),
      (error) => console.error(error)
    );
  };

  const buttonSx = {
    ...(success && {
      "bgcolor": green[500],
      "&:hover": {
        bgcolor: green[700]
      }
    })
  };

  return (
    <Box sx={ { display: "flex", alignItems: "center" } }>
      <Box sx={ { m: 1, position: "relative" } }>
        <Button
          variant="contained"
          sx={ buttonSx }
          disabled={ counting }
          onClick={ handleClick }
        >
          Run
        </Button>
        {counting && (
          <CircularProgress
            size={ 24 }
            sx={ {
              color: green[500],
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
