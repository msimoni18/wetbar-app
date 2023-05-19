import * as React from "react";
import cloneDeep from "lodash.clonedeep";
import Plot from "react-plotly.js";
import { useDispatch, useSelector } from "react-redux";
import { useResizeDetector } from "react-resize-detector";
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import { post } from "utils/requests";
import Annotate from "./accordion/Annotate";
import Series from "./Series";
import Labels from "./accordion/Labels";
import Legend from "./accordion/Legend";
import { Accordion, AccordionSummary, AccordionDetails } from "../../components/containers/CustomComponents";
import Gridlines from "./accordion/Gridlines";
import Chart from "./accordion/Chart";
import {
  deletePlot,
  addSeries,
  addData
} from "./plotsSlice";
import styles from "./PlotContainer.module.scss";
import { formatItemStyle } from "./accordion/styles";

export default function PlotContainer({ id }) {
  const dispatch = useDispatch();
  const { series, layout, data, options } = useSelector((state) => state.plots.plots[id]);

  // Deep copy layout so it is mutable. The Plot component
  // will mutate layout, so it cannot be an immutable object
  // const layout2 = structuredClone(layout); // Only in Node >= v17
  const layoutCopy = cloneDeep(layout);
  const dataCopy = cloneDeep(data);

  const { width, ref } = useResizeDetector();
  const [expanded, setExpanded] = React.useState("");
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleExpandedChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const handleUpdatePlotResponse = (response) => {
    dispatch(addData({ id, newData: response }));
  };

  const updatePlot = () => {
    const plotData = [];

    Object.keys(series).forEach((item) => {
      const row = series[item];
      const cell = {
        id: row.id,
        file: row.file,
        x: row.x,
        y: row.y,
        z: row.z,
        aggregate: row.aggregate,
        colorscale: options.colorscale,
        reversescale: options.reversescale,
        name: row.name,
        type: row.type,
        mode: row.mode,
        yaxis: row.yaxis,
        normalize: row.normalize
      };
      plotData.push(cell);
    });

    post(
      JSON.stringify(plotData),
      "get-plot-data",
      (response) => handleUpdatePlotResponse(response),
      (response) => console.error(response)
    );
  };

  return (
    <div className={ styles["plot-container"] } style={ { height: layout.height } }>
      <div
        ref={ ref }
        className={ isExpanded ? styles["plot-container-left"] : styles["plot-container-left-expanded"] }
      >
        <Plot data={ dataCopy } layout={ { width: width - 20, ...layoutCopy } } />
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
            <Labels id={ id } />
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={ expanded === "legend" } onChange={ handleExpandedChange("legend") }>
          <AccordionSummary aria-controls="legend-content" id="legend-header">
            <Typography>Legend</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Legend id={ id } />
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={ expanded === "gridlines" } onChange={ handleExpandedChange("gridlines") }>
          <AccordionSummary aria-controls="gridlines-content" id="gridlines-header">
            <Typography>Gridlines</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Gridlines id={ id } />
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
            <Chart id={ id } />
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={ expanded === "annotate" } onChange={ handleExpandedChange("annotate") }>
          <AccordionSummary aria-controls="annotate-content" id="annotate-header">
            <Typography>Annotate</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Annotate id={ id } />
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
