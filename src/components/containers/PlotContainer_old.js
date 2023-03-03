import * as React from "react";
import { useResizeDetector } from "react-resize-detector";
import { post } from "utils/requests";
import { rgbaToString } from "utils/utilities";
import {
  Box,
  InputLabel,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Checkbox,
  Select,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Tooltip,
  IconButton
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import DatasetIcon from "@mui/icons-material/Dataset";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import ResizeablePlot from "components/containers/ResizeablePlot";
import DataGridTable from "components/containers/DataGridTable";
import ColorSelector from "components/containers/ColorSelector";
import { HtmlTooltip } from "components/containers/tooltips/HtmlTooltip";
import styles from "./PlotContainer.module.scss";

export default function PlotContainer() {
  const { width, height, ref } = useResizeDetector();

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

  // Layout
  const [openLayoutOptions, setOpenLayoutOptions] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [xLabel, setXLabel] = React.useState("");
  const [yLabel, setYLabel] = React.useState("");
  const [legend, setLegend] = React.useState(true);
  const [majorGridlineChecked, setMajorGridlineChecked] = React.useState(true);
  const [minorGridlineChecked, setMinorGridlineChecked] = React.useState(true);
  const [majorGridlineColor, setMajorGridlineColor] = React.useState({ r: 230, g: 230, b: 230, a: 1 });
  const [minorGridlineColor, setMinorGridlineColor] = React.useState({ r: 216, g: 216, b: 216, a: 1 });
  const [majorLinestyle, setMajorLinestyle] = React.useState("solid");
  const [minorLinestyle, setMinorLinestyle] = React.useState("dot");
  const [fontColor, setFontColor] = React.useState({ r: 68, g: 68, b: 68, a: 1 });
  const [paperBgcolor, setPaperBgcolor] = React.useState({ r: 255, g: 255, b: 255, a: 1 });
  const [plotBgcolor, setPlotBgcolor] = React.useState({ r: 255, g: 255, b: 255, a: 1 });

  const layout = {
    width,
    // height: height,
    font: {
      color: rgbaToString(fontColor)
    },
    title: {
      text: title
    },
    xaxis: {
      title: xLabel,
      gridcolor: rgbaToString(majorGridlineColor),
      griddash: majorLinestyle,
      gridwidth: 1,
      showgrid: majorGridlineChecked,
      minor: {
        gridcolor: rgbaToString(minorGridlineColor),
        griddash: minorLinestyle,
        gridwidth: 1,
        showgrid: minorGridlineChecked
      }
    },
    yaxis: {
      title: yLabel,
      gridcolor: rgbaToString(majorGridlineColor),
      griddash: majorLinestyle,
      gridwidth: 1,
      showgrid: majorGridlineChecked,
      minor: {
        gridcolor: rgbaToString(minorGridlineColor),
        griddash: minorLinestyle,
        gridwidth: 1,
        showgrid: minorGridlineChecked
      }
    },
    showlegend: legend,
    paper_bgcolor: rgbaToString(paperBgcolor),
    plot_bgcolor: rgbaToString(plotBgcolor)
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
      icon: <DatasetIcon fontSize="inherit" />,
      name: "Data",
      click: handleOpenPlotData
    },
    {
      icon: <DashboardIcon fontSize="medium" />,
      name: "Layout",
      click: handleOpenLayoutOptions
    },
    {
      icon: <SaveIcon fontSize="medium" />,
      name: "Save"
    //   click: handleOpenFileOptions,
    },
    {
      icon: <DeleteIcon fontSize="medium" />,
      name: "Delete"
    //   click: deletePlot(plotId)
    }
  ];

  return (
    <div className={ styles["plot-container-body"] }>
      <Box sx={ { margin: "auto", display: "flex", alignItems: "center", justifyContent: "center" } }>
        <ResizeablePlot data={ plotData } layout={ layout } />
        <Box sx={ { display: "block", width: "50px" } }>
          {actions.map((action) => (
            <Tooltip key={ action.name } title={ action.name } placement="left">
              <IconButton size="medium" key={ action.name } onClick={ action.click }>
                {action.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      </Box>
      <Dialog
        open={ openPlotData }
        onClose={ handleClosePlotData }
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle>Plot Data</DialogTitle>
        <DialogContent>
          <DataGridTable
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
                  label="X-Axis"
                  type="input"
                  variant="outlined"
                  size="small"
                  value={ xLabel }
                  onChange={ (event) => setXLabel(event.target.value) }
                />
                <TextField
                  margin="dense"
                  id="y-label"
                  label="Y-Axis"
                  type="input"
                  variant="outlined"
                  size="small"
                  value={ yLabel }
                  onChange={ (event) => setYLabel(event.target.value) }
                />
                <TextField
                  margin="dense"
                  id="title-label"
                  label="Plot Title"
                  type="input"
                  variant="outlined"
                  size="small"
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
                <Box sx={ { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" } }>
                  <FormControlLabel
                    control={ (
                      <Checkbox
                        checked={ majorGridlineChecked }
                        onChange={ (event) => setMajorGridlineChecked(event.target.value) }
                      />
                    ) }
                    label="Major"
                  />
                  <ColorSelector color={ majorGridlineColor } setColor={ setMajorGridlineColor } />
                  <FormControl size="small">
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
                <Box sx={ { display: "flex", alignItems: "center", justifyContent: "space-between" } }>
                  <FormControlLabel
                    control={ (
                      <Checkbox
                        checked={ minorGridlineChecked }
                        onChange={ (event) => setMinorGridlineChecked(event.target.value) }
                      />
                    ) }
                    label="Minor"
                  />
                  <ColorSelector color={ minorGridlineColor } setColor={ setMinorGridlineColor } />
                  <FormControl size="small">
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
                <Box sx={ { display: "flex", alignItems: "center", justifyContent: "space-evenly" } }>
                  <Typography>Font:</Typography>
                  <ColorSelector color={ fontColor } setColor={ setFontColor } />
                  <Typography>Paper:</Typography>
                  <ColorSelector color={ paperBgcolor } setColor={ setPaperBgcolor } />
                  <Typography>Plot:</Typography>
                  <ColorSelector color={ plotBgcolor } setColor={ setPlotBgcolor } />
                </Box>
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
    </div>
  );
}
