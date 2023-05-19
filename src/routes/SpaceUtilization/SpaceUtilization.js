import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { post, socketIO } from "utils/requests";
import { formatBytes, addCommaToNumber } from "utils/utilities";
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import Header from "components/containers/Header";
import RunButton from "components/buttons/RunButton";
import DragDropTextField from "components/containers/DragDropTextField";
import StatCard from "components/cards/StatCard";
import TreemapPlot from "components/plots/TreemapPlot";
import SpaceUtilizationTable from "components/tables/SpaceUtilizationTable";
import { setIsRunning, setIsNotRunning } from "../../appSlice";
import { changeFolder } from "./spaceUtilizationSlice";

export default function SpaceUtilization() {
  const dispatch = useDispatch();
  const { folder } = useSelector((state) => state.spaceutilization);
  const [connected, setConnected] = React.useState(false);
  const [data, setData] = React.useState({});
  const [plotData, setPlotData] = React.useState([]);
  const [extensionData, setExtensionData] = React.useState([]);
  const [stats, setStats] = React.useState({
    totalSize: 0,
    fileCount: 0,
    directoryCount: 0
  });
  const [depth, setDepth] = React.useState(-1);

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
  }, []);

  const handleResponse = (response) => {
    console.log("handleResponse");
    setData(response);
    dispatch(setIsNotRunning());
  };

  const handleButtonClick = () => {
    dispatch(setIsRunning());
    setPlotData([]);
    setExtensionData([]);
    setStats({
      totalSize: 0,
      fileCount: 0,
      directoryCount: 0
    });

    post(
      JSON.stringify(folder),
      "space-utilization",
      (response) => handleResponse(response),
      (error) => console.error(error)
    );
  };

  React.useEffect(() => {
    if (Object.keys(data).length > 0) {
      console.log("useEffect - setExtensionData");
      setExtensionData(data.extensions);
    }
  }, [data]);

  React.useEffect(() => {
    if (extensionData.length > 0) {
      const timer = setTimeout(() => {
        console.log("useEffect - setPlotData");
        const dir = data.directory;
        const formattedBytes = dir.values?.map((value) => formatBytes(value));

        const hovertext = [];
        formattedBytes.forEach((item, num) => {
          const textLabel = `${dir.labels[num]}<br>${item}`;
          hovertext.push(textLabel);
        });

        const newData = [
          {
            branchvalues: "total",
            ids: dir.ids,
            labels: dir.labels,
            parents: dir.parents,
            values: dir.values,
            maxdepth: depth,
            type: "treemap",
            text: hovertext,
            hovertemplate: "<b>%{text}</b><extra></extra>",
            textinfo: "label",
            root: {
              color: "lightgrey"
            }
          }
        ];
        setPlotData(newData);

      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [extensionData]);

  const handleDepthChange = (event) => {
    console.log(
      "Start spinner on depth change."
    );
    const newDepth = event.target.value;
    const newData = plotData[0];
    setDepth(newDepth);
    setPlotData([{ ...newData, maxdepth: newDepth }]);
  };

  return (
    <React.Fragment>
      <Header
        heading="Space Utilization"
        description="Figure out how much space your taking up."
      />
      <Grid container spacing={ 2 }>
        <Grid item xs={ 12 }>
          <DragDropTextField item={ folder } setItem={ changeFolder } />
        </Grid>
        <Grid item xs={ 12 } md={ 3 } sx={ { display: "flex", justifyContent: "center" } }>
          <RunButton handleClick={ handleButtonClick }>
            Run
          </RunButton>
        </Grid>
        <Grid item xs={ 4 } md={ 3 }>
          <StatCard title="Total size" stat={ stats.totalSize } />
        </Grid>
        <Grid item xs={ 4 } md={ 3 }>
          <StatCard title="File count" stat={ stats.fileCount } />
        </Grid>
        <Grid item xs={ 4 } md={ 3 }>
          <StatCard title="Directory count" stat={ stats.directoryCount } />
        </Grid>
        <Grid item xs={ 12 }>
          <SpaceUtilizationTable data={ extensionData } />
        </Grid>
        <Grid item xs={ 12 }>
          <Box sx={ { display: "flex", justifyContent: "center" } }>
            {plotData.length > 0 && (
              <FormControl sx={ { m: 1, minWidth: 120 } } size="small">
                <InputLabel id="depth-select-label">Depth</InputLabel>
                <Select
                  labelId="depth-select-label"
                  id="depth-select-small"
                  value={ depth }
                  label="Depth"
                  onChange={ handleDepthChange }
                >
                  <MenuItem value={ -1 }>All</MenuItem>
                  <MenuItem value={ 2 }>2</MenuItem>
                  <MenuItem value={ 3 }>3</MenuItem>
                  <MenuItem value={ 4 }>4</MenuItem>
                  <MenuItem value={ 5 }>5</MenuItem>
                  <MenuItem value={ 6 }>6</MenuItem>
                  <MenuItem value={ 7 }>7</MenuItem>
                  <MenuItem value={ 8 }>8</MenuItem>
                  <MenuItem value={ 9 }>9</MenuItem>
                  <MenuItem value={ 10 }>10</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>
          <div style={ { display: "flex", justifyContent: "center" } }>
            <TreemapPlot data={ plotData } />
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
