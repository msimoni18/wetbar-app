import * as React from "react";
import Plot from "react-plotly.js";
import { io } from "socket.io-client";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Select,
  MenuItem
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ResizeablePlot from "components/containers/ResizeablePlot";
import { v4 as uuid } from "uuid";
import styles from "components/App.module.scss";
import TestWebSocket from "components/containers/TestWebSocket";
import TestSocketCounter from "components/containers/TestSocketCounter";

// Electron Inter Process Communication and dialog
const { ipcRenderer } = window.require("electron");

// Dynamically generated TCP (open) port between 3000-3999
const port = ipcRenderer.sendSync("get-port-number");

function createData(id, file, x, y) {
  return { id, file, x, y };
}

const initialRows = [
  createData(uuid(), "File 1", "", ""),
  createData(uuid(), "File 2", "", ""),
  createData(uuid(), "File 3", "", "")
];

const FileSelect = () => {
  const [file, setFile] = React.useState("");

  const handleChange = (event) => {
    setFile(event.target.value);
  };

  return (
    <Select id="file-select" value={ file } onChange={ handleChange } fullWidth>
      <MenuItem value="File1">File1</MenuItem>
      <MenuItem value="File2">File2</MenuItem>
      <MenuItem value="File3">File3</MenuItem>
    </Select>
  );
};

export default function Test() {
  const [rows, setRows] = React.useState(initialRows);
  const [socketInstance, setSocketInstance] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [buttonStatus, setButtonStatus] = React.useState(false);

  const handleSocketClick = () => {
    if (buttonStatus === false) {
      setButtonStatus(true);
    } else {
      setButtonStatus(false);
    }
  };

  React.useEffect(() => {
    if (buttonStatus === true) {
      const socket = io(`http://localhost:${port}`, {
        transports: ["websocket"],
        cors: {
          origin: `http://localhost:${port}`
        }
      });

      setSocketInstance(socket);

      socket.on("connect", (data) => {
        console.log("on connect:");
        console.log(data);
      });

      setLoading(false);

      socket.on("disconnect", (data) => {
        console.log("on disconnect:");
        console.log(data);
      });

      return function cleanup() {
        console.log("disconnecting socket");
        socket.disconnect();
      };
    }
  }, [buttonStatus]);

  const handleClick = () => {
    const uniqueId = uuid();
    const newRow = createData(uniqueId, "new", 0, 0);
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const deleteRow = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const testData = [
    {
      x: [1, 2, 3, 4],
      y: [10, 15, 13, 17],
      type: "scatter"
    },
    {
      x: [1, 2, 3, 4],
      y: [16, 5, 11, 9],
      type: "scatter"
    }
  ];

  const testLayout = {
    title: { text: "Title" },
    xaxis: { title: "X Label" },
    yaxis: { title: "Y Label" }
  };

  return (
    <div className={ styles["route-body"] }>
      <h3>Resizable plot by clicking and dragging the bottom right</h3>
      <br />
      <ResizeablePlot data={ testData } layout={ testLayout } />
      <br />
      <hr />
      <h3>Test table</h3>
      <br />
      <Button variant="contained" onClick={ handleClick }>
        Add row
      </Button>
      <TableContainer component={ Paper }>
        <Table sx={ { minWidth: 300 } } aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Files</TableCell>
              <TableCell>X</TableCell>
              <TableCell>Y</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={ row.id }>
                <TableCell component="th" scope="row">
                  <FileSelect />
                </TableCell>
                <TableCell>x param</TableCell>
                <TableCell>y param</TableCell>
                <TableCell>
                  <IconButton onClick={ () => deleteRow(row.id) }>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <hr />
      <br />
      <h3>Test web sockets</h3>
      <br />
      {!buttonStatus ? (
        <div>
          <Button variant="contained" onClick={ handleSocketClick }>
            Turn chat on
          </Button>
          <br />
        </div>
      ) : (
        <>
          <Button variant="contained" onClick={ handleSocketClick }>
            Turn chat off
          </Button>
          <div>
            {!loading && (
              <div>
                <br />
                <TestWebSocket socket={ socketInstance } />
              </div>
            )}
          </div>
          <br />
        </>
      )}
      <br />
      <hr />
      <br />
      <h3>Test counter with sockets</h3>
      <br />
      <TestSocketCounter />
      <br />
      <hr />
    </div>
  );
}
