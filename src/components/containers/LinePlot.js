import * as React from "react";
import Plot from "react-plotly.js";

export default function LinePlot(props) {
  const { data, layout } = props;

  const [state, setState] = React.useState({
    data: data,
    layout: layout,
    frames: [],
    config: {},
    revision: 0,
  });

  React.useEffect(() => {
    setState((prevState) => {
      return {
        ...prevState,
        data: data,
      };
    });
  }, [data]);

  const initialized = () => {
    console.log("onInitialized");
  };

  const afterPlot = () => {
    console.log("onAfterPlot");
  };

  const update = () => {
    console.log("onUpdate");
  };

  const hover = () => {
    console.log("onHover");
  };

  const click = () => {
    console.log("onClick");
  };

  const relayout = () => {
    console.log("onRelayout");
    console.log(state.layout);
    console.log("x-axis layout:");
    console.log(state.layout.xaxis);
    console.log("y-axis layout:");
    console.log(state.layout.yaxis);
  };

  const unhover = () => {
    console.log("onUnhover");
  };

  const selected = () => {
    console.log("onSelected");
  };

  const beforeHover = () => {
    console.log("onBeforeHover");
  };

  return (
    <Plot
      data={state.data}
      layout={state.layout}
      frames={state.frames}
      revision={state.revision}
      onInitialized={initialized}
      onUpdate={update}
      onAfterPlot={afterPlot}
      onHover={hover}
      onClick={click}
      onRelayout={relayout}
      onUnhover={unhover}
      onSelected={selected}
      // onBeforeHover={beforeHover}
    />
  );
}
