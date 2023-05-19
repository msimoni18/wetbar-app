import React, { lazy, Suspense } from "react";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import Titlebar from "components/Titlebar/Titlebar";
import { ThemeProvider } from "@mui/material";
import Sidebar from "components/Sidebar/Sidebar";
import theme from "./theme/theme";
import styles from "./App.module.scss";

const SpaceHogs = lazy(() => import("routes/SpaceHogs/SpaceHogs"));
const Archive = lazy(() => import("routes/Archive/Archive"));
const Cleanup = lazy(() => import("routes/Cleanup/Cleanup"));
const Flamingo = lazy(() => import("routes/Flamingo/Flamingo"));
const Plots = lazy(() => import("routes/Plots/Plots"));
const SpaceUtilization = lazy(() => import("routes/SpaceUtilization/SpaceUtilization"));
const Settings = lazy(() => import("routes/Settings/Settings"));
const Test = lazy(() => import("routes/test/Test"));

export default function App() {
  return (
    <React.Fragment>
      <ThemeProvider theme={ theme }>
        <Router>
          <Titlebar />
          <Sidebar />
          <div className={ styles["route-body"] }>
            <Suspense fallback={ <h1>Loading...</h1> }>
              <Routes>
                {/* <Route path="/" element={ <SpaceHogs /> } /> */}
                <Route path="/cleanup" element={ <Cleanup /> } />
                <Route path="/archive" element={ <Archive /> } />
                <Route path="/utilization" element={ <SpaceUtilization /> } />
                {/* <Route path="/plots" element={ <Plots /> } /> */}
                <Route path="/" element={ <Plots /> } />
                <Route path="/flamingo" element={ <Flamingo /> } />
                <Route path="/settings" element={ <Settings /> } />
                {/* <Route path="/" element={ <Test /> } /> */}
                {/* <Route path="/test" element={ <Test /> } /> */}
              </Routes>
            </Suspense>
          </div>
        </Router>
      </ThemeProvider>
    </React.Fragment>
  );
}
