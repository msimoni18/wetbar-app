import * as React from "react";
import { io } from "socket.io-client";
import { v4 as uuid } from "uuid";
import { post } from "utils/requests";
import { formatBytes } from "utils/utilities";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Tooltip,
  Typography
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Header from "components/containers/Header";
import DragDropFileContainer from "components/containers/DragDropFileContainer";
import ListContainer from "components/containers/ListContainer";
import RunButton from "components/buttons/RunButton";
import DeleteTableRow from "components/buttons/DeleteTableRow";
import StatCard from "components/containers/StatCard";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import styles from "components/App.module.scss";

// Electron Inter Process Communication and dialog
const { ipcRenderer } = window.require("electron");

// Dynamically generated TCP (open) port between 3000-3999
const port = ipcRenderer.sendSync("get-port-number");

export default function Cleanup() {
  const [items, setItems] = React.useState([]);
  const [runOption, setRunOption] = React.useState("dryRun");
  const [filesToDelete, setFilesToDelete] = React.useState([]);

  const [directoryCount, setDirectoryCount] = React.useState(0);
  const [fileCount, setFileCount] = React.useState(0);
  const [spaceReduction, setSpaceReduction] = React.useState("0");
  const [totalTime, setTotalTime] = React.useState(0);

  const [active, setActive] = React.useState(false);

  const [connected, setConnected] = React.useState(false);

  React.useEffect(() => {
    if (connected === false) {
      const socket = io(`http://localhost:${port}`, {
        transports: ["websocket"],
        cors: {
          origin: `http://localhost:${port}`
        }
      });

      socket.on("connect", (data) => {
        console.log("connected");
        console.log(data);
        setConnected(true);
      });

      socket.on("disconnect", (data) => {
        console.log("disconnected");
        console.log(data);
      });

      socket.on("cleanup", (data) => {
        console.log(data);
        setDirectoryCount(data.directory);
        setSpaceReduction(formatBytes(data.size));
        setFileCount(data.files);
        setTotalTime(data.time);
      });

      return function cleanup() {
        console.log("disconnecting socket");
        socket.disconnect();
      };
    }
  }, []);

  const gridRef = React.useRef();
  // const containerStyle = React.useMemo(() => ({ width: '100%', height: '100%' }), []);
  const gridStyle = React.useMemo(() => ({ height: 400 }), []);
  const [rowData] = React.useState([
    { id: uuid(), file: "*.taskinfo" },
    { id: uuid(), file: "*.tasklog" },
    { id: uuid(), file: "*.screen" },
    { id: uuid(), file: "*CARPET*.h5" },
    { id: uuid(), file: "*PCO*.h5" },
    { id: uuid(), file: "*SS_Plots*.xlsx" },
    { id: uuid(), file: "*SS_Plots*.png" },
    { id: uuid(), file: "*TR_DPR_Plots*.xlsx" },
    { id: uuid(), file: "*TR_DPR_Plots*.png" }
  ]);

  const [columnDefs] = React.useState([
    {
      field: "checkbox",
      headerName: "",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      pinned: true,
      maxWidth: 50
    },
    { field: "id", hide: true },
    {
      field: "file",
      headerName: "File",
      editable: true
    },
    {
      field: "delete",
      headerName: "Delete",
      maxWidth: 80,
      cellRenderer: DeleteTableRow
    }
  ]);

  const defaultColDef = React.useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true
    };
  });

  const addRow = () => {
    gridRef.current.api.applyTransaction({ add: [{ id: uuid(), file: "" }] });
  };

  const handleResponse = (response) => {
    setFilesToDelete(response.files);
    setActive(false);
  };

  const handleClick = () => {
    const selectedRows = gridRef.current.api.getSelectedRows();

    if ((runOption === "dryRun" || runOption === "deleteNoDryRun") && (items.length === 0 || selectedRows.length === 0)) {
      alert("Folders must be provided and rows must be checked in the table before cleaning up files.");
    } else if (runOption === "deleteAfterDryRun" && filesToDelete.length === 0) {
      alert("No files were found during the previous dry run.");
    } else {
      setActive(true);
      post(
        JSON.stringify({
          option: runOption,
          folders: items,
          files: filesToDelete,
          extensions: selectedRows
        }),
        "cleanup",
        (response) => handleResponse(response),
        (error) => console.error(error)
      );
    }
  };

  return (
    <div className={ styles["route-body"] }>
      <Header
        heading="Cleanup"
        description="Easily delete unwanted files to clear shared space for your coworkers."
      />
      <Grid container spacing={ 2 }>
        <Grid item xs={ 12 }>
          <DragDropFileContainer files={ items } setFiles={ setItems } />
        </Grid>
        <Grid item xs={ 12 } sm={ 6 }>
          <StatCard title="Directories searched" stat={ directoryCount } />
          <StatCard title="Files deleted" stat={ fileCount } />
          <StatCard title="Total space reduction" stat={ spaceReduction } />
          <StatCard title="Time elapsed (H:M:S)" stat={ totalTime } />
        </Grid>
        <Grid item xs={ 12 } sm={ 6 }>
          <Box>
            <div className="ag-theme-alpine" style={ gridStyle }>
              <AgGridReact
                ref={ gridRef }
                rowData={ rowData }
                columnDefs={ columnDefs }
                defaultColDef={ defaultColDef }
                rowSelection="multiple"
                suppressRowClickSelection
                animateRows
              />
            </div>
            <Tooltip title="Add new row" placement="right">
              <IconButton onClick={ addRow }>
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
        <Grid item xs={ 12 }>
          <Box sx={ { display: "flex", alignItems: "center", justifyContent: "space-around" } }>
            <FormControl>
              <FormLabel id="options-group-label">Options</FormLabel>
              <RadioGroup
                aria-labelledby="options-group-label"
                value={ runOption }
                name="options-group"
              >
                <FormControlLabel
                  value="dryRun"
                  control={ <Radio /> }
                  label="Dry run"
                  onChange={ (event) => setRunOption(event.target.value) }
                />
                <FormControlLabel
                  value="deleteAfterDryRun"
                  control={ <Radio /> }
                  label="Delete files found after dry run"
                  onChange={ (event) => setRunOption(event.target.value) }
                />
                <FormControlLabel
                  value="deleteNoDryRun"
                  control={ <Radio /> }
                  label="Delete files, no dry run"
                  onChange={ (event) => setRunOption(event.target.value) }
                />
              </RadioGroup>
            </FormControl>
            <RunButton active={ active } handleClick={ handleClick } />
          </Box>
        </Grid>
        <Grid item xs={ 12 }>
          {runOption === "dryRun"
            ? <Typography>Files found after dry run:</Typography>
            : <Typography>Files deleted:</Typography>}
          <ListContainer files={ filesToDelete } />
        </Grid>
      </Grid>
    </div>
  );
}
