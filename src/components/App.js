import React, { lazy, Suspense } from "react";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import Titlebar from "components/titlebar/Titlebar";
import { ThemeProvider } from "@mui/material";
import theme from "../theme/theme";
import styles from "./App.module.scss";

const SpaceHogs = lazy(() => import("components/routes/spacehogs/SpaceHogs"));
const Sidebar = lazy(() => import("components/sidebar/Sidebar"));
const Archive = lazy(() => import("components/routes/archive/Archive"));
const Cleanup = lazy(() => import("components/routes/cleanup/Cleanup"));
const Flamingo = lazy(() => import("components/routes/flamingo/Flamingo"));
const Plots = lazy(() => import("components/routes/plots/Plots"));
const SpaceUtilization = lazy(() => import("components/routes/spaceutilization/SpaceUtilization"));
const Settings = lazy(() => import("components/routes/settings/Settings"));
// const Test = lazy(() => import("components/routes/test/Test"));

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
                <Route path="/" element={ <SpaceHogs /> } />
                <Route path="/cleanup" element={ <Cleanup /> } />
                <Route path="/archive" element={ <Archive /> } />
                <Route path="/utilization" element={ <SpaceUtilization /> } />
                <Route path="/plots" element={ <Plots /> } />
                <Route path="/flamingo" element={ <Flamingo /> } />
                <Route path="/settings" element={ <Settings /> } />
                {/* <Route path="/test" element={ <Test /> } /> */}
              </Routes>
            </Suspense>
          </div>
        </Router>
      </ThemeProvider>
    </React.Fragment>
  );
}
