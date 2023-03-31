import React from "react";
import { formatBytes, addCommaToNumber } from "utils/utilities";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

function SpaceUtilizationTable({ data }) {
  const gridRef = React.useRef();
  const [columnDefs] = React.useState([
    {
      field: "extension",
      headerName: "Extension"
    },
    {
      field: "bytes",
      headerName: "Bytes",
      valueFormatter: (params) => {
        if (params.value == null) {
          return "";
        }
        const formattedValue = formatBytes(params.value);
        return `${formattedValue}`;
      }
    },
    {
      field: "perc_bytes",
      headerName: "% Bytes",
      valueFormatter: (params) => `${params.value}%`
    },
    {
      field: "count",
      headerName: "Files",
      valueFormatter: (params) => addCommaToNumber(params.value)
    },
    {
      field: "perc_count",
      headerName: "% Files",
      valueFormatter: (params) => `${params.value}%`
    }
  ]);

  const defaultColDef = React.useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true
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

export default SpaceUtilizationTable;
