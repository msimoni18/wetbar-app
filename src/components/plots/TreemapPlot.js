import * as React from "react";
import Plot from "react-plotly.js";
import EmptyPlot from "components/containers/EmptyPlot";

export default function TreemapPlot({ data }) {
  console.log("---------------------");
  console.log("Rendering TreemapPlot");

  const layout = {
    width: 800,
    height: 400,
    margin: {
      t: "25",
      r: "25",
      b: "25",
      l: "25"
    }
  };

  const initialized = () => {
    console.log("onInitialized");
    console.log("Stop spinner onInitialized");
  };

  const afterPlot = () => {
    console.log("onAfterPlot");
    console.log("Stop spinner afterPlot");

  };

  const update = () => {
    console.log("onUpdate");
    console.log("Stop spinner onUpdate");
  };

  const hover = () => {};

  const click = () => {
    console.log("onClick");
    console.log("Start spinner onClick");
  };

  const relayout = () => {
    console.log("onRelayout");
  };

  const unhover = () => {};

  const selected = () => {
    console.log("onSelected");
  };

  return (
    <React.Fragment>
      {data.length > 0 ? (
        <Plot
          data={ data }
          layout={ layout }
          onInitialized={ initialized }
          onUpdate={ update }
          onAfterPlot={ afterPlot }
          onHover={ hover }
          onClick={ click }
          onRelayout={ relayout }
          onUnhover={ unhover }
          onSelected={ selected }
        />

      )
        : <EmptyPlot layout={ layout } />}
    </React.Fragment>
  );
}
