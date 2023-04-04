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
              <Route path="/test" element={ <Test /> } />
            </Routes>
          </div>
        </Router>
      </ThemeProvider>
    </React.Fragment>
  );
}
