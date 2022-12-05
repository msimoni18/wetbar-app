import * as React from "react";
import { post } from "utils/requests";

import Titlebar from "components/titlebar/Titlebar";
import DragDropFileContainer from "components/containers/DragDropFileContainer";
import DataGridTable from "components/containers/DataGridTable";

import styles from "components/App.module.scss";

function App() {
  const [files, setFiles] = React.useState([]);
  const [loadedData, setLoadedData] = React.useState({});

  React.useEffect(() => {
    post(
      JSON.stringify(files),
      "modify-data",
      (response) => setLoadedData(response),
      (response) => console.error(response)
    );
  }, [files]);

  return (
    <React.Fragment>
      <Titlebar />

      <div className={styles.app}>
        <DragDropFileContainer files={files} setFiles={setFiles} />
        <DataGridTable data={loadedData} />
      </div>
    </React.Fragment>
  );
}

export default App;
