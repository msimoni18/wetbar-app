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
  Tooltip
} from "@mui/material";
import { grey } from "@mui/material/colors";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArticleIcon from "@mui/icons-material/Article";
import Header from "components/containers/Header";
import DragDropFileContainer from "components/containers/DragDropFileContainer";
import SimpleFileContainer from "components/containers/SimpleFileContainer";
import PlotContainer from "components/containers/PlotContainer";
import styles from "components/App.module.scss";

export default function Plots() {
  // File Options
  const [openFileOptions, setOpenFileOptions] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [searchCriteria, setSearchCriteria] = React.useState("folder");
  const [regex, setRegex] = React.useState("*.xlsx");
  const [skiprows, setSkiprows] = React.useState("");
  const [delimiter, setDelimiter] = React.useState("");
  const [sheets, setSheets] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  // const [success, setSuccess] = React.useState(false);

  //   const buttonSx = {
  //     ...(success && {
  //         bgcolor: green[500],
  //         '&:hover': {
  //             bgcolor: green[700]
  //         }
  //     })
  //   }

  const handleOpenFileOptions = () => {
    setOpenFileOptions(true);
  };

  const handleCloseFileOptions = () => {
    setOpenFileOptions(false);
  };

  const handleLoadFiles = () => {
    setLoading(true);
    // setSuccess(false);
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
      // (response) => setLoadedData(response),
      (response) => setLoading(false),
      (error) => console.log(error)
    );
  };

  // Loaded Files
  const [openViewLoadedFiles, setOpenViewLoadedFiles] = React.useState(false);
  const [viewLoadedData, setViewLoadedData] = React.useState({});

  const handleOpenViewLoadedFiles = () => {
    get(
      "get-loaded-data",
      (response) => setViewLoadedData(response),
      (error) => console.error(error)
    );
    setOpenViewLoadedFiles(true);
  };

  const handleCloseViewLoadedFiles = () => {
    setOpenViewLoadedFiles(false);
  };

  const [plotList, setPlotList] = React.useState([]);

  const handleAddNewPlot = () => {
    const uniqueId = uuid();
    setPlotList(plotList.concat(<PlotContainer key={ uniqueId } />));
  };

  const actions = [
    {
      icon: <ArticleIcon fontSize="large" />,
      name: "File Options",
      click: handleOpenFileOptions
    },
    {
      icon: <CheckCircleIcon fontSize="large" />,
      name: "Loaded Files",
      click: handleOpenViewLoadedFiles
    },
    {
      icon: <AddCircleIcon fontSize="large" />,
      name: "Add New Plot",
      click: handleAddNewPlot
    }
  ];

  return (
    <div className={ styles["route-body"] }>
      <Header
        heading="Plots"
        description="Build interactive plots with ease."
      />
      <Box sx={ { display: "flex", justifyContent: "center", border: "1px solid black", borderRadius: "10px", width: "20%", margin: "auto", marginBottom: "15px" } }>
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
          <DragDropFileContainer files={ items } setFiles={ setItems } />
          <Box sx={ { display: "flex" } }>
            <Box
              sx={ {
                border: "2px solid black",
                padding: "10px",
                width: "50%",
                marginRight: "10px",
                borderRadius: "10px"
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
            <Box
              sx={ {
                border: "2px solid black",
                padding: "10px",
                width: "50%",
                marginLeft: "10px",
                borderRadius: "10px"
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={ handleCloseFileOptions }>
            Cancel
          </Button>
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
        </DialogActions>
      </Dialog>
      <Dialog
        open={ openViewLoadedFiles }
        onClose={ handleCloseViewLoadedFiles }
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Loaded Files</DialogTitle>
        <DialogContent>
          <SimpleFileContainer data={ viewLoadedData } />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={ handleCloseViewLoadedFiles }>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      {plotList}
    </div>
  );
}
