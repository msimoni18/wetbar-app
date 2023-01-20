import * as React from 'react';
import { io } from 'socket.io-client';
import { v4 as uuid } from 'uuid';
import { post } from 'utils/requests';
import { formatBytes } from 'utils/utilities';
import {
  Box,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from 'components/containers/Header';
import DragDropFileContainer from 'components/containers/DragDropFileContainer';
import ListContainer from 'components/containers/ListContainer';
import RunButton from 'components/buttons/RunButton';
import styles from 'components/App.module.scss';

// Electron Inter Process Communication and dialog
const { ipcRenderer } = window.require('electron');

// Dynamically generated TCP (open) port between 3000-3999
const port = ipcRenderer.sendSync('get-port-number');

const defaultTableData = [
  { id: uuid(), file: '*.taskinfo', checked: true },
  { id: uuid(), file: '*.tasklog', checked: true },
  { id: uuid(), file: '*.screen', checked: true },
  { id: uuid(), file: '*CARPET*.h5', checked: false },
  { id: uuid(), file: '*PCO*.h5', checked: false },
  { id: uuid(), file: '*SS_Plots*.xlsx', checked: false },
  { id: uuid(), file: '*SS_Plots*.png', checked: false },
  { id: uuid(), file: '*TR_DPR_Plots*.xlsx', checked: false },
  { id: uuid(), file: '*TR_DPR_Plots*.png', checked: false },
];

export default function Cleanup() {
  const [items, setItems] = React.useState([]);
  const [dryRun, setDryRun] = React.useState(true);
  const [directoryCount, setDirectoryCount] = React.useState(0);
  const [fileCount, setFileCount] = React.useState(0);
  const [notDeletedCount, setNotDeletedCount] = React.useState(0);
  const [spaceReduction, setSpaceReduction] = React.useState('0');
  const [totalTime, setTotalTime] = React.useState(0);
  const [deleteExistingFiles, setDeleteExistingFiles] = React.useState(false);
  const [tableRows, setTableRows] = React.useState(defaultTableData);
  const [selectionModel, setSelectionModel] = React.useState(
    () => tableRows.filter((row) => row.checked === true).map((r) => r.id)
    // tableRows.map((row) => row.id)
  );
  const [filesToDelete, setFilesToDelete] = React.useState([]);
  const [filesNotDeleted, setFilesNotDeleted] = React.useState([]);

  const [connected, setConnected] = React.useState(false);

  React.useEffect(() => {
    if (connected === false) {
      const socket = io(`http://localhost:${port}`, {
        transports: ['websocket'],
        cors: {
          origin: `http://localhost:${port}`,
        },
      });

      socket.on('connect', (data) => {
        console.log('connected');
        console.log(data);
        setConnected(true);
      });

      socket.on('disconnect', (data) => {
        console.log('disconnected');
        console.log(data);
      });

      socket.on('cleanup', (data) => {
        console.log(data);
        setDirectoryCount(data['directory']);
        setSpaceReduction(formatBytes(data['size']));
        setFileCount(data['files']);
        setNotDeletedCount(data['files_not_deleted']);
        setTotalTime(data['time']);
      });

      return function cleanup() {
        console.log('disconnecting socket');
        socket.disconnect();
      };
    }
  }, []);

  const columns = [
    {
      field: 'file',
      headerName: 'File',
      editable: true,
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Delete',
      type: 'actions',
      width: 80,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={deleteRow(params.id)}
        />,
      ],
    },
  ];

  const addRow = () => {
    const newRow = { id: uuid(), file: '', checked: false };
    setTableRows((prevRows) => [...prevRows, newRow]);
  };

  const deleteRow = React.useCallback(
    (id) => () => {
      setTimeout(() => {
        setTableRows((prevRows) => prevRows.filter((row) => row.id !== id));
      });
    },
    []
  );

  React.useEffect(() => {
    setTableRows((prevRows) =>
      prevRows.map((row) =>
        selectionModel.includes(row.id)
          ? { ...row, checked: true }
          : { ...row, checked: false }
      )
    );
  }, [selectionModel]);

  const commitCellEdit = (props) => {
    const { field, id, value } = props;
    setTableRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleClick = () => {
    const checkedRows = tableRows.filter((row) => row.checked === true);
    setFilesToDelete([]);
    setFilesNotDeleted([]);
    post(
      JSON.stringify({
        folders: items,
        extensions: checkedRows,
        dry_run: dryRun,
      }),
      'cleanup',
      (response) => handleResponse(response),
      (error) => console.error(error)
    );
  };

  const handleResponse = (response) => {
    setFilesToDelete(response['files']);
    setFilesNotDeleted(response['files_not_deleted']);
  };

  return (
    <div className={styles['route-body']}>
      <Header
        heading="Cleanup"
        description="Easily delete unwanted files to clear shared space for your coworkers."
      />
      <DragDropFileContainer files={items} setFiles={setItems} />
      <Box
        sx={{
          display: 'flex',
          border: '1px solid black',
          width: '100%',
        }}
      >
        <Box sx={{ width: '50%' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={dryRun}
                onChange={() => setDryRun(!dryRun)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
            label="Dry Run"
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={deleteExistingFiles}
                  onChange={() => setDeleteExistingFiles(!deleteExistingFiles)}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="Delete files found during dry run"
            />
          </FormGroup>
          <RunButton handleClick={handleClick} />
        </Box>
        <Box sx={{ width: '50%' }}>
          <Button variant="contained" onClick={addRow}>
            Add row
          </Button>
          <div style={{ height: 400 }}>
            <DataGrid
              rows={tableRows}
              columns={columns}
              checkboxSelection
              disableSelectionOnClick
              onCellEditCommit={commitCellEdit}
              selectionModel={selectionModel}
              onSelectionModelChange={setSelectionModel}
            />
          </div>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          marginTop: '2%',
          marginBottom: '2%',
          padding: '2%',
          border: '1px solid black',
        }}
      >
        <p># of directories searched: {directoryCount}</p>
        <p># of files deleted: {fileCount}</p>
        <p># of files not deleted: {notDeletedCount}</p>
        <p>Total space reduction: {spaceReduction}</p>
        <p>Time elapsed (H:M:S): {totalTime}</p>
      </Box>
      <p>Files to be deleted:</p>
      <ListContainer files={filesToDelete} />
      <p>
        Files that cannot be deleted because the total characters exceeds 259:
      </p>
      <ListContainer files={filesNotDeleted} />
    </div>
  );
}
