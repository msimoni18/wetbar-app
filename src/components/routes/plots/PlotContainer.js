import * as React from "react";
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
import ResizeablePlot from "components/routes/test/ResizeablePlot";
import ColorSelector from "../../containers/ColorSelector";
import Series from "./Series";
import { Accordion, AccordionSummary, AccordionDetails } from "../../containers/CustomComponents";
import { linestyles, colorscales } from "../../../utils/utilities";
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
  const dispatch = useDispatch();
  const { plotId, handleDelete } = props;
  const { width, ref } = useResizeDetector();
  const [expanded, setExpanded] = React.useState("");
  const [isExpanded, setIsExpanded] = React.useState(false);
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
      z: "",
      aggregate: "min",
      colorscale: "Jet",
      reversescale: true,
      name: "",
      type: "scatter",
      mode: "lines",
      yaxis: "y",
      normalize: {
        type: "",
        parameter: ""
      }
    };

    setSeries((prevItems) => [...prevItems, baseSeries]);
  };

  const [plotData, setPlotData] = React.useState([]);

  const handleUpdatePlotResponse = (response) => {
    setPlotData(response);
  };

  const updatePlot = () => {
    const cellData = [];
    series.forEach((row) => {
      const cells = {
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
      cellData.push(cells);
    });

    post(
      JSON.stringify(cellData),
      "get-plot-data",
      (response) => handleUpdatePlotResponse(response),
      (response) => console.error(response)
    );
  };

  // Layout
  const [height, setHeight] = React.useState(400);
  const [title, setTitle] = React.useState("");
  const [fontSize, setFontSize] = React.useState(12);
  const [xLabel, setXLabel] = React.useState("");
  const [yLabel, setYLabel] = React.useState("");
  const [enableYAxis2, setEnableYAxis2] = React.useState(false);
  const [yLabel2, setYLabel2] = React.useState("");
  const [yLabel2Position, setYLabel2Position] = React.useState(1);
  const [legend, setLegend] = React.useState(false);
  const [majorGridlineChecked, setMajorGridlineChecked] = React.useState(true);
  const [minorGridlineChecked, setMinorGridlineChecked] = React.useState(true);
  const [majorGridlineColor, setMajorGridlineColor] = React.useState(initialColors.majorGridline);
  const [minorGridlineColor, setMinorGridlineColor] = React.useState(initialColors.minorGridline);
  const [majorLinestyle, setMajorLinestyle] = React.useState("solid");
  const [minorLinestyle, setMinorLinestyle] = React.useState("dot");
  const [fontColor, setFontColor] = React.useState(initialColors.font);
  const [paperBgcolor, setPaperBgcolor] = React.useState(initialColors.plotBackground);
  const [plotBgcolor, setPlotBgcolor] = React.useState(initialColors.plotBackground);
  const [bottomMargin, setBottomMargin] = React.useState(80);
  const [leftMargin, setLeftMargin] = React.useState(80);
  const [topMargin, setTopMargin] = React.useState(80);
  const [rightMargin, setRightMargin] = React.useState(80);
  const [barMode, setBarMode] = React.useState("group");
  const [enableBarOptions, setEnableBarOptions] = React.useState(false);
  const [enableBarLabels, setEnableBarLabels] = React.useState(false);
  const [enableContourOptions, setEnableContourOptions] = React.useState(false);
  const [colorscale, setColorscale] = React.useState("Jet");
  const [enableReverseColorscale, setEnableReverseColorscale] = React.useState(true);

  const [layout, setLayout] = React.useState({
    width: width - 20,
    height,
    font: {
      color: rgbaToString(fontColor),
      size: fontSize
    },
    title: {
      text: title
    },
    xaxis: {
      title: xLabel,
      domain: [0, 1],
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
    plot_bgcolor: rgbaToString(plotBgcolor),
    margin: {
      b: bottomMargin,
      l: leftMargin,
      t: topMargin,
      r: rightMargin
    },
    barmode: barMode
  });

  React.useEffect(() => {
    setLayout((prevLayout) => (
      {
        ...prevLayout,
        width: width - 20,
        height,
        showlegend: legend,
        paper_bgcolor: rgbaToString(paperBgcolor),
        plot_bgcolor: rgbaToString(plotBgcolor),
        barmode: barMode
      }));
  }, [width, height, legend, paperBgcolor, plotBgcolor, barMode]);

  React.useEffect(() => {
    setLayout((prevLayout) => (
      {
        ...prevLayout,
        font: {
          color: rgbaToString(fontColor),
          size: fontSize
        }
      }));
  }, [fontColor, fontSize]);

  React.useEffect(() => {
    setLayout((prevLayout) => (
      {
        ...prevLayout,
        title: {
          text: title
        }
      }));
  }, [title]);

  React.useEffect(() => {
    setLayout((prevLayout) => (
      {
        ...prevLayout,
        xaxis: {
          title: xLabel,
          gridcolor: rgbaToString(majorGridlineColor),
          griddash: majorLinestyle,
          showgrid: majorGridlineChecked,
          minor: {
            gridcolor: rgbaToString(minorGridlineColor),
            griddash: minorLinestyle,
            showgrid: minorGridlineChecked
          }
        },
        yaxis: {
          title: yLabel,
          gridcolor: rgbaToString(majorGridlineColor),
          griddash: majorLinestyle,
          showgrid: majorGridlineChecked,
          minor: {
            gridcolor: rgbaToString(minorGridlineColor),
            griddash: minorLinestyle,
            showgrid: minorGridlineChecked
          }
        }
      }));
  }, [
    xLabel, yLabel,
    majorGridlineChecked, majorGridlineColor, majorLinestyle,
    minorGridlineChecked, minorGridlineColor, minorLinestyle
  ]);

  React.useEffect(() => {
    setLayout((prevLayout) => (
      {
        ...prevLayout,
        margin: {
          b: bottomMargin,
          l: leftMargin,
          t: topMargin,
          r: rightMargin
        }
      }));
  }, [bottomMargin, leftMargin, topMargin, rightMargin]);

  React.useEffect(() => {
    if (enableYAxis2) {
      setLayout((prevLayout) => ({
        ...prevLayout,
        xaxis: {
          ...prevLayout.xaxis,
          domain: [0, yLabel2Position]
        },
        yaxis2: {
          title: yLabel2,
          showgrid: false,
          minor: {
            showgrid: false
          },
          anchor: "free",
          overlaying: "y",
          side: "right",
          position: yLabel2Position
        } }));
    } else if (!enableYAxis2) {
      setLayout((prevLayout) => ({
        ...prevLayout,
        xaxis: {
          ...prevLayout.xaxis,
          domain: [0, 1]
        },
        yaxis2: {}
      }));
    }
  }, [yLabel2, yLabel2Position, enableYAxis2]);

  React.useEffect(() => {
    const newPlotData = [];
    if (enableBarLabels) {
      plotData.forEach((item) => {
        if (item.type === "bar") {
          newPlotData.push({
            ...item,
            text: item.y.map(String),
            textposition: "auto"
          });
        } else {
          newPlotData.push(item);
        }
      });
    } else {
      plotData.forEach((item) => {
        if (item.type === "bar") {
          delete item.text;
          delete item.textposition;
        }
        newPlotData.push(item);
      });
    }
    setPlotData(newPlotData);
  }, [enableBarLabels]);

  React.useEffect(() => {
    const newPlotData = [{
      ...plotData[0],
      colorscale,
      reversescale: enableReverseColorscale
    }];

    setPlotData(newPlotData);
  }, [colorscale, enableReverseColorscale]);

  return (
    <div className={ styles["plot-container"] } style={ { height } }>
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
                  handleDelete={ deleteSeries }
                  data={ loadedData.data }
                  series={ series }
                  setSeries={ setSeries }
                />
              </Box>
            ))}
            <Box sx={ { display: "flex", justifyContent: "space-evenly" } }>
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
            <Box sx={ formatItemStyle }>
              <FormControlLabel
                control={ (
                  <Checkbox
                    checked={ enableYAxis2 }
                    onChange={ (event) => setEnableYAxis2(event.target.checked) }
                  />
                ) }
                label="Enable secondary y-axis"
              />
              {enableYAxis2
              && (
                <Box>
                  <Typography>Text</Typography>
                  <TextField
                    disabled={ !enableYAxis2 }
                    margin="dense"
                    id="y-label2"
                    type="input"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={ yLabel2 }
                    onChange={ (event) => setYLabel2(event.target.value) }
                  />
                  <Typography>Position</Typography>
                  <Slider
                    value={ yLabel2Position }
                    min={ 0 }
                    max={ 1 }
                    step={ 0.01 }
                    getAriaLabel={ () => "ylabel-2-position-slider" }
                    valueLabelDisplay="auto"
                    onChange={ (event, newValue) => setYLabel2Position(newValue) }
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
                    checked={ enableBarOptions }
                    onChange={ (event) => setEnableBarOptions(event.target.checked) }
                  />
                ) }
                label="Enable bar chart options"
              />
              {enableBarOptions
              && (
                <Box>
                  <Typography>Mode</Typography>
                  <RadioGroup
                    aria-labelledby="barmode-radio-buttons-group-label"
                    value={ barMode }
                    name="barmode-buttons-group"
                    onChange={ (event) => setBarMode(event.target.value) }
                    row
                  >
                    <FormControlLabel value="group" control={ <Radio /> } label="Group" />
                    <FormControlLabel value="stack" control={ <Radio /> } label="Stack" />
                    <FormControlLabel value="relative" control={ <Radio /> } label="Relative" />
                  </RadioGroup>
                  <FormControlLabel
                    control={ (
                      <Checkbox
                        checked={ enableBarLabels }
                        onChange={ (event) => setEnableBarLabels(event.target.checked) }
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
                    checked={ enableContourOptions }
                    onChange={ (event) => setEnableContourOptions(event.target.checked) }
                  />
                ) }
                label="Enable contour chart options"
              />
              {enableContourOptions
              && (
                <Box>
                  <Typography>Colorscale</Typography>
                  <Select
                    id="colorscale-select"
                    size="small"
                    value={ colorscale }
                    onChange={ (event) => setColorscale(event.target.value) }
                    sx={ { width: "150px" } }
                  >
                    {colorscales.map((item, key) => (
                      <MenuItem key={ key } value={ item }>{item}</MenuItem>
                    ))}
                  </Select>
                  <FormControlLabel
                    control={ (
                      <Checkbox
                        checked={ enableReverseColorscale }
                        onChange={ () => setEnableReverseColorscale(!enableReverseColorscale) }
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
                value={ height }
                min={ 200 }
                max={ 800 }
                aria-label="height-slider"
                valueLabelDisplay="auto"
                onChange={ (event, newValue) => setHeight(newValue) }
              />
            </Box>
            <Box sx={ formatItemStyle }>
              <Typography>Font Size</Typography>
              <Slider
                value={ fontSize }
                min={ 8 }
                max={ 32 }
                aria-label="font-size-slider"
                valueLabelDisplay="auto"
                onChange={ (event, newValue) => setFontSize(newValue) }
              />
            </Box>
            <Box sx={ formatItemStyle }>
              <Typography>Margin</Typography>
              <Typography>Top</Typography>
              <Slider
                value={ topMargin }
                min={ 0 }
                max={ 200 }
                aria-label="top-margin-slider"
                valueLabelDisplay="auto"
                onChange={ (event, newValue) => setTopMargin(newValue) }
              />
              <Typography>Bottom</Typography>
              <Slider
                value={ bottomMargin }
                min={ 0 }
                max={ 200 }
                aria-label="bottom-margin-slider"
                valueLabelDisplay="auto"
                onChange={ (event, newValue) => setBottomMargin(newValue) }
              />
              <Typography>Left</Typography>
              <Slider
                value={ leftMargin }
                min={ 0 }
                max={ 200 }
                aria-label="left-margin-slider"
                valueLabelDisplay="auto"
                onChange={ (event, newValue) => setLeftMargin(newValue) }
              />
              <Typography>Right</Typography>
              <Slider
                value={ rightMargin }
                min={ 0 }
                max={ 200 }
                aria-label="right-margin-slider"
                valueLabelDisplay="auto"
                onChange={ (event, newValue) => setRightMargin(newValue) }
              />
            </Box>
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
              <IconButton onClick={ () => dispatch(handleDelete(plotId)) }>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
