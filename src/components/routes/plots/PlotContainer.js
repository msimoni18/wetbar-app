import * as React from "react";
import cloneDeep from "lodash.clonedeep";
import Plot from "react-plotly.js";
import { useDispatch, useSelector } from "react-redux";
import { useResizeDetector } from "react-resize-detector";
import { v4 as uuid } from "uuid";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
  TextField,
  Tooltip,
  Typography
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { post, get } from "utils/requests";
import { rgbaToString } from "utils/utilities";
import ColorSelector from "../../containers/ColorSelector";
import Series from "./Series";
import { Accordion, AccordionSummary, AccordionDetails } from "../../containers/CustomComponents";
import { linestyles, colorscales } from "../../../utils/utilities";
import {
  deletePlot,
  addSeries,
  updateLayout,
  updateLayoutFont,
  updateLayoutTitle,
  updateLayoutXAxis,
  updateLayoutXAxisGridMinor,
  updateLayoutYAxis,
  updateLayoutYAxisGridMinor,
  updateLayoutMargin,
  updateColorScaleOptions,
  updateOptions,
  updateOptionsY2,
  updateBarLabels
} from "./plotsSlice";
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

export default function PlotContainer({ id }) {
  const dispatch = useDispatch();
  const { series, layout, data, options } = useSelector((state) => state.plots.plots[id]);

  // Deep copy layout so it is mutable. The Plot component
  // will mutate layout, so it cannot be an immutable object
  // const layout2 = structuredClone(layout); // Only in Node >= v17
  const layout2 = cloneDeep(layout);

  const { width, ref } = useResizeDetector();
  const [expanded, setExpanded] = React.useState("");
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleExpandedChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleUpdatePlotResponse = (response) => {
  };

  const updatePlot = () => {
    const plotData = [];
    series.forEach((row) => {
      const cell = {
        id: row.id,
        file: row.file,
        x: row.x,
        y: row.y,
        z: row.z,
        aggregate: row.aggregate,
        colorscale: row.colorscale,
        reversescale: row.reversescale,
        name: row.name,
        type: row.type,
        mode: row.mode,
        yaxis: row.yaxis,
        normalize: row.normalize
      };
      plotData.push(cell);
    });

    // post(
    //   JSON.stringify(plotData),
    //   "get-plot-data",
    //   (response) => handleUpdatePlotResponse(response),
    //   (response) => console.error(response)
    // );
  };

  const handleLayoutChange = (key, value) => {
    dispatch(updateLayout({ id, newInput: { [key]: value } }));
  };

  const handleFontChange = (key, value) => {
    dispatch(updateLayoutFont({ id, key, newInput: { [key]: value } }));
  };

  const handleTitleChange = (key, value) => {
    dispatch(updateLayoutTitle({ id, newInput: { [key]: value } }));
  };

  const handleXAxisChange = (key, value) => {
    dispatch(updateLayoutXAxis({ id, newInput: { [key]: value } }));
  };

  const handleXAxisMinorGridChange = (key, value) => {
    dispatch(updateLayoutXAxisGridMinor({ id, newInput: { [key]: value } }));
  };

  const handleYAxisChange = (key, value) => {
    dispatch(updateLayoutYAxis({ id, newInput: { [key]: value } }));
  };

  const handleYAxisMinorGridChange = (key, value) => {
    dispatch(updateLayoutYAxisGridMinor({ id, newInput: { [key]: value } }));
  };

  const handleMarginChange = (key, value) => {
    dispatch(updateLayoutMargin({ id, newInput: { [key]: value } }));
  };

  const handleColorScaleChange = (key, value) => {
    dispatch(updateColorScaleOptions({ id, newInput: { [key]: value } }));
  };

  const handleOptionsChange = (key, value) => {
    dispatch(updateOptions({ id, newInput: { [key]: value } }));
  };

  const handleOptionsY2Change = (key, value) => {
    dispatch(updateOptionsY2({ id, newInput: { [key]: value } }));
  };

  const handleBarLabels = (key, value) => {
    dispatch(updateBarLabels({ id, newInput: { [key]: value } }));
  };

  return (
    <div className={ styles["plot-container"] } style={ { height: layout.height } }>
      <div
        ref={ ref }
        className={ isExpanded ? styles["plot-container-left"] : styles["plot-container-left-expanded"] }
      >
        <Plot data={ data } layout={ { width: width - 20, ...layout2 } } />
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
            {Object.keys(series)?.map((seriesId) => (
              <Box key={ seriesId } sx={ formatItemStyle }>
                <Series
                  key={ seriesId }
                  plotId={ id }
                  id={ seriesId }
                />
              </Box>
            ))}
            <Box sx={ { display: "flex", justifyContent: "space-evenly" } }>
              <Tooltip title="Add new series" placement="left">
                <IconButton onClick={ () => dispatch(addSeries(id)) }>
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
            </Box>
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
                value={ layout.title.text }
                onChange={ (event) => handleTitleChange("text", event.target.value) }
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
                value={ layout.xaxis.title }
                onChange={ (event) => handleXAxisChange("title", event.target.value) }
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
                value={ layout.yaxis.title }
                onChange={ (event) => handleYAxisChange("title", event.target.value) }
              />
            </Box>
            <Box sx={ formatItemStyle }>
              <FormControlLabel
                control={ (
                  <Checkbox
                    checked={ options.enableY2 }
                    onChange={ (event) => handleOptionsChange("enableY2", event.target.checked) }
                  />
                ) }
                label="Enable secondary y-axis"
              />
              {options.enableY2
              && (
                <Box>
                  <Typography>Text</Typography>
                  <TextField
                    disabled={ !options.enableY2 }
                    margin="dense"
                    id="y-label2"
                    type="input"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={ options.y2.title }
                    onChange={ (event) => handleOptionsY2Change("y2", event.target.value) }
                  />
                  <Typography>Position</Typography>
                  <Slider
                    value={ options.y2.position }
                    min={ 0 }
                    max={ 1 }
                    step={ 0.01 }
                    getAriaLabel={ () => "ylabel-2-position-slider" }
                    valueLabelDisplay="auto"
                    onChange={ (event, newValue) => handleOptionsY2Change("position", newValue) }
                  />
                </Box>
              )}
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
                    checked={ layout.showlegend }
                    onChange={ (event) => handleLayoutChange("showlegend", event.target.checked) }
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
                    checked={ layout.xaxis.showgrid }
                    onChange={ (event) => setMajorGridlineChecked(event.target.checked) }
                  />
                ) }
                label="Enable"
              />
              <Typography>Color</Typography>
              <ColorSelector initialColor={ initialColors.majorGridline } color={ layout.xaxis.gridcolor } setColor={ setMajorGridlineColor } />
              <Typography>Linestyle</Typography>
              <Select
                id="major-linestyle-select"
                size="small"
                value={ layout.xaxis.griddash }
                onChange={ (event) => setMajorLinestyle(event.target.value) }
                sx={ { width: "150px" } }
              >
                {linestyles.map((item, key) => (
                  <MenuItem key={ key } value={ item }>{item}</MenuItem>
                ))}
              </Select>
            </Box>
            <Box sx={ formatItemStyle }>
              <Typography>Minor</Typography>
              <FormControlLabel
                control={ (
                  <Checkbox
                    checked={ layout.xaxis.minor.showgrid }
                    onChange={ (event) => setMinorGridlineChecked(event.target.checked) }
                  />
                ) }
                label="Enable"
              />
              <Typography>Color</Typography>
              <ColorSelector initialColor={ initialColors.minorGridline } color={ layout.xaxis.minor.gridcolor } setColor={ setMinorGridlineColor } />
              <Typography>Linestyle</Typography>
              <Select
                id="minor-linestyle-select"
                size="small"
                value={ layout.xaxis.minor.griddash }
                onChange={ (event) => setMinorLinestyle(event.target.value) }
                sx={ { width: "150px" } }
              >
                {linestyles.map((item, key) => (
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
              <FormControlLabel
                control={ (
                  <Checkbox
                    checked={ options.enableBarOptions }
                    onChange={ (event) => handleOptionsChange("enableBarOptions", event.target.checked) }
                  />
                ) }
                label="Enable bar chart options"
              />
              {options.enableBarOptions
              && (
                <Box>
                  <Typography>Mode</Typography>
                  <RadioGroup
                    aria-labelledby="barmode-radio-buttons-group-label"
                    value={ layout.barmode }
                    name="barmode-buttons-group"
                    onChange={ (event) => handleLayoutChange("barmode", event.target.value) }
                    row
                  >
                    <FormControlLabel value="group" control={ <Radio /> } label="Group" />
                    <FormControlLabel value="stack" control={ <Radio /> } label="Stack" />
                    <FormControlLabel value="relative" control={ <Radio /> } label="Relative" />
                  </RadioGroup>
                  <FormControlLabel
                    control={ (
                      <Checkbox
                        checked={ options.enableBarLabels }
                        onChange={ (event) => handleBarLabels("enableBarLabels", event.target.checked) }
                      />
                    ) }
                    label="Add bar labels"
                  />
                </Box>
              )}
            </Box>
            <Box sx={ formatItemStyle }>
              <FormControlLabel
                control={ (
                  <Checkbox
                    checked={ options.enableContourOptions }
                    onChange={ (event) => handleOptionsChange("enableContourOptions", event.target.checked) }
                  />
                ) }
                label="Enable contour chart options"
              />
              {options.enableContourOptions
              && (
                <Box>
                  <Typography>Colorscale</Typography>
                  <Select
                    id="colorscale-select"
                    size="small"
                    value={ options.colorscale }
                    onChange={ (event) => handleColorScaleChange("colorscale", event.target.value) }
                    sx={ { width: "150px" } }
                  >
                    {colorscales.map((item, key) => (
                      <MenuItem key={ key } value={ item }>{item}</MenuItem>
                    ))}
                  </Select>
                  <FormControlLabel
                    control={ (
                      <Checkbox
                        checked={ options.reversescale }
                        onChange={ (event) => handleColorScaleChange("reversescale", event.target.checked) }
                      />
                    ) }
                    label="Reverse colorscale"
                  />
                </Box>
              )}
            </Box>
            <Box sx={ formatItemStyle }>
              <Typography>Height</Typography>
              <Slider
                value={ layout.height }
                min={ 200 }
                max={ 800 }
                aria-label="height-slider"
                valueLabelDisplay="auto"
                onChange={ (event, newValue) => handleLayoutChange("layout", newValue) }
              />
            </Box>
            <Box sx={ formatItemStyle }>
              <Typography>Font Size</Typography>
              <Slider
                value={ layout.font.size }
                min={ 8 }
                max={ 32 }
                aria-label="font-size-slider"
                valueLabelDisplay="auto"
                onChange={ (event, newValue) => handleFontChange("font", newValue) }
              />
            </Box>
            <Box sx={ formatItemStyle }>
              <Typography>Margin</Typography>
              <Typography>Top</Typography>
              <Slider
                value={ layout.margin.t }
                min={ 0 }
                max={ 200 }
                aria-label="top-margin-slider"
                valueLabelDisplay="auto"
                onChange={ (event, newValue) => handleMarginChange("t", newValue) }
              />
              <Typography>Bottom</Typography>
              <Slider
                value={ layout.margin.b }
                min={ 0 }
                max={ 200 }
                aria-label="bottom-margin-slider"
                valueLabelDisplay="auto"
                onChange={ (event, newValue) => handleMarginChange("b", newValue) }
              />
              <Typography>Left</Typography>
              <Slider
                value={ layout.margin.l }
                min={ 0 }
                max={ 200 }
                aria-label="left-margin-slider"
                valueLabelDisplay="auto"
                onChange={ (event, newValue) => handleMarginChange("l", newValue) }
              />
              <Typography>Right</Typography>
              <Slider
                value={ layout.margin.r }
                min={ 0 }
                max={ 200 }
                aria-label="right-margin-slider"
                valueLabelDisplay="auto"
                onChange={ (event, newValue) => handleMarginChange("r", newValue) }
              />
            </Box>
            <Box sx={ formatItemStyle }>
              <Typography>Colors</Typography>
              <Typography>Font</Typography>
              <ColorSelector
                initialColor={ initialColors.font }
                color={ layout.font.color }
                setColor={ setFontColor }
              />
              <Typography>Paper</Typography>
              <ColorSelector
                initialColor={ initialColors.plotBackground }
                color={ layout.paper_bgcolor }
                setColor={ setPaperBgcolor }
              />
              <Typography>Plot</Typography>
              <ColorSelector
                initialColor={ initialColors.plotBackground }
                color={ layout.plot_bgcolor }
                setColor={ setPlotBgcolor }
              />
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={ expanded === "annotate" } onChange={ handleExpandedChange("annotate") }>
          <AccordionSummary aria-controls="annotate-content" id="annotate-header">
            <Typography>Annotate</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>Vertical line options</Typography>
            <Typography>Horizontal line options</Typography>
            <Typography>Custom (diagonal) line options</Typography>
            <Typography>Vertical rectangle options</Typography>
            <Typography>Horizontal rectangle options</Typography>
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
              <IconButton onClick={ () => dispatch(deletePlot(id)) }>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
