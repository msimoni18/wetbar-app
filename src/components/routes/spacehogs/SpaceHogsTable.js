import React from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function SpaceHogsTable({ rows }) {
  const [columnDefs] = React.useState([
    { field: "user", headerName: "User" },
    { field: "size", headerName: "Size" },
    { field: "util", headerName: "Utilization" },
    { field: "size_gt_year", headerName: "Size (> 1 year)" },
    { field: "split_gt_year", headerName: "Split (> 1 year)" }
  ]);

  const defaultColDef = React.useMemo(() => {
    return {
      flex: 1,
      sortable: true,
      resizable: true
    };
  }, []);

  return (
    <div className="ag-theme-alpine" style={ { height: 500 } }>
      <AgGridReact
        rowData={ rows }
        columnDefs={ columnDefs }
        defaultColDef={ defaultColDef }
      />
    </div>
  );
}

export default SpaceHogsTable;
