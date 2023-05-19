import React, { Fragment, useState, useEffect, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import { post, socketIO } from "utils/requests";
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
import RunButton from "components/buttons/RunButton";
import DeleteTableRow from "components/buttons/DeleteTableRow";
import CleanupFilesTable from "components/tables/CleanupFilesTable";
import { AgGridReact } from "ag-grid-react";
import { setIsRunning, setIsNotRunning } from "../../appSlice";
import Stats from "./Stats";
import { addFolders, deleteFolder, changeOption, addFiles, updateStats } from "./cleanupSlice";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function Cleanup() {
  const dispatch = useDispatch();
  const { folders, option, files } = useSelector((state) => state.cleanup);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (connected === false) {
      const socket = socketIO();

      socket.on("connect", () => {
        setConnected(true);
      });

      socket.on("disconnect", () => {
      });

      socket.on("cleanup", (data) => {
        dispatch(updateStats({
          dirCount: data.directory,
          fileCount: data.files,
          spaceReduction: data.size,
          totalTime: data.time
        }));
      });
    }
  }, [connected]);

  const gridRef = useRef();
  const gridStyle = useMemo(() => ({ height: 300 }), []);
  const [rowData] = useState([
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

  const [columnDefs] = useState([
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

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true
    };
  }, []);

  const addRow = () => {
    gridRef.current.api.applyTransaction({ add: [{ id: uuid(), file: "" }] });
  };

  const handleResponse = (response) => {
    dispatch(addFiles(response.data));
    dispatch(setIsNotRunning());
  };

  const handleClick = () => {
    dispatch(addFiles([]));
    const selectedRows = gridRef.current.api.getSelectedRows();

    if ((option === "dryRun" || option === "deleteNoDryRun") && (folders.length === 0 || selectedRows.length === 0)) {
      alert("Folders must be provided and rows must be checked in the table before cleaning up files."); // eslint-disable-line no-alert
    } else if (option === "deleteAfterDryRun" && files.length === 0) {
      alert("No files were found during the previous dry run."); // eslint-disable-line no-alert
    } else {
      dispatch(setIsRunning());
      post(
        JSON.stringify({
          option,
          folders,
          files,
          extensions: selectedRows
        }),
        "cleanup",
        (response) => handleResponse(response),
        (error) => console.error(error)
      );
    }
  };

  return (
    <Fragment>
      <Header
        heading="Cleanup"
        description="Easily delete unwanted files to clear shared space for your coworkers."
      />
      <Grid container spacing={ 2 }>
        <Grid item xs={ 12 }>
          <DragDropFileContainer
            items={ folders }
            setItems={ addFolders }
            deleteItem={ deleteFolder }
          />
        </Grid>
        <Grid item xs={ 12 } sm={ 8 }>
          <Grid item xs={ 12 }>
            <FormControl>
              <FormLabel id="options-group-label">Options</FormLabel>
              <RadioGroup
                aria-labelledby="options-group-label"
                value={ option }
                name="options-group"
                row
              >
                <FormControlLabel
                  value="dryRun"
                  control={ <Radio /> }
                  label="Dry run"
                  onChange={ (event) => dispatch(changeOption(event.target.value)) }
                />
                <FormControlLabel
                  value="deleteAfterDryRun"
                  control={ <Radio /> }
                  label="Delete files found after dry run"
                  onChange={ (event) => dispatch(changeOption(event.target.value)) }
                />
                <FormControlLabel
                  value="deleteNoDryRun"
                  control={ <Radio /> }
                  label="Delete files, no dry run"
                  onChange={ (event) => dispatch(changeOption(event.target.value)) }
                />
              </RadioGroup>
            </FormControl>
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
            <Box sx={ {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "1rem"
            } }
            >
              <Tooltip title="Add new row" placement="left">
                <IconButton onClick={ addRow }>
                  <AddCircleIcon />
                </IconButton>
              </Tooltip>
              <Box sx={ { paddingLeft: "5rem" } }>
                <RunButton handleClick={ handleClick }>Run</RunButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs={ 12 } sm={ 4 }>
          <Stats />
        </Grid>
        <Grid item xs={ 12 }>
          <Typography>Files found during previous dry run:</Typography>
          <CleanupFilesTable data={ files } />
        </Grid>
      </Grid>
    </Fragment>
  );
}
