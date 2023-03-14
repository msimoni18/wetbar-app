import * as React from "react";
import { post, socketIO } from "utils/requests";
import { formatBytes, addCommaToNumber } from "utils/utilities";
import Plot from "react-plotly.js";
import { useResizeDetector } from "react-resize-detector";
import { Box, Grid } from "@mui/material";
import Header from "components/containers/Header";
import RunButton from "components/buttons/RunButton";
import DragDropTextField from "components/containers/DragDropTextField";
import StatCard from "components/containers/StatCard";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import styles from "components/App.module.scss";

export default function SpaceUtilization() {
  const { width, height, ref } = useResizeDetector();
  const [directory, setDirectory] = React.useState("");
  const [data, setData] = React.useState([]);
  const [extensionData, setExtensionData] = React.useState([]);
  const [stats, setStats] = React.useState({
    totalSize: 0,
    fileCount: 0,
    directoryCount: 0
  });
  const [depth] = React.useState(-1);
  const [active, setActive] = React.useState(false);

  const gridRef = React.useRef();
  const [columnDefs] = React.useState([
    {
      field: "extension",
      headerName: "Extension"
    },
    {
      field: "bytes",
      headerName: "Bytes",
      valueFormatter: (params) => {
        if (params.value == null) {
          return "";
        }
        const formattedValue = formatBytes(params.value);
        return `${formattedValue}`;
      }
    },
    {
      field: "perc_bytes",
      headerName: "% Bytes",
      valueFormatter: (params) => (`${params.value}%`)
    },
    {
      field: "count",
      headerName: "Files"
    },
    {
      field: "perc_count",
      headerName: "% Files",
      valueFormatter: (params) => (`${params.value}%`)
    }
  ]);

  const defaultColDef = React.useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true
    };
  }, []);

  const [connected, setConnected] = React.useState(false);

  React.useEffect(() => {
    if (connected === false) {
      const socket = socketIO();

      socket.on("connect", (response) => {
        console.log("connected");
        console.log(response);
        setConnected(true);
      });

      socket.on("disconnected", (response) => {
        console.log("disconnected");
        console.log(response);
      });

      socket.on("space-utilization", (stat) => {
        setStats({
          totalSize: formatBytes(stat.total_size),
          fileCount: addCommaToNumber(stat.file_count),
          directoryCount: addCommaToNumber(stat.directory_count)
        });
      });
    }

  });

  const plotLayout = {
    width,
    height: 500,
    margin: {
      t: "25",
      r: "25",
      b: "25",
      l: "25"
    }
  };

  const handlePlotData = (response) => {
    const dir = response.directory;
    const ext = response.extensions;

    const formattedBytes = dir.values.map((value) =>
      formatBytes(value));

    const newData = [
      {
        branchvalues: "total",
        ids: dir.ids,
        labels: dir.labels,
        parents: dir.parents,
        values: dir.values,
        maxdepth: depth,
        type: "treemap",
        text: formattedBytes,
        hovertemplate: "<b>%{text}</b><extra></extra>",
        textinfo: "label",
        root: {
          color: "lightgrey"
        }
      }
    ];

    setData(newData);

    setExtensionData(ext);

    setActive(false);
  };

  const handleButtonClick = () => {
    setActive(true);

    post(
      JSON.stringify(directory),
      "space-utilization",
      // (response) => alert(response),
      (response) => handlePlotData(response),
      (error) => console.error(error)
    );
  };

  return (
    <div className={ styles["route-body"] }>
      <Header
        heading="Space Utilization"
        description="Figure out how much space your taking up."
      />
      <DragDropTextField item={ directory } setItem={ setDirectory } />
      <Grid container spacing={ 2 }>
        <Grid item xs={ 12 } sm={ 6 } md={ 4 }>
          <RunButton active={ active } handleClick={ handleButtonClick } />
          <StatCard title="Total size" stat={ stats.totalSize } />
          <StatCard title="File count" stat={ stats.fileCount } />
          <StatCard title="Directory count" stat={ stats.directoryCount } />
        </Grid>
        <Grid item xs={ 12 } sm={ 6 } md={ 8 }>
          <div className="ag-theme-alpine" style={ { height: 500 } }>
            <AgGridReact
              ref={ gridRef }
              rowData={ extensionData }
              columnDefs={ columnDefs }
              defaultColDef={ defaultColDef }
            />
          </div>
        </Grid>
        <Grid item xs={ 12 }>
          <div ref={ ref }>
            <Plot data={ data } layout={ plotLayout } />
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
