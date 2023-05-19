import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function CleanupFilesTable({ data }) {
  const gridRef = React.useRef();
  const [columnDefs] = React.useState([
    {
      field: "number",
      headerName: "#",
      maxWidth: 100,
      filter: false
    },
    {
      field: "extension",
      headerName: "Extension",
      maxWidth: 125,
      filter: true
    },
    {
      field: "filename",
      headerName: "File",
      filter: true
    }
  ]);

  const defaultColDef = React.useMemo(() => {
    return {
      flex: 1,
      sortable: true,
      resizable: true,
      filter: "agTextColumnFilter"
    };
  }, []);

  return (
    <div className="ag-theme-alpine" style={ { height: 500 } }>
      <AgGridReact
        ref={ gridRef }
        rowData={ data }
        columnDefs={ columnDefs }
        defaultColDef={ defaultColDef }
      />
    </div>
  );
}
