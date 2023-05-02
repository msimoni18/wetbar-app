import React from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import DeleteIcon from "@mui/icons-material/Delete";
import { HtmlTooltip } from "components/containers/tooltips/HtmlTooltip";
import {
  deleteSeries,
  updateSeries,
  updateSeriesBooleans,
  updateSeriesNormalize
} from "./plotsSlice";

Series.propTypes = {
  plotId: PropTypes.string,
  id: PropTypes.string
};

export default function Series({ plotId, id }) {
  const dispatch = useDispatch();
  const series = useSelector((state) =>
    state.plots.plots[plotId].series[id]);
  const data = useSelector((state) => state.plots.fileOptions.loadedData.data);
  const [availableParams, setAvailableParams] = React.useState([]);

  React.useEffect(() => {
    const item = data?.filter((row) => row.file === series.file);
    if (item) {
      setAvailableParams(item[0]?.parameters);
    }
  }, [series.file, data]);

  const handleDelete = () => {
    dispatch(deleteSeries({ plotId, id }));
  };

  const handleFileChange = (event) => {
    dispatch(updateSeries({ plotId, id, newInput: { file: event.target.value } }));
  };

  const handleXChange = (event) => {
    dispatch(updateSeries({ plotId, id, newInput: { x: event.target.value } }));
  };

  const handleYChange = (event) => {
    dispatch(updateSeries({ plotId, id, newInput: { y: event.target.value } }));
  };

  const handleNameChange = (event) => {
    dispatch(updateSeries({ plotId, id, newInput: { name: event.target.value } }));
  };

  const handleModeChange = (event) => {
    dispatch(updateSeries({ plotId, id, newInput: { mode: event.target.value } }));
  };

  const handleTypeChange = (event) => {
    dispatch(updateSeries({ plotId, id, newInput: { type: event.target.value } }));
  };

  const handleYAxisChange = (event) => {
    let axis;
    if (!event.target.checked) {
      axis = "y";
    } else {
      axis = "y2";
    }
    dispatch(updateSeries({ plotId, id, newInput: { yaxis: axis } }));
    dispatch(updateSeriesBooleans({ plotId, id, newInput: { y2: event.target.checked } }));
  };

  const handleNormalizeEnable = (event) => {
    dispatch(updateSeriesNormalize({ plotId, id, newInput: { enable: event.target.checked } }));
  };

  const handleNormalizeType = (event) => {
    dispatch(updateSeriesNormalize({ plotId, id, newInput: { type: event.target.value } }));
  };

  const handleNormalizeEnableParam = (event) => {
    dispatch(updateSeriesNormalize({ plotId, id, newInput: { useDifferentParameter: event.target.checked } }));
  };

  const handleNormalizeParameter = (event) => {
    dispatch(updateSeriesNormalize({ plotId, id, newInput: { parameter: event.target.value } }));
  };

  const handleZChange = (event) => {
    dispatch(updateSeries({ plotId, id, newInput: { z: event.target.value } }));
  };

  const handleAggregateChange = (event) => {
    dispatch(updateSeries({ plotId, id, newInput: { aggregate: event.target.value } }));
  };

  return (
    <Box>
      <Typography>Chart Type</Typography>
      <RadioGroup
        aria-labelledby="plot-type-radio-buttons-group-label"
        value={ series.type }
        name="plot-type-buttons-group"
        onChange={ handleTypeChange }
        row
      >
        <FormControlLabel value="scatter" control={ <Radio /> } label="Scatter" />
        <FormControlLabel value="bar" control={ <Radio /> } label="Bar" />
        <FormControlLabel value="contour" control={ <Radio /> } label="Contour" />
        <FormControlLabel disabled value="surface" control={ <Radio /> } label="3D Surface" />
        <FormControlLabel value="scatter3d" control={ <Radio /> } label="3D Scatter" />
      </RadioGroup>
      <Typography>File</Typography>
      <Select
        id="file-select"
        size="small"
        fullWidth
        value={ series.file }
        onChange={ handleFileChange }
      >
        {data?.map((item) => (
          <MenuItem key={ item.file } value={ item.file }>{item.file}</MenuItem>
        ))}
      </Select>
      <Typography>X Parameter</Typography>
      <Select
        id="x-parameter-select"
        size="small"
        fullWidth
        value={ series.x }
        onChange={ handleXChange }
      >
        {availableParams?.map((item) => (
          <MenuItem key={ item } value={ item }>{item}</MenuItem>
        ))}
      </Select>
      <Typography>Y Parameter</Typography>
      <Select
        id="y-parameter-select"
        size="small"
        fullWidth
        value={ series.y }
        onChange={ handleYChange }
      >
        {availableParams?.map((item) => (
          <MenuItem key={ item } value={ item }>{item}</MenuItem>
        ))}
      </Select>
      {["contour", "surface", "scatter3d"].includes(series.type)
        && (
          <React.Fragment>
            <Typography>Z Parameter</Typography>
            <Select
              id="z-parameter-select"
              size="small"
              fullWidth
              value={ series.z }
              onChange={ handleZChange }
            >
              {availableParams?.map((item) => (
                <MenuItem key={ item } value={ item }>{item}</MenuItem>
              ))}
            </Select>
            <Typography>Aggregate Type</Typography>
            <RadioGroup
              aria-labelledby="aggregate-radio-buttons-group-label"
              value={ series.aggregate }
              name="aggregate-buttons-group"
              onChange={ handleAggregateChange }
              row
            >
              <FormControlLabel value="min" control={ <Radio /> } label="Min" />
              <FormControlLabel value="max" control={ <Radio /> } label="Max" />
            </RadioGroup>
          </React.Fragment>
        )}
      <Typography>Name</Typography>
      <TextField
        margin="dense"
        id="name-label"
        type="input"
        variant="outlined"
        size="small"
        fullWidth
        value={ series.name }
        onChange={ handleNameChange }
      />
      <Typography>Mode</Typography>
      <Select
        id="mode-select"
        size="small"
        fullWidth
        value={ series.mode }
        onChange={ handleModeChange }
      >
        <MenuItem value="lines">lines</MenuItem>
        <MenuItem value="lines+markers">lines+markers</MenuItem>
        <MenuItem value="markers">markers</MenuItem>
      </Select>
      <Typography>Secondary Axis</Typography>
      <FormGroup>
        <FormControlLabel
          control={ (
            <Checkbox />
          ) }
          label="Enable x-axis"
          disabled
        />
        <FormControlLabel
          control={ (
            <Checkbox
              checked={ series.booleans.y2 }
              onChange={ handleYAxisChange }
            />
          ) }
          label="Enable y-axis"
        />
      </FormGroup>
      <Typography>Normalize</Typography>
      <FormControlLabel
        control={ (
          <Checkbox
            checked={ series.normalize.enable }
            onChange={ handleNormalizeEnable }
          />
        ) }
        label="Enable"
      />
      {series.normalize.enable
        && (
          <React.Fragment>
            <RadioGroup
              aria-labelledby="normalize-radio-buttons-group-label"
              value={ series.normalize.type }
              name="normalize-buttons-group"
              onChange={ handleNormalizeType }
              row
            >
              <FormControlLabel value="min" control={ <Radio /> } label="Min" />
              <FormControlLabel value="max" control={ <Radio /> } label="Max" />
              <FormControlLabel
                disabled
                value="cb_times"
                control={ <Radio /> }
                label={ (
                  <Box sx={ { display: "flex", alignItems: "center", gap: 2 } }>
                    <Typography>Use CutbackTimes</Typography>
                    <HtmlTooltip
                      title="Use the parameter CutbackTimes if it exists in the selected file"
                      placement="top"
                    >
                      <InfoIcon fontSize="small" color="action" />
                    </HtmlTooltip>
                  </Box>
                ) }
              />
            </RadioGroup>
            <FormControlLabel
              control={ (
                <Checkbox
                  checked={ series.normalize.useDifferentParameter }
                  onChange={ handleNormalizeEnableParam }
                />
              ) }
              label="Use different parameter"
            />
            <Select
              id="normalize-select"
              size="small"
              fullWidth
              value={ series.normalize.parameter }
              onChange={ handleNormalizeParameter }
              disabled={ !series.normalize.useDifferentParameter }
            >
              {availableParams?.map((item) => (
                <MenuItem key={ item } value={ item }>{item}</MenuItem>
              ))}
            </Select>
          </React.Fragment>
        )}
      <Box sx={ { width: "100%", textAlign: "right" } }>
        <Tooltip title="Delete series" placement="right">
          <IconButton onClick={ handleDelete }>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}