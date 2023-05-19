import * as React from "react";
import Plot from "react-plotly.js";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import styles from "./ResizeablePlot.module.scss";

export default function ResizeablePlot({ data, layout, children }) {
  const [size, setSize] = React.useState({ x: 650, y: 400 });

  const handler = (mouseDownEvent) => {
    const startSize = size;
    const startPosition = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY };

    function onMouseMove(mouseMoveEvent) {
      setSize((currentSize) => ({
        x: startSize.x - startPosition.x + mouseMoveEvent.pageX,
        y: startSize.y - startPosition.y + mouseMoveEvent.pageY
      }));
    }
    function onMouseUp() {
      document.body.removeEventListener("mousemove", onMouseMove);
      // uncomment the following line if not using `{ once: true }`
      // document.body.removeEventListener("mouseup", onMouseUp);
    }

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  };

  const newLayout = {
    ...layout,
    width: size.x - 2,
    height: size.y - 2
  };

  return (
    <div
      className={ styles.container }
      style={ { width: size.x, height: size.y } }
    >
      <Plot data={ data } layout={ newLayout } />
      <DragIndicatorIcon className={ styles.draghandle } onMouseDown={ handler } />
    </div>
  );
}
