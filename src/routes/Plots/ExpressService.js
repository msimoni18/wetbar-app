import React, { Fragment, useEffect } from "react";
import { useSelector } from "react-redux";
import { post } from "utils/requests";
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Grid
} from "@mui/material";
import RunButton from "components/buttons/RunButton";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function ExpressService({ open, handleClose }) {
  const { loadedData } = useSelector((state) => state.plots.fileOptions);

  const [rowData, setRowData] = React.useState([]);

  useEffect(() => {
    const data = loadedData.data?.map((row) => ({ checkbox: true, file: row.file, name: row.name }));
    setRowData(data);
  }, [loadedData]);

  const [outputDirectory, setOutputDirectory] = React.useState("");
  const [outputFilename, setOutputFilename] = React.useState("All_Parameters");

  const gridRef = React.useRef();
  const gridStyle = React.useMemo(() => ({ height: 400 }), []);
  const [columnDefs] = React.useState([
    {
      field: "checkbox",
      headerName: "",
      headerCheckboxSelection: true,
      checkboxSelection: true,
      pinned: true,
      maxWidth: 50
    },
    {
      field: "file",
      headerName: "File"
    },
    {
      field: "name",
      headerName: "Name",
      editable: true
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

  const handleResponse = (response) => {
    console.log(response);
  };

  const handleRun = () => {
    const selectedRows = gridRef.current.api.getSelectedRows();

    if (selectedRows.length === 0) {
      alert("No rows have been selected. Select rows then try again.");
    } else {
      post(
        JSON.stringify(selectedRows),
        "express-service-plots",
        (response) => handleResponse(response),
        (error) => console.error(error)
      );
    }
  };

  return (
    <Fragment>
      <Dialog
        open={ open }
        onClose={ handleClose }
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Express Service</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Generate plots for all common parameters in the loaded files.
          </DialogContentText>
          <hr />
          <Grid container alignItems="stretch" spacing={ 2 }>
            <Grid item xs={ 12 }>
              <TextField
                margin="dense"
                id="output-directory"
                label="Output Directory"
                type="input"
                fullWidth
                variant="standard"
                value={ outputDirectory }
                onChange={ (event) => setOutputDirectory(event.target.value) }
              />
              <TextField
                margin="dense"
                id="output-filename"
                label="Output Filename"
                type="input"
                fullWidth
                variant="standard"
                value={ outputFilename }
                onChange={ (event) => setOutputFilename(event.target.value) }
              />
            </Grid>
          </Grid>
          <Grid item xs={ 12 }>
            <div className="ag-theme-alpine" style={ gridStyle }>
              <AgGridReact
                ref={ gridRef }
                rowData={ rowData }
                columnDefs={ columnDefs }
                defaultColDef={ defaultColDef }
                rowSelection="multiple"
                suppressRowClickSelection
              />
            </div>
          </Grid>
        </DialogContent>
        <DialogActions>
          <RunButton handleClick={ handleRun }>
            Run
          </RunButton>
          <Button variant="outlined" onClick={ handleClose }>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default ExpressService;
