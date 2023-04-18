import * as React from "react";
import { post, get } from "utils/requests";
import { useDispatch, useSelector } from "react-redux";
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
  Tooltip,
  Typography,
  Grid
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArticleIcon from "@mui/icons-material/Article";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import Header from "components/containers/Header";
import DragDropFileContainer from "components/containers/DragDropFileContainer";
import SimpleFileContainer from "components/containers/SimpleFileContainer";
import PlotContainer from "components/containers/PlotContainer";
import ExpressService from "components/containers/ExpressService";
import RunButton from "components/buttons/RunButton";
import { setIsRunning, setIsNotRunning } from "components/appSlice";
import {
  addItems,
  deleteItem,
  changeCriteria,
  changeRegex,
  changeSkipRows,
  changeDelimiter,
  changeSheets,
  addLoadedFiles,
  addNewPlot,
  deletePlot
} from "./plotsSlice";

export default function Plots() {
  const dispatch = useDispatch();
  const { fileOptions, plotList } = useSelector((state) => state.plots);
  const [openFileOptions, setOpenFileOptions] = React.useState(false);
  const [openExpressOptions, setOpenExpressOptions] = React.useState(false);

  const handleOpenFileOptions = () => {
    get(
      "load-files",
      (response) => dispatch(addLoadedFiles(response)),
      (error) => console.error(error)
    );
    setOpenFileOptions(true);
  };

  const handleCloseFileOptions = () => {
    setOpenFileOptions(false);
  };

  const handleLoadFilesResponse = (response) => {
    dispatch(addLoadedFiles(response));
    dispatch(setIsNotRunning());
  };

  const handleLoadFiles = () => {
    dispatch(setIsRunning());
    post(
      JSON.stringify({
        paths: fileOptions.items,
        search_criteria: fileOptions.searchCriteria,
        regex: fileOptions.regex,
        skiprows: fileOptions.skipRows,
        delimiter: fileOptions.delimiter,
        sheets: fileOptions.sheets
      }),
      "load-files",
      (response) => handleLoadFilesResponse(response),
      (error) => console.error(error)
    );
  };

  const handleDeleteLoadedFile = (pathName) => {
    post(
      JSON.stringify(pathName),
      "delete-loaded-data",
      (response) => dispatch(addLoadedFiles(response)),
      (error) => console.error(error)
    );
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
      click: () => dispatch(addNewPlot())
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
              <DragDropFileContainer
                items={ fileOptions.items }
                setItems={ addItems }
                deleteItem={ deleteItem }
              />
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
                    value={ fileOptions.searchCriteria }
                    name="radio-buttons-group"
                  >
                    <FormControlLabel
                      value="file"
                      control={ <Radio /> }
                      label="File"
                      onChange={ (event) => dispatch(changeCriteria(event.target.value)) }
                    />
                    <FormControlLabel
                      value="folder"
                      control={ <Radio /> }
                      label="Folder"
                      onChange={ (event) => dispatch(changeCriteria(event.target.value)) }
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
                  value={ fileOptions.regex }
                  onChange={ (event) => dispatch(changeRegex(event.target.value)) }
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
                    value={ fileOptions.skipRows }
                    onChange={ (event) => dispatch(changeSkipRows(event.target.value)) }
                  />
                  <TextField
                    margin="dense"
                    id="delimiter"
                    label="Delimiter"
                    type="input"
                    fullWidth
                    variant="standard"
                    value={ fileOptions.delimiter }
                    onChange={ (event) => dispatch(changeDelimiter(event.target.value)) }
                  />
                  <TextField
                    margin="dense"
                    id="sheets"
                    label="Sheets"
                    type="input"
                    fullWidth
                    variant="standard"
                    value={ fileOptions.sheets }
                    onChange={ (event) => dispatch(changeSheets(event.target.value)) }
                  />
                </FormControl>
              </Box>
            </Grid>
            <Grid item xs={ 12 }>
              <Typography>Loaded data:</Typography>
              <SimpleFileContainer
                data={ fileOptions.loadedData }
                handleDelete={ handleDeleteLoadedFile }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <RunButton handleClick={ handleLoadFiles }>Load Files</RunButton>
          <Button variant="outlined" onClick={ handleCloseFileOptions }>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <ExpressService
        files={ fileOptions.loadedData.data }
        open={ openExpressOptions }
        handleClose={ handleCloseExpressOptions }
      />
      {plotList.map((id) => (
        <PlotContainer
          key={ id }
          plotId={ id }
          handleDelete={ deletePlot }
        />
      ))}
    </React.Fragment>
  );
}
