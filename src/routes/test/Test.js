import * as React from "react";
import ResizeablePlot from "./ResizeablePlot";

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
    yaxis: { title: "Y Label" },
    shapes: [
      {
        type: "line",
        xref: "x",
        // yref: "y",
        yref: "paper",
        // yref: "y domain",
        x0: 2,
        x1: 2,
        y0: 0,
        y1: 1,
        line: {
          color: "red",
          width: 2
        }
      }
    ]
  };

  return (
    <React.Fragment>
      <h3>Resizable plot by clicking and dragging the bottom right</h3>
      <br />
      <ResizeablePlot data={ testData } layout={ testLayout } />
      <br />
    </React.Fragment>
  );
}
