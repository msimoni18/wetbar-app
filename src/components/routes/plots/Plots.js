import * as React from "react";
import { post, get } from "utils/requests";
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
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArticleIcon from "@mui/icons-material/Article";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import Header from "components/containers/Header";
import DragDropFileContainer from "components/containers/DragDropFileContainer";
import SimpleFileContainer from "components/containers/SimpleFileContainer";
import PlotContainer from "components/containers/PlotContainer";
import ExpressService from "components/containers/ExpressService";

export default function Plots() {
  // File Options
  const [openFileOptions, setOpenFileOptions] = React.useState(false);
  const [openExpressOptions, setOpenExpressOptions] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [searchCriteria, setSearchCriteria] = React.useState("folder");
  const [regex, setRegex] = React.useState("*.xlsx");
  const [skiprows, setSkiprows] = React.useState("");
  const [delimiter, setDelimiter] = React.useState("");
  const [sheets, setSheets] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [loadedData, setLoadedData] = React.useState({});
  const [plotList, setPlotList] = React.useState([]);

  const handleOpenFileOptions = () => {
    get(
      "load-files",
      (response) => setLoadedData(response),
      (error) => console.error(error)
    );
    setOpenFileOptions(true);
  };

  const handleCloseFileOptions = () => {
    setOpenFileOptions(false);
  };

  const handleLoadFilesResponse = (response) => {
    setLoadedData(response);
    setLoading(false);
  };

  const handleLoadFiles = () => {
    setLoading(true);
    post(
      JSON.stringify({
        paths: items,
        search_criteria: searchCriteria,
        regex,
        skiprows,
        delimiter,
        sheets
      }),
      "load-files",
      (response) => handleLoadFilesResponse(response),
      (error) => console.error(error)
    );
  };

  const handleDeleteFilesResponse = (response) => {
    const newData = loadedData.data.filter((item) => response.includes(item.file));
    if (newData.length === 0) {
      setLoadedData((prevData) => ({ ...prevData, data: newData, message: "No files have been loaded." }));
    } else {
      setLoadedData((prevData) => ({ ...prevData, data: newData }));
    }
  };

  const handleDeleteFiles = (pathName) => {
    post(
      JSON.stringify(pathName),
      "delete-loaded-data",
      (response) => handleDeleteFilesResponse(response),
      (error) => console.error(error)
    );
  };

  const deletePlot = React.useCallback(
    (id) => () => {
      setPlotList((prevRows) => prevRows.filter((row) => row !== id));
    }, []
  );

  const handleAddNewPlot = () => {
    const uniqueId = uuid();
    setPlotList((prevItems) => [...prevItems, uniqueId]);
  };

  const handleOpenExpressOptions = () => {
    setOpenExpressOptions(true);
  };

  const handleCloseExpressOptions = () => {
    setOpenExpressOptions(false);
  };

  const actions = [
    {
      icon: <ArticleIcon fontSize="large" />,
      name: "File Options",
      click: handleOpenFileOptions
    },
    {
      icon: <AddCircleIcon fontSize="large" />,
      name: "Add New Plot",
      click: handleAddNewPlot
    },
    {
      icon: <ElectricBoltIcon fontSize="large" />,
      name: "Express Service",
      click: handleOpenExpressOptions
    }
  ];

  return (
    <React.Fragment>
      <Header
        heading="Plots"
        description="Build interactive plots with ease."
      />
      <Box sx={ { display: "flex", justifyContent: "center" } }>
        {actions.map((action) => (
          <Tooltip key={ action.name } title={ action.name }>
            <IconButton key={ action.name } onClick={ action.click }>
              {action.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>
      <Dialog
        open={ openFileOptions }
        onClose={ handleCloseFileOptions }
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>File Options</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Supported file extensions include: .rod, .xlsx, .csv, .txt,
            .cfff.xml
          </DialogContentText>
          <hr />
          <Grid container alignItems="stretch" spacing={ 2 }>
            <Grid item xs={ 12 }>
              <DragDropFileContainer files={ items } setFiles={ setItems } />
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <Box
                sx={ {
                  border: "2px solid black",
                  padding: "10px",
                  borderRadius: "5px",
                  height: "100%"
                } }
              >
                <FormControl>
                  <FormLabel>Search criteria:</FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={ searchCriteria }
                    name="radio-buttons-group"
                  >
                    <FormControlLabel
                      value="file"
                      control={ <Radio /> }
                      label="File"
                      onChange={ (event) => setSearchCriteria(event.target.value) }
                    />
                    <FormControlLabel
                      value="folder"
                      control={ <Radio /> }
                      label="Folder"
                      onChange={ (event) => setSearchCriteria(event.target.value) }
                    />
                  </RadioGroup>
                </FormControl>
                <TextField
                  margin="dense"
                  id="search-criteria"
                  label="Search folders for regex:"
                  type="input"
                  variant="standard"
                  fullWidth
                  value={ regex }
                  onChange={ (event) => setRegex(event.target.value) }
                />
              </Box>
            </Grid>
            <Grid item xs={ 12 } sm={ 6 }>
              <Box
                sx={ {
                  border: "2px solid black",
                  padding: "10px",
                  borderRadius: "5px",
                  height: "100%"
                } }
              >
                <FormControl fullWidth>
                  <FormLabel>
                    Optional inputs for .xlsx, .csv, .txt files:
                  </FormLabel>
                  <TextField
                    margin="dense"
                    id="skiprows"
                    label="Skip Rows"
                    type="input"
                    fullWidth
                    variant="standard"
                    value={ skiprows }
                    onChange={ (event) => setSkiprows(event.target.value) }
                  />
                  <TextField
                    margin="dense"
                    id="delimiter"
                    label="Delimiter"
                    type="input"
                    fullWidth
                    variant="standard"
                    value={ delimiter }
                    onChange={ (event) => setDelimiter(event.target.value) }
                  />
                  <TextField
                    margin="dense"
                    id="sheets"
                    label="Sheets"
                    type="input"
                    fullWidth
                    variant="standard"
                    value={ sheets }
                    onChange={ (event) => setSheets(event.target.value) }
                  />
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={ 12 }>
              <Typography>Loaded data:</Typography>
              <SimpleFileContainer data={ loadedData } handleDelete={ handleDeleteFiles } />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Box sx={ { m: 1, position: "relative" } }>
            <Button
              variant="contained"
              //   sx={buttonSx}
              disabled={ loading }
              onClick={ handleLoadFiles }
            >
              Load Files
            </Button>
            {loading && (
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
            )}
          </Box>
          <Button variant="outlined" onClick={ handleCloseFileOptions }>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <ExpressService
        files={ loadedData.data }
        open={ openExpressOptions }
        handleClose={ handleCloseExpressOptions }
      />
      {plotList.map((item) => (
        <PlotContainer
          key={ item }
          plotId={ item }
          handleDelete={ deletePlot }
        />
      ))}
    </React.Fragment>
  );
}
