import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Slider,
  TextField,
  Typography
} from "@mui/material";
import { formatItemStyle } from "./styles";
import {
  updateLayoutTitle,
  updateLayoutXAxis,
  updateLayoutYAxis,
  updateOptions,
  updateOptionsY2
} from "../plotsSlice";

function Labels({ id }) {
  const dispatch = useDispatch();
  const { layout, options } = useSelector((state) => state.plots.plots[id]);

  const handleTitleChange = (key, value) => {
    dispatch(updateLayoutTitle({ id, newInput: { [key]: value } }));
  };

  const handleXAxisChange = (key, value) => {
    dispatch(updateLayoutXAxis({ id, newInput: { [key]: value } }));
  };

  const handleYAxisChange = (key, value) => {
    dispatch(updateLayoutYAxis({ id, newInput: { [key]: value } }));
  };

  const handleOptionsChange = (key, value) => {
    dispatch(updateOptions({ id, newInput: { [key]: value } }));
  };

  const handleOptionsY2Change = (key, value) => {
    dispatch(updateOptionsY2({ id, newInput: { [key]: value } }));
  };

  return (
    <Fragment>
      <Box sx={ formatItemStyle }>
        <Typography>Title</Typography>
        <TextField
          margin="dense"
          id="title-label"
          type="input"
          variant="outlined"
          size="small"
          fullWidth
          value={ layout.title.text }
          onChange={ (event) => handleTitleChange("text", event.target.value) }
        />
      </Box>
      <Box sx={ formatItemStyle }>
        <Typography>X-Axis</Typography>
        <TextField
          margin="dense"
          id="x-label"
          type="input"
          variant="outlined"
          size="small"
          fullWidth
          value={ layout.xaxis.title }
          onChange={ (event) => handleXAxisChange("title", event.target.value) }
        />
      </Box>
      <Box sx={ formatItemStyle }>
        <Typography>Y-Axis</Typography>
        <TextField
          margin="dense"
          id="y-label"
          type="input"
          variant="outlined"
          size="small"
          fullWidth
          value={ layout.yaxis.title }
          onChange={ (event) => handleYAxisChange("title", event.target.value) }
        />
      </Box>
      <Box sx={ formatItemStyle }>
        <FormControlLabel
          control={ (
            <Checkbox
              checked={ options.enableY2 }
              onChange={ (event) => handleOptionsChange("enableY2", event.target.checked) }
            />
          ) }
          label="Enable secondary y-axis"
        />
        {options.enableY2
              && (
                <Box>
                  <Typography>Text</Typography>
                  <TextField
                    disabled={ !options.enableY2 }
                    margin="dense"
                    id="y-label2"
                    type="input"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={ options.y2.title }
                    onChange={ (event) => handleOptionsY2Change("y2", event.target.value) }
                  />
                  <Typography>Position</Typography>
                  <Slider
                    value={ options.y2.position }
                    min={ 0 }
                    max={ 1 }
                    step={ 0.01 }
                    getAriaLabel={ () => "ylabel-2-position-slider" }
                    valueLabelDisplay="auto"
                    onChange={ (event, newValue) => handleOptionsY2Change("position", newValue) }
                  />
                </Box>
              )}
      </Box>
    </Fragment>
  );
}

export default Labels;
