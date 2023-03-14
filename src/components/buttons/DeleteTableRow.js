import React from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function DeleteTableRow(props) {
  const { data } = props;

  const deleteRow = () => {
    props.api.applyTransaction({ remove: [data] });
    props.api.refreshCells({ force: true });
  };

  return (
    <IconButton onClick={ deleteRow }>
      <DeleteIcon />
    </IconButton>
  );
}
