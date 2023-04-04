import * as React from "react";
import Plot from "react-plotly.js";
import { useResizeDetector } from "react-resize-detector";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import Header from "components/containers/Header";
import StatCard from "components/containers/StatCard";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// Electron inter process communcation and dialog
const { ipcRenderer } = window.require("electron");

// Dynamically generated TCP (open) port between 3000-3999
const port = ipcRenderer.sendSync("get-port-number");

export default function SpaceHogs() {
  const { width, height, ref } = useResizeDetector();
  const [site, setSite] = React.useState("Knolls");
  const [data, setData] = React.useState({});
  const [rows, setRows] = React.useState([]);
  const [plotData, setPlotData] = React.useState([]);

  const [columnDefs] = React.useState([
    { field: "user", headerName: "User" },
    { field: "size", headerName: "Size" },
    { field: "util", headerName: "Utilization" },
    { field: "size_gt_year", headerName: "Size (> 1 year)" },
    { field: "util_gt_year", headerName: "Utilization (> 1 year)" },
    { field: "split_gt_year", headerName: "Split (> 1 year)" }
  ]);

  const plotLayout = {
    width,
    height: 500,
    xaxis: {
      tickangle: -45
    },
    yaxis: {
      title: "Size (GB)"
    },
    showlegend: false,
    annotations: [
      {
        xref: "paper",
        yref: "paper",
        x: 0.5,
        xanchor: "center",
        y: 1.1,
        yanchor: "bottom",
        text: "Red bars indicate over 12% utilization",
        showarrow: false
      }
    ]
  };

  const defaultColDef = React.useMemo(() => {
    return {
      flex: 1,
      sortable: true,
      resizable: true
    };
  }, []);

  React.useEffect(() => {
    fetch(`http://localhost:${port}/space-hogs`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(site)
    })
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error));
  }, [site]);

  React.useEffect(() => {
    if (Object.keys(data).length > 0) {
      setRows(data.stats);

      const name = data.stats.map((item) => (item.user !== "s1b_rp" ? item.user : null));
      const stat = data.stats.map((item) => (item.user !== "s1b_rp" ? item.size : null));
      const util = data.stats.map((item) => (item.user !== "s1b_rp" ? item.util : null));
      const colors = util.map((val) => (val >= 12 ? "red" : "blue"));

      setPlotData([
        {
          x: name,
          y: stat,
          type: "bar",
          marker: { color: colors }
        }
      ]);
    }
  }, [data]);

  return (
    <React.Fragment>
      <Header
        heading="Space Hogs"
        description="See what coworkers are hogging all of the shared space."
      />
      <Grid container spacing={ 2 }>
        <Grid item xs={ 12 } sm={ 4 } sx={ { textAlign: "center" } }>
          <FormControl>
            <FormLabel id="site-radio-buttons-label">Site</FormLabel>
            <RadioGroup
              aria-labelledby="site-radio-buttons-label"
              defaultValue="Knolls"
              name="site-buttons-group"
            >
              <FormControlLabel
                value="Knolls"
                control={ <Radio /> }
                label="Knolls"
                onChange={ (event) => setSite(event.target.value) }
              />
              <FormControlLabel
                value="Bettis"
                control={ <Radio /> }
                label="Bettis"
                onChange={ (event) => setSite(event.target.value) }
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={ 12 } sm={ 4 }>
          <StatCard title="Total allocation" stat={ `${data.allocation} GB` } />
        </Grid>
        <Grid item xs={ 12 } sm={ 4 }>
          <StatCard title="Last updated" stat={ data.last_update } />
        </Grid>
        <Grid item xs={ 12 }>
          <div className="ag-theme-alpine" style={ { height: 500 } }>
            <AgGridReact
              rowData={ rows }
              columnDefs={ columnDefs }
              defaultColDef={ defaultColDef }
            />
          </div>
        </Grid>
        <Grid item xs={ 12 }>
          <div ref={ ref }>
            <Plot data={ plotData } layout={ plotLayout } />
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
