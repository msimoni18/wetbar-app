import * as React from "react";
import Plot from "react-plotly.js";
import { useResizeDetector } from "react-resize-detector";
import { v4 as uuid } from "uuid";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { post, get } from "utils/requests";
import { rgbaToString } from "utils/utilities";
import ResizeablePlot from "components/containers/ResizeablePlot";
import ColorSelector from "./ColorSelector";
import Series from "./Series";
import { Accordion, AccordionSummary, AccordionDetails } from "./CustomComponents";
import { lineStyles } from "../../utils/utilities";
import styles from "./PlotContainer.module.scss";

const formatItemStyle = {
  borderLeft: "1px dashed grey",
  paddingLeft: "1rem",
  marginBottom: "2rem"
};

const initialColors = {
  majorGridline: { r: 230, g: 230, b: 230, a: 1 },
  minorGridline: { r: 216, g: 216, b: 216, a: 1 },
  font: { r: 68, g: 68, b: 68, a: 1 },
  plotBackground: { r: 255, g: 255, b: 255, a: 1 }
};

export default function PlotContainer(props) {
  const { plotId, handleDelete } = props;
  const { width, height, ref } = useResizeDetector();
  const [expanded, setExpanded] = React.useState("");
  const [loadedData, setLoadedData] = React.useState([]);

  const handleExpandedChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  React.useEffect(() => {
    get(
      "load-files",
      (response) => setLoadedData(response),
      (error) => console.error(error)
    );
  }, []);

  // Data
  const [series, setSeries] = React.useState([]);

  const deleteSeries = React.useCallback(
    (id) => () => {
      setSeries((prevRows) => prevRows.filter((row) => row.id !== id));
    }, []
  );

  const addNewSeries = () => {
    const uniqueId = uuid();

    const baseSeries = {
      id: uniqueId,
      file: "",
      x: "",
      y: "",
      name: "",
      mode: "lines"
    };

    setSeries((prevItems) => [...prevItems, baseSeries]);
  };

  const [plotData, setPlotData] = React.useState([]);

  const updatePlot = () => {
    const cellData = [];
    series.forEach((row) => {
      const cells = {
        file: row.file,
        x: row.x,
        y: row.y,
        name: row.name,
        mode: row.mode
      };
      cellData.push(cells);
    });

    post(
      JSON.stringify(cellData),
      "get-plot-data",
      (response) => setPlotData(response),
      (response) => console.error(response)
    );
  };

  // Layout
  const [title, setTitle] = React.useState("");
  const [xLabel, setXLabel] = React.useState("");
  const [yLabel, setYLabel] = React.useState("");
  const [legend, setLegend] = React.useState(true);
  const [majorGridlineChecked, setMajorGridlineChecked] = React.useState(true);
  const [minorGridlineChecked, setMinorGridlineChecked] = React.useState(true);
  const [majorGridlineColor, setMajorGridlineColor] = React.useState(initialColors.majorGridline);
  const [minorGridlineColor, setMinorGridlineColor] = React.useState(initialColors.minorGridline);
  const [majorLinestyle, setMajorLinestyle] = React.useState("solid");
  const [minorLinestyle, setMinorLinestyle] = React.useState("dot");
  const [fontColor, setFontColor] = React.useState(initialColors.font);
  const [paperBgcolor, setPaperBgcolor] = React.useState(initialColors.plotBackground);
  const [plotBgcolor, setPlotBgcolor] = React.useState(initialColors.plotBackground);

  const layout = {
    width: width - 20,
    height,
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

  const [isExpanded, setIsExpanded] = React.useState(false);

  return (

    <div className={ styles["plot-container"] }>
      <div
        ref={ ref }
        className={ isExpanded ? styles["plot-container-left"] : styles["plot-container-left-expanded"] }
      >
        <Plot data={ plotData } layout={ layout } />
        <button
          type="button"
          className={ styles["plot-container-handle"] }
          onClick={ () => setIsExpanded(!isExpanded) }
        >
          {"<"}
        </button>
      </div>
      <div className={ styles["plot-container-right"] }>
        <Accordion expanded={ expanded === "series" } onChange={ handleExpandedChange("series") }>
          <AccordionSummary aria-controls="series-content" id="series-header">
            <Typography>Series</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {series?.map((row) => (
              <Box key={ row.id } sx={ formatItemStyle }>
                <Series
                  key={ row.id }
                  id={ row.id }
                  baseFile={ row.file }
                  baseX={ row.x }
                  baseY={ row.y }
                  baseName={ row.name }
                  baseMode={ row.mode }
                  handleDelete={ deleteSeries }
                  data={ loadedData.data }
                  series={ series }
                  setSeries={ setSeries }
                />
              </Box>
            ))}
            <Tooltip title="Add new series" placement="left">
              <IconButton onClick={ addNewSeries }>
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              size="small"
              onClick={ updatePlot }
            >
              Update plot
            </Button>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={ expanded === "labels" } onChange={ handleExpandedChange("labels") }>
          <AccordionSummary aria-controls="labels-content" id="labels-header">
            <Typography>Labels</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={ formatItemStyle }>
              <Typography>Title</Typography>
              <TextField
                margin="dense"
                id="title-label"
                type="input"
                variant="outlined"
                size="small"
                fullWidth
                value={ title }
                onChange={ (event) => setTitle(event.target.value) }
              />
            </Box>
            <Box sx={ formatItemStyle }>
              <Typography>X-Axis</Typography>
              <TextField
                margin="dense"
                id="x-label"
                type="input"
                variant="outlined"
                size="small"
                fullWidth
                value={ xLabel }
                onChange={ (event) => setXLabel(event.target.value) }
              />
            </Box>
            <Box sx={ formatItemStyle }>
              <Typography>Y-Axis</Typography>
              <TextField
                margin="dense"
                id="y-label"
                type="input"
                variant="outlined"
                size="small"
                fullWidth
                value={ yLabel }
                onChange={ (event) => setYLabel(event.target.value) }
              />
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={ expanded === "legend" } onChange={ handleExpandedChange("legend") }>
          <AccordionSummary aria-controls="legend-content" id="legend-header">
            <Typography>Legend</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={ formatItemStyle }>
              <FormControlLabel
                control={ (
                  <Checkbox
                    checked={ legend }
                    onChange={ (event) => setLegend(event.target.checked) }
                  />
                ) }
                label="Enable"
              />
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={ expanded === "gridlines" } onChange={ handleExpandedChange("gridlines") }>
          <AccordionSummary aria-controls="gridlines-content" id="gridlines-header">
            <Typography>Gridlines</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={ formatItemStyle }>
              <Typography>Major</Typography>
              <FormControlLabel
                control={ (
                  <Checkbox
                    checked={ majorGridlineChecked }
                    onChange={ (event) => setMajorGridlineChecked(event.target.checked) }
                  />
                ) }
                label="Enable"
              />
              <Typography>Color</Typography>
              <ColorSelector initialColor={ initialColors.majorGridline } color={ majorGridlineColor } setColor={ setMajorGridlineColor } />
              <Typography>Linestyle</Typography>
              <Select
                id="major-linestyle-select"
                size="small"
                value={ majorLinestyle }
                onChange={ (event) => setMajorLinestyle(event.target.value) }
                sx={ { width: "150px" } }
              >
                {lineStyles.map((item, key) => (
                  <MenuItem key={ key } value={ item }>{item}</MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={ formatItemStyle }>
              <Typography>Minor</Typography>
              <FormControlLabel
                control={ (
                  <Checkbox
                    checked={ minorGridlineChecked }
                    onChange={ (event) => setMinorGridlineChecked(event.target.checked) }
                  />
                ) }
                label="Enable"
              />
              <Typography>Color</Typography>
              <ColorSelector initialColor={ initialColors.minorGridline } color={ minorGridlineColor } setColor={ setMinorGridlineColor } />
              <Typography>Linestyle</Typography>
              <Select
                id="minor-linestyle-select"
                size="small"
                value={ minorLinestyle }
                onChange={ (event) => setMinorLinestyle(event.target.value) }
                sx={ { width: "150px" } }
              >
                {lineStyles.map((item, key) => (
                  <MenuItem key={ key } value={ item }>{item}</MenuItem>
                ))}
              </Select>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={ expanded === "axis" } onChange={ handleExpandedChange("axis") }>
          <AccordionSummary aria-controls="axis-content" id="axis-header">
            <Typography>Axis</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Axis stuff
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={ expanded === "chart" } onChange={ handleExpandedChange("chart") }>
          <AccordionSummary aria-controls="chart-content" id="chart-header">
            <Typography>Chart</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={ formatItemStyle }>
              <Typography>Colors</Typography>
              <Typography>Font</Typography>
              <ColorSelector
                initialColor={ initialColors.font }
                color={ fontColor }
                setColor={ setFontColor }
              />
              <Typography>Paper</Typography>
              <ColorSelector
                initialColor={ initialColors.plotBackground }
                color={ paperBgcolor }
                setColor={ setPaperBgcolor }
              />
              <Typography>Plot</Typography>
              <ColorSelector
                initialColor={ initialColors.plotBackground }
                color={ plotBgcolor }
                setColor={ setPlotBgcolor }
              />
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={ expanded === "settings" } onChange={ handleExpandedChange("settings") }>
          <AccordionSummary aria-controls="settings-content" id="settings-header">
            <Typography>Settings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Tooltip title="Save plot" placement="top">
              <IconButton>
                <SaveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete plot" placement="top">
              <IconButton onClick={ handleDelete(plotId) }>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
