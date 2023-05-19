import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import { formatItemStyle } from "./styles";
import { updateLayout } from "../plotsSlice";

function Legend({ id }) {
  const dispatch = useDispatch();
  const { layout } = useSelector((state) => state.plots.plots[id]);

  const handleLayoutChange = (key, value) => {
    dispatch(updateLayout({ id, newInput: { [key]: value } }));
  };

  return (
    <Fragment>
      <Box sx={ formatItemStyle }>
        <FormControlLabel
          control={ (
            <Checkbox
              checked={ layout.showlegend }
              onChange={ (event) => handleLayoutChange("showlegend", event.target.checked) }
            />
          ) }
          label="Enable"
        />
      </Box>
    </Fragment>
  );
}

export default Legend;
