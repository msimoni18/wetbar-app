import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  Typography
} from "@mui/material";
import ColorSelector from "../../../components/containers/ColorSelector";
import { formatItemStyle } from "./styles";
import {
  updateLayoutMajorGridlines,
  updateLayoutMinorGridlines
} from "../plotsSlice";
import { linestyles } from "../../../utils/utilities";

const initialColors = {
  majorGridline: { r: 230, g: 230, b: 230, a: 1 },
  minorGridline: { r: 216, g: 216, b: 216, a: 1 }
};

function Gridlines({ id }) {
  const dispatch = useDispatch();
  const { layout } = useSelector((state) => state.plots.plots[id]);

  const handleMajorGridChange = (key, value) => {
    dispatch(updateLayoutMajorGridlines({ id, newInput: { [key]: value } }));
  };

  const handleMinorGridChange = (key, value) => {
    dispatch(updateLayoutMinorGridlines({ id, newInput: { [key]: value } }));
  };

  return (
    <Fragment>
      <Box sx={ formatItemStyle }>
        <Typography>Major</Typography>
        <FormControlLabel
          control={ (
            <Checkbox
              checked={ layout.xaxis.showgrid }
              onChange={ (event) => handleMajorGridChange("showgrid", event.target.checked) }
            />
          ) }
          label="Enable"
        />
        <Typography>Color</Typography>
        <ColorSelector
          initialColor={ initialColors.majorGridline }
          text="gridcolor"
          handleColorChange={ handleMajorGridChange }
        />
        <Typography>Linestyle</Typography>
        <Select
          id="major-linestyle-select"
          size="small"
          value={ layout.xaxis.griddash }
          onChange={ (event) => handleMajorGridChange("griddash", event.target.value) }
          sx={ { width: "150px" } }
        >
          {linestyles.map((item, key) => (
            <MenuItem key={ key } value={ item }>{item}</MenuItem>
          ))}
        </Select>
      </Box>
      <Box sx={ formatItemStyle }>
        <Typography>Minor</Typography>
        <FormControlLabel
          control={ (
            <Checkbox
              checked={ layout.xaxis.minor.showgrid }
              onChange={ (event) => handleMinorGridChange("showgrid", event.target.checked) }
            />
          ) }
          label="Enable"
        />
        <Typography>Color</Typography>
        <ColorSelector
          initialColor={ initialColors.minorGridline }
          text="gridcolor"
          handleColorChange={ handleMinorGridChange }
        />
        <Typography>Linestyle</Typography>
        <Select
          id="minor-linestyle-select"
          size="small"
          value={ layout.xaxis.minor.griddash }
          onChange={ (event) => handleMinorGridChange("griddash", event.target.value) }
          sx={ { width: "150px" } }
        >
          {linestyles.map((item, key) => (
            <MenuItem key={ key } value={ item }>{item}</MenuItem>
          ))}
        </Select>
      </Box>
    </Fragment>
  );
}

export default Gridlines;
