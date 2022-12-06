import * as React from "react";
import { post } from "utils/requests";

import Titlebar from "components/titlebar/Titlebar";
import DragDropFileContainer from "components/containers/DragDropFileContainer";
import DataGridTable from "components/containers/DataGridTable";
import LinePlot from "components/containers/LinePlot";

import styles from "components/App.module.scss";

const initialLayout = {
  width: 800,
  height: 500,
  title: "Plot Title",
  xaxis: {
    title: "X Label",
  },
  yaxis: {
    title: "Y Label",
  },
};

function App() {
  const [files, setFiles] = React.useState([]);
  const [loadedData, setLoadedData] = React.useState({});
  const [tableData, setTableData] = React.useState([]);
  const [plotData, setPlotData] = React.useState([]);
  const [plotLayout, setPlotLayout] = React.useState(initialLayout);

  React.useEffect(() => {
    post(
      JSON.stringify(files),
      "modify-data",
      (response) => setLoadedData(response),
      (response) => console.error(response)
    );
  }, [files]);

  React.useEffect(() => {
    post(
      JSON.stringify(tableData),
      "load-plot-data",
      (response) => setPlotData(response),
      (response) => console.error(response)
    );
  }, [tableData]);

  return (
    <React.Fragment>
      <Titlebar />

      <div className={styles.app}>
        <DragDropFileContainer files={files} setFiles={setFiles} />
        <DataGridTable data={loadedData} setTableData={setTableData} />
        <LinePlot data={plotData} layout={plotLayout} />
      </div>
    </React.Fragment>
  );
}

export default App;
