import * as React from "react";
import { io } from "socket.io-client";
import { MemoryRouter as Router, Routes, Route, Link } from "react-router-dom";
import Titlebar from "components/titlebar/Titlebar";
import SpaceHogs from "components/routes/spacehogs/SpaceHogs";
import Sidebar from "components/sidebar/Sidebar";
import Archive from "components/routes/archive/Archive";
import Cleanup from "components/routes/cleanup/Cleanup";
import Flamingo from "components/routes/flamingo/Flamingo";
import Plots from "components/routes/plots/Plots";
import SpaceUtilization from "components/routes/spaceutilization/SpaceUtilization";
import Settings from "components/routes/settings/Settings";
import Test from "components/routes/test/Test";
import { ThemeProvider } from "@mui/material";
import theme from "../theme/theme";
import styles from "./App.module.scss";

export default function App() {
  return (
    <React.Fragment>
      <ThemeProvider theme={ theme }>
        <Router>
          <Titlebar />
          <Sidebar />
          <div className={ styles["route-body"] }>
            <Routes>
              <Route path="/" element={ <SpaceHogs /> } />
              <Route path="/cleanup" element={ <Cleanup /> } />
              <Route path="/archive" element={ <Archive /> } />
              <Route path="/utilization" element={ <SpaceUtilization /> } />
              <Route path="/plots" element={ <Plots /> } />
              <Route path="/flamingo" element={ <Flamingo /> } />
              <Route path="/settings" element={ <Settings /> } />
              {/* <Route path="/test" element={ <Test /> } /> */}
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </React.Fragment>
  );
}
