import * as React from "react";
import { io } from "socket.io-client";
import ResizeablePlot from "components/containers/ResizeablePlot";
import styles from "components/App.module.scss";
import TestSocketCounter from "components/containers/TestSocketCounter";

// Electron Inter Process Communication and dialog
const { ipcRenderer } = window.require("electron");

// Dynamically generated TCP (open) port between 3000-3999
const port = ipcRenderer.sendSync("get-port-number");

export default function Test() {

  const testData = [
    {
      x: [1, 2, 3, 4],
      y: [10, 15, 13, 17],
      type: "scatter"
    },
    {
      x: [1, 2, 3, 4],
      y: [16, 5, 11, 9],
      type: "scatter"
    }
  ];

  const testLayout = {
    title: { text: "Title" },
    xaxis: { title: "X Label" },
    yaxis: { title: "Y Label" }
  };

  return (
    <div className={ styles["route-body"] }>
      <h3>Resizable plot by clicking and dragging the bottom right</h3>
      <br />
      <ResizeablePlot data={ testData } layout={ testLayout } />
      <br />
      <hr />
      <br />
      <h3>Test counter with sockets</h3>
      <br />
      <TestSocketCounter />
      <br />
      <hr />
    </div>
  );
}
