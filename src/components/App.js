import * as React from "react";
import { MemoryRouter as Router, Routes, Route, Link } from "react-router-dom";

import Titlebar from "components/titlebar/Titlebar";
import Sidebar from "components/sidebar/Sidebar";
import Archive from "components/routes/Archive";
import Cleanup from "components/routes/Cleanup";
import Flamingo from "components/routes/Flamingo";
import Plots from "components/routes/Plots";
import SpaceHogs from "components/routes/SpaceHogs";
import SpaceUtilization from "components/routes/SpaceUtilization";
import Settings from "components/routes/Settings";
import Test from "components/routes/Test";
import { ThemeProvider } from "@mui/material";
import theme from "../theme/theme";

export default function App() {
  return (
    <React.Fragment>
      <ThemeProvider theme={ theme }>
        <Router>
          <Titlebar />
          <Sidebar />
          <Routes>
            {/* <Route path="/" element={ <SpaceHogs /> } /> */}
            <Route path="/cleanup" element={ <Cleanup /> } />
            <Route path="/archive" element={ <Archive /> } />
            <Route path="/utilization" element={ <SpaceUtilization /> } />
            {/* <Route path="/plots" element={ <Plots /> } /> */}
            <Route path="/" element={ <Plots /> } />
            <Route path="/flamingo" element={ <Flamingo /> } />
            <Route path="/settings" element={ <Settings /> } />
            <Route path="/test" element={ <Test /> } />
          </Routes>
        </Router>
      </ThemeProvider>
    </React.Fragment>
  );
}

// import * as React from "react";
// import { post } from "utils/requests";

// import Titlebar from "components/titlebar/Titlebar";
// import DragDropFileContainer from "components/containers/DragDropFileContainer";
// import DataGridTable from "components/containers/DataGridTable";
// import LinePlot from "components/containers/LinePlot";

// import styles from "components/App.module.scss";

// const initialLayout = {
//   width: 800,
//   height: 500,
//   title: "Plot Title",
//   xaxis: {
//     title: "X Label",
//   },
//   yaxis: {
//     title: "Y Label",
//   },
// };

// function App() {
//   const [files, setFiles] = React.useState([]);
//   const [loadedData, setLoadedData] = React.useState({});
//   const [tableData, setTableData] = React.useState([]);
//   const [plotData, setPlotData] = React.useState([]);
//   const [plotLayout, setPlotLayout] = React.useState(initialLayout);

//   React.useEffect(() => {
//     post(
//       JSON.stringify(files),
//       "modify-data",
//       (response) => setLoadedData(response),
//       (response) => console.error(response)
//     );
//   }, [files]);

//   React.useEffect(() => {
//     post(
//       JSON.stringify(tableData),
//       "load-plot-data",
//       (response) => setPlotData(response),
//       (response) => console.error(response)
//     );
//   }, [tableData]);

//   return (
//     <React.Fragment>
//       <Titlebar />

//       <div className={styles.app}>
//         <DragDropFileContainer files={files} setFiles={setFiles} />
//         <DataGridTable data={loadedData} setTableData={setTableData} />
//         <LinePlot data={plotData} layout={plotLayout} />
//       </div>
//     </React.Fragment>
//   );
// }

// export default App;
