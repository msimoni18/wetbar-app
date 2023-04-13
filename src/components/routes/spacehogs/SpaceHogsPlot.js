import React from "react";
import { useResizeDetector } from "react-resize-detector";
import Plot from "react-plotly.js";

function SpaceHogsPlot({ data }) {
  const { width, ref } = useResizeDetector();

  const layout = {
    width,
    height: 500,
    xaxis: {
      tickangle: -45
    },
    yaxis: {
      title: "Size (GB)"
    },
    showlegend: false,
    annotations: [
      {
        xref: "paper",
        yref: "paper",
        x: 0.5,
        xanchor: "center",
        y: 1.1,
        yanchor: "bottom",
        text: "Red bars indicate over 12% utilization",
        showarrow: false
      }
    ]
  };

  return (
    <div ref={ ref }>
      <Plot data={ data } layout={ layout } />
    </div>
  );
}

export default SpaceHogsPlot;
