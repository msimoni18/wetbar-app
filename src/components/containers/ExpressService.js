import React from "react";
import { v4 as uuid } from "uuid";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  CircularProgress,
  Tooltip,
  Typography,
  Grid
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function ExpressService(props) {
  const {
    files,
    open,
    handleClose
  } = props;

  const [rowData, setRowData] = React.useState([]);
  React.useEffect(() => {
    if (files?.length > 0) {
      const newFiles = files.map((row) => ({ id: uuid(), file: row.file, basename: row.name, name: "" }));
      setRowData(newFiles);
    }
  }, [files]);

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
    { field: "id", hide: true },
    {
      field: "file",
      headerName: "Full Path",
      hide: true
    },
    {
      field: "basename",
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

  return (
    <React.Fragment>
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
            {/* <ExpressService rowData={ newFiles } /> */}
            <div className="ag-theme-alpine" style={ gridStyle }>
              <AgGridReact
                ref={ gridRef }
                rowData={ rowData }
                columnDefs={ columnDefs }
                defaultColDef={ defaultColDef }
                rowSelection="multiple"
                suppressRowClickSelection
              // animateRows
              />
            </div>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Box sx={ { m: 1, position: "relative" } }>
            <Button
              variant="contained"
              //   sx={buttonSx}
              // disabled={ loading }
              // onClick={ handleLoadFiles }
            >
              Run
            </Button>
            {/* {loading && (
              <CircularProgress
                size={ 24 }
                sx={ {
                  color: grey[800],
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px"
                } }
              />
            )} */}
          </Box>
          <Button variant="outlined" onClick={ handleClose }>
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </React.Fragment>
  );
}

export default ExpressService;
