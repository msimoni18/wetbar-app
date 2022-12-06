import * as React from "react";
import PropTypes from "prop-types";
import { Button, Select, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { v4 as uuid } from "uuid";

const FileSelect = (props) => {
  const { value, row } = props;

  const [file, setFile] = React.useState("");

  const handleChange = (event) => {
    setFile(event.target.value);
    row.selectedFile = event.target.value;
  };

  return (
    <Select id="file-select" value={file} onChange={handleChange} fullWidth>
      {value?.map((item, index) => (
        <MenuItem key={index} value={item}>
          {item}
        </MenuItem>
      ))}
    </Select>
  );
};

FileSelect.propTypes = {
  value: PropTypes.array,
};

const ParameterSelect = (props) => {
  const {
    field,
    data = {},
    row: { selectedFile },
  } = props;

  const [parameter, setParameter] = React.useState("");
  const [availableParams, setAvailableParams] = React.useState([]);

  // You can probably do this a better way, but I added this for simplicity
  React.useEffect(() => {
    if (selectedFile) {
      setAvailableParams(data[selectedFile].parameters);
    }
  }, [selectedFile, data]);

  const handleChange = (event) => {
    setParameter(event.target.value);
    if (field === "x") {
      props.row.selectedX = event.target.value;
    } else if (field === "y") {
      props.row.selectedY = event.target.value;
    }
  };

  return (
    <Select
      id="parameter-select"
      value={parameter}
      onChange={handleChange}
      fullWidth
    >
      {availableParams?.map((item, index) => (
        <MenuItem key={index} value={item}>
          {item}
        </MenuItem>
      ))}
    </Select>
  );
};

export default function DataGridTable(props) {
  const { data } = props;
  const files = Object.keys(data);

  const [rows, setRows] = React.useState([]);

  const columns = [
    {
      field: "file",
      headerName: "File",
      flex: 1,
      renderCell: FileSelect,
    },
    {
      field: "x",
      headerName: "X",
      flex: 0.5,
      renderCell: (props) => ParameterSelect({ ...props, data }),
    },
    {
      field: "y",
      headerName: "Y",
      flex: 0.5,
      renderCell: (props) => ParameterSelect({ ...props, data }),
    },
    {
      field: "actions",
      headerName: "Delete",
      type: "actions",
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={deleteRow(params.id)}
        />,
      ],
    },
    {
      field: "selectedFile",
      hideable: true,
    },
    {
      field: "selectedX",
      hideable: true,
    },
    {
      field: "selectedY",
      hideable: true,
    },
  ];

  const handleClick = () => {
    const uniqueId = uuid();
    const newRow = {
      id: uniqueId,
      file: files,
      x: [],
      y: [],
      selectedFile: null,
      selectedX: null,
      selectedY: null,
    };
    setRows((prevState) => [...prevState, newRow]);
  };

  const deleteRow = React.useCallback(
    (id) => () => {
      setTimeout(() => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      });
    },
    []
  );

  const getData = () => {
    console.log(rows);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClick}>
        Add row
      </Button>
      <Button variant="contained" onClick={getData}>
        Print table data
      </Button>
      <div style={{ height: 300, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableSelectionOnClick
          columnVisibilityModel={{
            selectedFile: false,
            selectedX: false,
            selectedY: false,
          }}
        />
      </div>
    </div>
  );
}
