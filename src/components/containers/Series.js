import React from "react";
import {
  Box,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Series(props) {
  const { id, baseFile, baseX, baseY, baseName, baseMode, handleDelete, data, series, setSeries } = props;
  const [xAvailable, setXAvailable] = React.useState([]);
  const [yAvailable, setYAvailable] = React.useState([]);
  const [file, setFile] = React.useState(baseFile || "");
  const [x, setX] = React.useState(baseX || "");
  const [y, setY] = React.useState(baseY || "");
  const [name, setName] = React.useState(baseName || "");
  const [mode, setMode] = React.useState(baseMode || "lines");

  React.useEffect(() => {
    const item = data.filter((row) => row.file === file);

    setXAvailable(item[0]?.parameters);
    setYAvailable(item[0]?.parameters);
  }, [file]);

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

    const newSeries = series.map((row) => (row.id === id ? { ...row, y: newY } : row));
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

  return (
    <Box>
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
        {xAvailable?.map((item) => (
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
        {yAvailable?.map((item) => (
          <MenuItem key={ item } value={ item }>{item}</MenuItem>
        ))}
      </Select>
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
      <Tooltip title="Delete series" placement="right">
        <IconButton onClick={ handleDelete(id) }>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>

  );
}