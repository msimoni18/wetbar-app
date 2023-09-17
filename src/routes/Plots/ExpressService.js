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
  Grid,
  FormLabel,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup
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
  const [plotType, setPlotType] = React.useState("matplotlib");

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
    },
    {
      field: "scaleFactor",
      headerName: "Scale Factor",
      editable: true,
      maxWidth: 125
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
      <Dialog open={ open } onClose={ handleClose } fullWidth maxWidth="lg">
        <DialogTitle>Express Service</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Generate plots for all common parameters in the loaded files.
          </DialogContentText>
          <hr style={ { marginBottom: "15px" } } />
          <Grid container spacing={ 2 }>
            <Grid item xs={ 12 } sm={ 3 }>
              <FormControl fullWidth>
                <TextField
                  id="output-name"
                  variant="outlined"
                  label="Output File Name"
                  value={ outputFilename }
                  onChange={ (event) => setOutputFilename(event.target.value) }
                />
              </FormControl>
            </Grid>
            <Grid item xs={ 12 } sm={ 9 }>
              <FormControl fullWidth>
                <TextField
                  id="output-directory"
                  variant="outlined"
                  label="Output Directory"
                  value={ outputDirectory }
                  onChange={ (event) => setOutputDirectory(event.target.value) }
                />
              </FormControl>
            </Grid>
            <Grid item xs={ 12 }>
              <FormControl>
                <FormLabel id="plot-type-radio-buttons-group-label">
                  Plot Type
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="plot-type-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={ plotType }
                  onChange={ (event) => setPlotType(event.target.value) }
                >
                  <FormControlLabel
                    value="matplotlib"
                    control={ <Radio /> }
                    label="matplotlib"
                  />
                  <FormControlLabel
                    value="plotly"
                    control={ <Radio /> }
                    label="plotly"
                  />
                </RadioGroup>
              </FormControl>
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
          </Grid>
        </DialogContent>
        <DialogActions>
          <RunButton handleClick={ handleRun }>Run</RunButton>
          <Button variant="outlined" onClick={ handleClose }>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default ExpressService;
