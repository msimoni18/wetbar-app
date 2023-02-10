import * as React from "react";
import { post, socketIO } from "utils/requests";
import { formatBytes, addCommaToNumber } from "utils/utilities";
import Plot from "react-plotly.js";
import { useResizeDetector } from "react-resize-detector";
import { Box, TextField, Slider, Grid, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { v4 as uuid } from "uuid";
import Header from "components/containers/Header";
import RunButton from "components/buttons/RunButton";
import styles from "components/App.module.scss";
import { number } from "prop-types";

const marks = [
  {
    label: "-1",
    value: -1
  },
  {
    label: "2",
    value: 2
  },
  {
    label: "3",
    value: 3
  },
  {
    label: "4",
    value: 4
  },
  {
    label: "5",
    value: 5
  },
  {
    label: "6",
    value: 6
  },
  {
    label: "7",
    value: 7
  },
  {
    label: "8",
    value: 8
  }
];

const columns = [
  {
    field: "extension",
    headerName: "Extension",
    flex: 1,
    minWidth: 125
  },
  {
    field: "bytes",
    type: number,
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
    type: number,
    headerName: "% Bytes",
    valueFormatter: (params) => {
      if (params.value == null) {
        return "";
      }
      return `${params.value}%`;
    }
  },
  {
    field: "count",
    type: number,
    headerName: "Files"
  },
  {
    field: "perc_count",
    type: number,
    headerName: "% Files",
    valueFormatter: (params) => {
      if (params.value == null) {
        return "";
      }
      return `${params.value}%`;
    }
  }
];

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
  const [depth, setDepth] = React.useState(2);
  const [active, setActive] = React.useState(false);

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
    height: "500px",
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
    // const stat = {
    //   ...response.stats,
    //   "total_size": formatBytes(response.stats.total_size)
    // };
    // setStats(stat);

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

    const newExtensions = ext.map((row) => {
      const uniqueId = uuid();
      return { ...row, id: uniqueId };
    });
    setExtensionData(newExtensions);

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

  React.useEffect(() => {
    const [prevObject] = data;
    const prevData = { ...prevObject, maxdepth: depth };
    setData([prevData]);
  }, [depth]);

  return (
    <div className={ styles["route-body"] }>
      <Header
        heading="Space Utilization"
        description="Figure out how much space your taking up."
      />
      <Box sx={ { marginBottom: "2%" } }>
        <TextField
          required
          fullWidth
          label="Directory"
          variant="outlined"
          value={ directory }
          onChange={ (event) => setDirectory(event.target.value) }
        />
      </Box>
      <Box sx={ { paddingBottom: "5%" } }>
        <Grid container spacing={ 6 } alignItems="center">
          <Grid item xs={ 3 }>
            <RunButton active={ active } handleClick={ handleButtonClick } />
          </Grid>
          <Grid item xs={ 5 }>
            <Typography gutterBottom>Depth</Typography>
            <Slider
              aria-label="Depth"
              value={ depth }
              valueLabelDisplay="auto"
              marks={ marks }
              step={ null }
              min={ -1 }
              max={ 8 }
              onChange={ (event) => setDepth(event.target.value) }
            />
          </Grid>
          <Grid item xs={ 4 }>
            <div style={ { display: "flex" } }>
              <div style={ { marginRight: "5px", textAlign: "right" } }>
                <p><b>Total size:</b></p>
                <p><b>File count:</b></p>
                <p><b>Directory count:</b></p>
              </div>
              <div>
                <p>{stats.totalSize}</p>
                <p>{stats.fileCount}</p>
                <p>{stats.directoryCount}</p>
              </div>
            </div>
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={ 2 } alignItems="center">
        <Grid item xs={ 12 } sm={ 12 } md={ 6 }>
          <div ref={ ref }>
            <Plot data={ data } layout={ plotLayout } />
          </div>
        </Grid>
        <Grid item xs={ 12 } sm={ 12 } md={ 6 }>
          <Box sx={ { height: "500px" } }>
            <DataGrid
              rows={ extensionData }
              columns={ columns }
              disableSelectionOnClick
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}
