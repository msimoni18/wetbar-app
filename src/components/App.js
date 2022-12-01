import * as React from "react";

import Titlebar from "components/titlebar/Titlebar";
import DragDropFileContainer from "components/containers/DragDropFileContainer";

import styles from "components/App.module.scss";

function App() {
  const [files, setFiles] = React.useState([]);

  return (
    <React.Fragment>
      <Titlebar />

      <div className={styles.app}>
        <DragDropFileContainer files={files} setFiles={setFiles} />
      </div>
    </React.Fragment>
  );
}

export default App;
