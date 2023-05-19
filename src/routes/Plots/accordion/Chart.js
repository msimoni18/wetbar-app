import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Typography
} from "@mui/material";
import ColorSelector from "../../../components/containers/ColorSelector";
import { colorscales } from "../../../utils/utilities";
import { formatItemStyle } from "./styles";
import {
  updateLayout,
  updateLayoutFont,
  updateLayoutMargin,
  updateColorScaleOptions,
  updateOptions,
  updateBarLabels
} from "../plotsSlice";

const initialColors = {
  font: { r: 68, g: 68, b: 68, a: 1 },
  plotBackground: { r: 255, g: 255, b: 255, a: 1 }
};

function Chart({ id }) {
  const dispatch = useDispatch();
  const { layout, options } = useSelector((state) => state.plots.plots[id]);

  const handleLayoutChange = (key, value) => {
    dispatch(updateLayout({ id, newInput: { [key]: value } }));
  };

  const handleFontChange = (key, value) => {
    dispatch(updateLayoutFont({ id, key, newInput: { [key]: value } }));
  };

  const handleMarginChange = (key, value) => {
    dispatch(updateLayoutMargin({ id, newInput: { [key]: value } }));
  };

  const handleColorScaleChange = (key, value) => {
    dispatch(updateColorScaleOptions({ id, newInput: { [key]: value } }));
  };

  const handleOptionsChange = (key, value) => {
    dispatch(updateOptions({ id, newInput: { [key]: value } }));
  };

  const handleBarLabels = (key, value) => {
    dispatch(updateBarLabels({ id, newInput: { [key]: value } }));
  };

  return (
    <Fragment>
      <Box sx={ formatItemStyle }>
        <FormControlLabel
          control={ (
            <Checkbox
              checked={ options.enableBarOptions }
              onChange={ (event) => handleOptionsChange("enableBarOptions", event.target.checked) }
            />
          ) }
          label="Enable bar chart options"
        />
        {options.enableBarOptions
              && (
                <Box>
                  <Typography>Mode</Typography>
                  <RadioGroup
                    aria-labelledby="barmode-radio-buttons-group-label"
                    value={ layout.barmode }
                    name="barmode-buttons-group"
                    onChange={ (event) => handleLayoutChange("barmode", event.target.value) }
                    row
                  >
                    <FormControlLabel value="group" control={ <Radio /> } label="Group" />
                    <FormControlLabel value="stack" control={ <Radio /> } label="Stack" />
                    <FormControlLabel value="relative" control={ <Radio /> } label="Relative" />
                  </RadioGroup>
                  <FormControlLabel
                    control={ (
                      <Checkbox
                        checked={ options.enableBarLabels }
                        onChange={ (event) => handleBarLabels("enableBarLabels", event.target.checked) }
                      />
                    ) }
                    label="Add bar labels"
                  />
                </Box>
              )}
      </Box>
      <Box sx={ formatItemStyle }>
        <FormControlLabel
          control={ (
            <Checkbox
              checked={ options.enableContourOptions }
              onChange={ (event) => handleOptionsChange("enableContourOptions", event.target.checked) }
            />
          ) }
          label="Enable contour chart options"
        />
        {options.enableContourOptions
              && (
                <Box>
                  <Typography>Colorscale</Typography>
                  <Select
                    id="colorscale-select"
                    size="small"
                    value={ options.colorscale }
                    onChange={ (event) => handleColorScaleChange("colorscale", event.target.value) }
                    sx={ { width: "150px" } }
                  >
                    {colorscales.map((item, key) => (
                      <MenuItem key={ key } value={ item }>{item}</MenuItem>
                    ))}
                  </Select>
                  <FormControlLabel
                    control={ (
                      <Checkbox
                        checked={ options.reversescale }
                        onChange={ (event) => handleColorScaleChange("reversescale", event.target.checked) }
                      />
                    ) }
                    label="Reverse colorscale"
                  />
                </Box>
              )}
      </Box>
      <Box sx={ formatItemStyle }>
        <Typography>Height</Typography>
        <Slider
          value={ layout.height }
          min={ 200 }
          max={ 800 }
          aria-label="height-slider"
          valueLabelDisplay="auto"
          onChange={ (event, newValue) => handleLayoutChange("height", newValue) }
        />
      </Box>
      <Box sx={ formatItemStyle }>
        <Typography>Font Size</Typography>
        <Slider
          value={ layout.font.size }
          min={ 8 }
          max={ 32 }
          aria-label="font-size-slider"
          valueLabelDisplay="auto"
          onChange={ (event, newValue) => handleFontChange("size", newValue) }
        />
      </Box>
      <Box sx={ formatItemStyle }>
        <Typography>Margin</Typography>
        <Typography>Top</Typography>
        <Slider
          value={ layout.margin.t }
          min={ 0 }
          max={ 200 }
          aria-label="top-margin-slider"
          valueLabelDisplay="auto"
          onChange={ (event, newValue) => handleMarginChange("t", newValue) }
        />
        <Typography>Bottom</Typography>
        <Slider
          value={ layout.margin.b }
          min={ 0 }
          max={ 200 }
          aria-label="bottom-margin-slider"
          valueLabelDisplay="auto"
          onChange={ (event, newValue) => handleMarginChange("b", newValue) }
        />
        <Typography>Left</Typography>
        <Slider
          value={ layout.margin.l }
          min={ 0 }
          max={ 200 }
          aria-label="left-margin-slider"
          valueLabelDisplay="auto"
          onChange={ (event, newValue) => handleMarginChange("l", newValue) }
        />
        <Typography>Right</Typography>
        <Slider
          value={ layout.margin.r }
          min={ 0 }
          max={ 200 }
          aria-label="right-margin-slider"
          valueLabelDisplay="auto"
          onChange={ (event, newValue) => handleMarginChange("r", newValue) }
        />
      </Box>
      <Box sx={ formatItemStyle }>
        <Typography>Colors</Typography>
        <Typography>Font</Typography>
        <ColorSelector
          initialColor={ initialColors.font }
          text="color"
          handleColorChange={ handleFontChange }
        />
        <Typography>Paper</Typography>
        <ColorSelector
          initialColor={ initialColors.plotBackground }
          text="paper_bgcolor"
          handleColorChange={ handleLayoutChange }
        />
        <Typography>Plot</Typography>
        <ColorSelector
          initialColor={ initialColors.plotBackground }
          text="plot_bgcolor"
          handleColorChange={ handleLayoutChange }
        />
      </Box>
    </Fragment>
  );
}

export default Chart;
