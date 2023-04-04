import React from "react";
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
import { HtmlTooltip } from "./tooltips/HtmlTooltip";

export default function Series(props) {
  const { id, handleDelete, data, series, setSeries } = props;
  const [availableParams, setAvailableParams] = React.useState([]);
  const [file, setFile] = React.useState("");
  const [x, setX] = React.useState("");
  const [y, setY] = React.useState("");
  const [z, setZ] = React.useState("");
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState("scatter");
  const [mode, setMode] = React.useState("lines");
  const [y2, setY2] = React.useState(false);
  const [normalize, setNormalize] = React.useState(false);
  const [normalizeType, setNormalizeType] = React.useState("min");
  const [useNewNormalizeParameter, setUseNewNormalizeParameter] = React.useState(false);
  const [normalizeParameter, setNormalizeParameter] = React.useState("");
  const [aggregateType, setAggregateType] = React.useState("min");

  React.useEffect(() => {
    const item = data.filter((row) => row.file === file);
    setAvailableParams(item[0]?.parameters);
  }, [file]);

  // TODO: Change map functions to forEach based on
  // https://stackoverflow.com/questions/51519149/how-to-return-a-spread-operator-in-a-map-arrow-function-in-one-line

  const handleFileChange = (event) => {
    const newFile = event.target.value;
    setFile(newFile);

    const newSeries = series.map((row) => (row.id === id ? { ...row, file: newFile } : row));
    setSeries(newSeries);
  };

  const handleXChange = (event) => {
    const newX = event.target.value;
    setX(newX);

    const newSeries = series.map((row) => (row.id === id ? { ...row, x: newX } : row));
    setSeries(newSeries);
  };

  const handleYChange = (event) => {
    const newY = event.target.value;
    setY(newY);

    let newSeries;
    if (!useNewNormalizeParameter) {
      setNormalizeParameter(newY);
      newSeries = series.map((row) => (row.id === id
        ? {
          ...row,
          y: newY,
          normalize: {
            ...row.normalize,
            parameter: newY
          }
        } : row));
    } else {
      newSeries = series.map((row) => (row.id === id ? { ...row, y: newY } : row));
    }

    setSeries(newSeries);
  };

  const handleZChange = (event) => {
    const newZ = event.target.value;
    setZ(newZ);

    const newSeries = series.map((row) => (row.id === id ? { ...row, z: newZ } : row));
    setSeries(newSeries);
  };

  const handleAggregateChange = (event) => {
    const newAgg = event.target.value;
    setAggregateType(newAgg);

    const newSeries = series.map((row) => (row.id === id ? { ...row, aggregate: newAgg } : row));
    setSeries(newSeries);
  };

  const handleNameChange = (event) => {
    const newName = event.target.value;
    setName(newName);

    const newSeries = series.map((row) => (row.id === id ? { ...row, name: newName } : row));
    setSeries(newSeries);
  };

  const handleModeChange = (event) => {
    const newMode = event.target.value;
    setMode(newMode);

    const newSeries = series.map((row) => (row.id === id ? { ...row, mode: newMode } : row));
    setSeries(newSeries);
  };

  React.useEffect(() => {
    if (y2) {
      const newSeries = series.map((row) => (row.id === id ? { ...row, yaxis: "y2" } : row));
      setSeries(newSeries);
    } else if (!y2) {
      const newSeries = series.map((row) => (row.id === id ? { ...row, yaxis: "y" } : row));
      setSeries(newSeries);
    }
  }, [y2]);

  React.useEffect(() => {
    if (normalize) {
      const newSeries = series.map((row) => (row.id === id
        ? {
          ...row,
          normalize: {
            ...row.normalize,
            type: normalizeType,
            parameter: normalizeParameter
          } }
        : row
      ));
      setSeries(newSeries);
    } else if (!normalize) {
      const newSeries = series.map((row) => (row.id === id
        ? { ...row, normalize: { ...row.normalize, type: "", parameter: y } }
        : row
      ));
      setSeries(newSeries);
    }
  }, [normalize, normalizeType, normalizeParameter, y]);

  React.useEffect(() => {
    if (!useNewNormalizeParameter) {
      setNormalizeParameter(y);
    }
  }, [useNewNormalizeParameter]);

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setType(newType);
    const newSeries = series.map((row) => (row.id === id ? { ...row, type: newType } : row));
    setSeries(newSeries);
  };

  return (
    <Box>
      <Typography>Chart Type</Typography>
      <RadioGroup
        aria-labelledby="plot-type-radio-buttons-group-label"
        value={ type }
        name="plot-type-buttons-group"
        onChange={ handleTypeChange }
        row
      >
        <FormControlLabel value="scatter" control={ <Radio /> } label="Scatter" />
        <FormControlLabel value="bar" control={ <Radio /> } label="Bar" />
        <FormControlLabel value="contour" control={ <Radio /> } label="Contour" />
        <FormControlLabel disabled value="surface3d" control={ <Radio /> } label="3D Surface" />
        <FormControlLabel disabled value="scatter3d" control={ <Radio /> } label="3D Scatter" />
      </RadioGroup>
      <Typography>File</Typography>
      <Select
        id="file-select"
        size="small"
        fullWidth
        value={ file }
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
        value={ x }
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
        value={ y }
        onChange={ handleYChange }
      >
        {availableParams?.map((item) => (
          <MenuItem key={ item } value={ item }>{item}</MenuItem>
        ))}
      </Select>
      {type === "contour"
        && (
          <React.Fragment>
            <Typography>Z Parameter</Typography>
            <Select
              id="z-parameter-select"
              size="small"
              fullWidth
              value={ z }
              onChange={ handleZChange }
            >
              {availableParams?.map((item) => (
                <MenuItem key={ item } value={ item }>{item}</MenuItem>
              ))}
            </Select>
            <Typography>Aggregate Type</Typography>
            <RadioGroup
              aria-labelledby="aggregate-radio-buttons-group-label"
              value={ aggregateType }
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
        value={ name }
        onChange={ handleNameChange }
      />
      <Typography>Mode</Typography>
      <Select
        id="mode-select"
        size="small"
        fullWidth
        value={ mode }
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
              checked={ y2 }
              onChange={ (event) => setY2(event.target.checked) }
            />
          ) }
          label="Enable y-axis"
        />
      </FormGroup>
      <Typography>Normalize</Typography>
      <FormControlLabel
        control={ (
          <Checkbox
            checked={ normalize }
            onChange={ (event) => setNormalize(event.target.checked) }
          />
        ) }
        label="Enable"
      />
      {normalize
        && (
          <React.Fragment>
            <RadioGroup
              aria-labelledby="normalize-radio-buttons-group-label"
              value={ normalizeType }
              name="normalize-buttons-group"
              onChange={ (event) => setNormalizeType(event.target.value) }
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
                  checked={ useNewNormalizeParameter }
                  onChange={ (event) => setUseNewNormalizeParameter(event.target.checked) }
                />
              ) }
              label="Use different parameter"
            />
            <Select
              id="normalize-select"
              size="small"
              fullWidth
              value={ normalizeParameter }
              onChange={ (event) => setNormalizeParameter(event.target.value) }
              disabled={ !useNewNormalizeParameter }
            >
              {availableParams?.map((item) => (
                <MenuItem key={ item } value={ item }>{item}</MenuItem>
              ))}
            </Select>
          </React.Fragment>
        )}
      <Box sx={ { width: "100%", textAlign: "right" } }>
        <Tooltip title="Delete series" placement="right">
          <IconButton onClick={ handleDelete(id) }>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>

  );
}