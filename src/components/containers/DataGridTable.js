import * as React from "react";
import PropTypes from "prop-types";
import { Button, Select, MenuItem, Autocomplete, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { v4 as uuid } from "uuid";

const FileSelect = (props) => {
  const { value, row } = props;

  const [file, setFile] = React.useState(row.selectedFile || "");

  const handleChange = (event) => {
    setFile(event.target.value);
    row.selectedFile = event.target.value;
  };

  return (
    <Select id="file-select" value={ file } onChange={ handleChange } fullWidth>
      {value?.map((item, index) => (
        <MenuItem key={ index } value={ item }>
          {item}
        </MenuItem>
      ))}
    </Select>
  );
};

FileSelect.propTypes = {
  value: PropTypes.array
};

const ParameterSelect = (props) => {
  const {
    field,
    formattedData = {},
    row: { selectedFile, selectedX, selectedY }
  } = props;

  const [parameter, setParameter] = React.useState(
    field === "x" ? selectedX || "" : selectedY || ""
  );

  const [availableParams, setAvailableParams] = React.useState([]);

  React.useEffect(() => {
    if (selectedFile) {
      setAvailableParams(formattedData[selectedFile]);
    }
  }, [selectedFile, formattedData]);

  const handleChange = (event, newInputValue) => {
    setParameter(newInputValue);
    if (field === "x") {
      props.row.selectedX = newInputValue;
    } else if (field === "y") {
      props.row.selectedY = newInputValue;
    }
  };

  return (
    <Autocomplete
      disablePortal
      id="parameter-select-combo-box"
      options={ availableParams }
      inputValue={ parameter }
      onInputChange={ handleChange }
      fullWidth
      renderInput={ (params) => <TextField { ...params } /> }
    />
  );
};

const ModeSelect = (props) => {
  const { row } = props;

  const [mode, setMode] = React.useState(row.selectedMode || "lines");

  const handleChange = (event) => {
    setMode(event.target.value);
    row.selectedMode = event.target.value;
  };

  return (
    <Select id="mode-select" value={ mode } onChange={ handleChange } fullWidth>
      <MenuItem value="lines">lines</MenuItem>
      <MenuItem value="lines+markers">lines+markers</MenuItem>
      <MenuItem value="markers">markers</MenuItem>
    </Select>
  );
};

export default function DataGridTable(props) {
  const { data, rows, setRows } = props;

  // Convert data into object containing file as key and parameters as value
  const formattedData = {};
  if (Object.keys(data).length > 0) {
    data.data.forEach((row) => {
      formattedData[row.file] = row.parameters;
    });
  }

  const files = Object.keys(formattedData);

  const deleteRow = React.useCallback(
    (id) => () => {
      setTimeout(() => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      });
    },
    []
  );

  const columns = [
    {
      field: "file",
      headerName: "File",
      flex: 1,
      minWidth: 600,
      renderCell: FileSelect
    },
    {
      field: "x",
      headerName: "X",
      flex: 0.5,
      minWidth: 200,
      renderCell: (prop) => ParameterSelect({ ...prop, formattedData })
    },
    {
      field: "y",
      headerName: "Y",
      flex: 0.5,
      minWidth: 200,
      renderCell: (prop) => ParameterSelect({ ...prop, formattedData })
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
      minWidth: 200,
      editable: true
    },
    {
      field: "mode",
      headerName: "Mode",
      flex: 0.5,
      minWidth: 180,
      renderCell: ModeSelect
    },
    {
      field: "actions",
      headerName: "Delete",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={ <DeleteIcon /> }
          label="Delete"
          onClick={ deleteRow(params.id) }
        />
      ]
    },
    {
      field: "selectedFile",
      hideable: true
    },
    {
      field: "selectedX",
      hideable: true
    },
    {
      field: "selectedY",
      hideable: true
    },
    {
      field: "selectedMode",
      hideable: true
    }
  ];

  const handleClick = () => {
    const uniqueId = uuid();
    const newRow = {
      id: uniqueId,
      file: files,
      x: [],
      y: [],
      mode: "lines",
      name: "",
      selectedFile: null,
      selectedX: null,
      selectedY: null,
      selectedMode: "lines"
    };
    setRows((prevState) => [...prevState, newRow]);
  };

  const commitCellEdit = (prop) => {
    const { field, id, value } = prop;
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row)));
  };

  console.log(rows);

  return (
    <div>
      <Button variant="contained" onClick={ handleClick }>
        Add row
      </Button>
      <div style={ { height: 500, width: "100%" } }>
        <DataGrid
          rows={ rows }
          columns={ columns }
          disableSelectionOnClick
          columnVisibilityModel={ {
            selectedFile: false,
            selectedX: false,
            selectedY: false,
            selectedMode: false
          } }
          onCellEditCommit={ commitCellEdit }
        />
      </div>
    </div>
  );
}
