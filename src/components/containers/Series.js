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


export default function Series({ loadedData }) {
  const [file, setFile] = React.useState("");
  const [x, setX] = React.useState("");
  const [y, setY] = React.useState("");
  const [name, setName] = React.useState("");
  const [mode, setMode] = React.useState("lines");

  return (
    <Box>
      <Typography>File</Typography>
      <Select
        id="file-select"
        size="small"
        fullWidth
        value={ file }
        onChange={ (event) => setFile(event.target.value) }
      >
        {loadedData?.map((item) => (
          <MenuItem value={ item.file }>{item.file}</MenuItem>
        ))}
      </Select>
      <Typography>X Parameter</Typography>
      <Select
        id="x-parameter-select"
        size="small"
        fullWidth
        value={ x }
        onChange={ (event) => setX(event.target.value) }
      />
      <Typography>Y Parameter</Typography>
      <Select
        id="y-parameter-select"
        size="small"
        fullWidth
        value={ y }
        onChange={ (event) => setY(event.target.value) }
      />
      <Typography>Name</Typography>
      <TextField
        margin="dense"
        id="name-label"
        type="input"
        variant="outlined"
        size="small"
        fullWidth
        value={ name }
        onChange={ (event) => setName(event.target.value) }
      />
      <Typography>Mode</Typography>
      <Select
        id="mode-select"
        size="small"
        fullWidth
        value={ mode }
        onChange={ (event) => setMode(event.target.value) }
      >
        <MenuItem value="lines">lines</MenuItem>
        <MenuItem value="lines+markers">lines+markers</MenuItem>
        <MenuItem value="markers">markers</MenuItem>
      </Select>
      <Tooltip title="Delete series" placement="right">
        <IconButton>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Box>

  );
}