import * as React from 'react';
import Plot from 'react-plotly.js';
import styles from './ResizeablePlot.module.scss';

export default function ResizeablePlot({ children }) {
  const [size, setSize] = React.useState({ x: 650, y: 400 });

  const handler = (mouseDownEvent) => {
    const startSize = size;
    const startPosition = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY };

    function onMouseMove(mouseMoveEvent) {
      setSize((currentSize) => ({
        x: startSize.x - startPosition.x + mouseMoveEvent.pageX,
        y: startSize.y - startPosition.y + mouseMoveEvent.pageY,
      }));
    }
    function onMouseUp() {
      document.body.removeEventListener('mousemove', onMouseMove);
      // uncomment the following line if not using `{ once: true }`
      // document.body.removeEventListener("mouseup", onMouseUp);
    }

    document.body.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseup', onMouseUp, { once: true });
  };

  const layout = {
    width: size.x - 2,
    height: size.y - 2,
  };

  return (
    <div
      className={styles['container']}
      style={{ width: size.x, height: size.y }}
    >
      <Plot layout={layout} />
      <button
        className={styles['draghandle']}
        type='button'
        onMouseDown={handler}
      ></button>
    </div>
  );
}
