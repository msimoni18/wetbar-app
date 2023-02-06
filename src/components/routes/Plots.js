import * as React from "react";
import { useResizeDetector } from "react-resize-detector";
import { post, get } from "utils/requests";
import {
  Box,
  InputLabel,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Checkbox,
  Select,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  CircularProgress,
  Typography
} from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { grey } from "@mui/material/colors";
import DatasetIcon from "@mui/icons-material/Dataset";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArticleIcon from "@mui/icons-material/Article";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SaveIcon from "@mui/icons-material/Save";

import Header from "components/containers/Header";
import DragDropFileContainer from "components/containers/DragDropFileContainer";
import SimpleFileContainer from "components/containers/SimpleFileContainer";
import DataGridTable from "components/containers/DataGridTable";
import LinePlot from "components/containers/LinePlot";
import ResizeablePlot from "components/containers/ResizeablePlot";

import styles from "components/App.module.scss";
import plotStyles from "./Plots.module.scss";

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip { ...props } classes={ { popper: className } } />
))(({ theme }) => ({
  [`&.${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9"
  }
}));

export default function Plots() {
  const { width, height, ref } = useResizeDetector();

  // File Options
  const [openFileOptions, setOpenFileOptions] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [searchCriteria, setSearchCriteria] = React.useState("folder");
  const [regex, setRegex] = React.useState("*.xlsx");
  const [skiprows, setSkiprows] = React.useState("");
  const [delimiter, setDelimiter] = React.useState("");
  const [sheets, setSheets] = React.useState("");
  const [loadedData, setLoadedData] = React.useState({});
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
      (response) => setLoadedData(response),
      (error) => console.log(error)
    );
  };

  React.useEffect(() => {
    setLoading(false);
    // setSuccess(true)
  }, [loadedData]);

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

  // Data
  const [openPlotData, setOpenPlotData] = React.useState(false);
  const [tableRows, setTableRows] = React.useState([]);
  const [plotData, setPlotData] = React.useState([]);

  const handleOpenPlotData = () => {
    setOpenPlotData(true);
  };

  const handleClosePlotData = () => {
    const cellData = [];
    tableRows.forEach((row) => {
      const cells = {
        file: row.selectedFile,
        x: row.selectedX,
        y: row.selectedY,
        name: row.name,
        mode: row.selectedMode
      };
      cellData.push(cells);
    });

    post(
      JSON.stringify(cellData),
      "get-plot-data",
      (response) => setPlotData(response),
      (response) => console.error(response)
    );

    setOpenPlotData(false);
  };

  React.useEffect(() => {
    console.log(plotData);
  }, [plotData]);

  // Layout
  const [openLayoutOptions, setOpenLayoutOptions] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [xLabel, setXLabel] = React.useState("");
  const [yLabel, setYLabel] = React.useState("");
  const [legend, setLegend] = React.useState(true);
  const [majorGridlineChecked, setMajorGridlineChecked] = React.useState(true);
  const [minorGridlineChecked, setMinorGridlineChecked] = React.useState(true);
  const [majorGridlineColor, setMajorGridlineColor] = React.useState("rgba(230, 230, 230, 1)");
  const [minorGridlineColor, setMinorGridlineColor] = React.useState("rgba(216, 216, 216, 1)");
  const [majorLinestyle, setMajorLinestyle] = React.useState("solid");
  const [minorLinestyle, setMinorLinestyle] = React.useState("dot");
  const [fontColor, setFontColor] = React.useState("#444");
  const [paperBgcolor, setPaperBgcolor] = React.useState("rgba(255, 255, 255, 1)");
  const [plotBgcolor, setPlotBgcolor] = React.useState("white");

  const layout = {
    width,
    // height: height,
    font: {
      color: fontColor
    },
    title: {
      text: title
    },
    xaxis: {
      title: xLabel,
      gridcolor: majorGridlineColor,
      griddash: majorLinestyle,
      gridwidth: 1,
      showgrid: majorGridlineChecked,
      minor: {
        gridcolor: minorGridlineColor,
        griddash: minorLinestyle,
        gridwidth: 1,
        showgrid: minorGridlineChecked
      }
    },
    yaxis: {
      title: xLabel,
      gridcolor: majorGridlineColor,
      griddash: majorLinestyle,
      gridwidth: 1,
      showgrid: majorGridlineChecked,
      minor: {
        gridcolor: minorGridlineColor,
        griddash: minorLinestyle,
        gridwidth: 1,
        showgrid: minorGridlineChecked
      }
    },
    showlegend: legend,
    paper_bgcolor: paperBgcolor,
    plot_bgcolor: plotBgcolor
  };

  // TODO: Add done/cancel buttons to each speed dialog window and only execute
  //       update when done is selected and don't update state when cancel is
  //       selected
  const handleOpenLayoutOptions = () => {
    setOpenLayoutOptions(true);
  };

  const handleCloseLayoutOptions = () => {
    setOpenLayoutOptions(false);
  };

  const actions = [
    {
      icon: <ArticleIcon />,
      name: "File Options",
      click: handleOpenFileOptions
    },
    {
      icon: <CheckCircleIcon />,
      name: "Loaded Files",
      click: handleOpenViewLoadedFiles
    },
    {
      icon: <DatasetIcon />,
      name: "Data",
      click: handleOpenPlotData
    },
    {
      icon: <DashboardIcon />,
      name: "Layout",
      click: handleOpenLayoutOptions
    }
    // {
    //   icon: <SaveIcon />,
    //   name: "Save",
    //   click: handleOpenFileOptions,
    // },
  ];

  return (
    <div className={ styles["route-body"] }>
      <Header
        heading="Plots"
        description="Build interactive plots with ease."
      />
      {actions.map((action) => (
        <Tooltip key={ action.name } title={ action.name }>
          <IconButton key={ action.name } onClick={ action.click }>
            {action.icon}
          </IconButton>
        </Tooltip>
      ))}
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
          <SimpleFileContainer files={ viewLoadedData } />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={ handleCloseViewLoadedFiles }>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={ openPlotData }
        onClose={ handleClosePlotData }
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Plot Data</DialogTitle>
        <DialogContent>
          <DataGridTable
            data={ loadedData }
            rows={ tableRows }
            setRows={ setTableRows }
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={ handleClosePlotData }>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={ openLayoutOptions }
        onClose={ handleCloseLayoutOptions }
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Layout Options</DialogTitle>
        <DialogContent>
          <Box>
            <Box
              sx={ {
                border: "2px solid black",
                padding: "10px",
                width: "50%",
                marginBottom: "10px",
                borderRadius: "10px"
              } }
            >
              <FormControl fullWidth>
                <FormLabel>Labels:</FormLabel>
                <TextField
                  margin="dense"
                  id="x-label"
                  label="X-Axis Label"
                  type="input"
                  variant="outlined"
                  value={ xLabel }
                  onChange={ (event) => setXLabel(event.target.value) }
                />
                <TextField
                  margin="dense"
                  id="y-label"
                  label="Y-Axis Label"
                  type="input"
                  variant="outlined"
                  value={ yLabel }
                  onChange={ (event) => setYLabel(event.target.value) }
                />
                <TextField
                  margin="dense"
                  id="title-label"
                  label="Plot Title"
                  type="input"
                  variant="outlined"
                  value={ title }
                  onChange={ (event) => setTitle(event.target.value) }
                />
              </FormControl>
            </Box>
            <Box
              sx={ {
                border: "2px solid black",
                padding: "10px",
                width: "50%",
                marginBottom: "10px",
                borderRadius: "10px"
              } }
            >
              <FormControl fullWidth>
                <FormLabel>Legend:</FormLabel>
                <FormControlLabel
                  control={ (
                    <Checkbox
                      checked={ legend }
                      onClick={ () => setLegend(!legend) }
                    />
                  ) }
                  label="On"
                />
              </FormControl>
            </Box>
            <Box
              sx={ {
                border: "2px solid black",
                padding: "10px",
                width: "50%",
                marginBottom: "10px",
                borderRadius: "10px"
              } }
            >
              <FormControl fullWidth>
                <FormLabel>Gridlines:</FormLabel>
                <Box sx={ { display: "flex", alignItems: "baseline", justifyContent: "space-between" } }>
                  <FormControlLabel
                    control={ (
                      <Checkbox
                        checked={ majorGridlineChecked }
                        onChange={ (event) => setMajorGridlineChecked(event.target.value) }
                      />
                    ) }
                    label="Major"
                  />
                  <HtmlTooltip
                    title={ (
                      <React.Fragment>
                        <Typography color="inherit">hex, rgb, rgba, or named colors</Typography>
                      </React.Fragment>
                    ) }
                    placement="top-start"
                    arrow
                  >
                    <TextField
                      margin="dense"
                      id="major-color"
                      label="Color"
                      type="input"
                      variant="outlined"
                      value={ majorGridlineColor }
                      onChange={ (event) => setMajorGridlineColor(event.target.value) }
                      sx={ { paddingRight: "10px" } }
                    />
                  </HtmlTooltip>
                  <FormControl>
                    <InputLabel id="major-linestyle-label-select">Linestyle</InputLabel>
                    <Select labelId="major-linestyle-label-select" id="major-linestyle-select" label="Linestyle" value={ majorLinestyle } onChange={ (event) => setMajorLinestyle(event.target.value) } sx={ { width: "150px" } }>
                      <MenuItem value="solid">solid</MenuItem>
                      <MenuItem value="dot">dot</MenuItem>
                      <MenuItem value="dash">dash</MenuItem>
                      <MenuItem value="longdash">longdash</MenuItem>
                      <MenuItem value="dashdot">dashdot</MenuItem>
                      <MenuItem value="longdashdot">longdashdot</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={ { display: "flex", alignItems: "baseline", justifyContent: "space-between" } }>
                  <FormControlLabel
                    control={ (
                      <Checkbox
                        checked={ minorGridlineChecked }
                        onChange={ (event) => setMinorGridlineChecked(event.target.value) }
                      />
                    ) }
                    label="Minor"
                  />
                  <HtmlTooltip
                    title={ (
                      <React.Fragment>
                        <Typography color="inherit">hex, rgb, rgba, or named colors</Typography>
                      </React.Fragment>
                    ) }
                    placement="top-start"
                    arrow
                  >
                    <TextField
                      margin="dense"
                      id="minor-color"
                      label="Color"
                      type="input"
                      variant="outlined"
                      value={ minorGridlineColor }
                      onChange={ (event) => setMinorGridlineColor(event.target.value) }
                      sx={ { paddingRight: "10px" } }
                    />
                  </HtmlTooltip>
                  <FormControl>
                    <InputLabel id="minor-linestyle-label-select">Linestyle</InputLabel>
                    <Select
                      labelId="minor-linestyle-label-select"
                      id="minor-linestyle-select"
                      label="Linestyle"
                      value={ minorLinestyle }
                      onChange={ (event) => setMinorLinestyle(event.target.value) }
                      sx={ { width: "150px" } }
                    >
                      <MenuItem value="solid">solid</MenuItem>
                      <MenuItem value="dot">dot</MenuItem>
                      <MenuItem value="dash">dash</MenuItem>
                      <MenuItem value="longdash">longdash</MenuItem>
                      <MenuItem value="dashdot">dashdot</MenuItem>
                      <MenuItem value="longdashdot">longdashdot</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </FormControl>
            </Box>
            <Box
              sx={ {
                border: "2px solid black",
                padding: "10px",
                width: "50%",
                marginBottom: "10px",
                borderRadius: "10px" } }
            >
              <FormControl fullWidth>
                <FormLabel>Colors</FormLabel>
                <HtmlTooltip
                  title={ (
                    <React.Fragment>
                      <Typography color="inherit">hex, rgb, rgba, or named colors</Typography>
                    </React.Fragment>
                  ) }
                  placement="top-start"
                  arrow
                >
                  <TextField
                    margin="dense"
                    id="font-color"
                    label="Font"
                    type="input"
                    variant="outlined"
                    value={ fontColor }
                    onChange={ (event) => setFontColor(event.target.value) }
                    sx={ { paddingRight: "10px" } }
                  />
                </HtmlTooltip>
                <HtmlTooltip
                  title={ (
                    <React.Fragment>
                      <Typography color="inherit">hex, rgb, rgba, or named colors</Typography>
                    </React.Fragment>
                  ) }
                  placement="top-start"
                  arrow
                >
                  <TextField
                    margin="dense"
                    id="paper-bgcolor"
                    label="Paper Background"
                    type="input"
                    variant="outlined"
                    value={ paperBgcolor }
                    onChange={ (event) => setPaperBgcolor(event.target.value) }
                    sx={ { paddingRight: "10px" } }
                  />
                </HtmlTooltip>
                <HtmlTooltip
                  title={ (
                    <React.Fragment>
                      <Typography color="inherit">hex, rgb, rgba, or named colors</Typography>
                    </React.Fragment>
                  ) }
                  placement="top-start"
                  arrow
                >
                  <TextField
                    margin="dense"
                    id="plot-bgcolor"
                    label="Plot Background"
                    type="input"
                    variant="outlined"
                    value={ plotBgcolor }
                    onChange={ (event) => setPlotBgcolor(event.target.value) }
                    sx={ { paddingRight: "10px" } }
                  />
                </HtmlTooltip>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={ handleCloseLayoutOptions }>
            Cancel
          </Button>
          <Button variant="contained" onClick={ handleCloseLayoutOptions }>
            Done
          </Button>
        </DialogActions>
      </Dialog>
      <div ref={ ref } className={ plotStyles["plot-container"] }>
        <LinePlot data={ plotData } layout={ layout } />
      </div>
      <br />
      <ResizeablePlot data={ plotData } layout={ layout } />
    </div>
  );
}
