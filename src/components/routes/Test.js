import * as React from 'react';
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
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuid } from 'uuid';
import styles from 'components/App.module.scss';

function createData(id, file, x, y) {
  return { id, file, x, y };
}

const initialRows = [
  createData(uuid(), 'File 1', '', ''),
  createData(uuid(), 'File 2', '', ''),
  createData(uuid(), 'File 3', '', ''),
];

const FileSelect = () => {
  const [file, setFile] = React.useState('');

  const handleChange = (event) => {
    setFile(event.target.value);
  };

  return (
    <Select id='file-select' value={file} onChange={handleChange} fullWidth>
      <MenuItem value={'File1'}>File1</MenuItem>
      <MenuItem value={'File2'}>File2</MenuItem>
      <MenuItem value={'File3'}>File3</MenuItem>
    </Select>
  );
};

export default function Test() {
  const [rows, setRows] = React.useState(initialRows);

  const handleClick = () => {
    const uniqueId = uuid();
    const newRow = createData(uniqueId, 'new', 0, 0);
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const deleteRow = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  return (
    <div className={styles['route-body']}>
      <Button variant='contained' onClick={handleClick}>
        Add row
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 300 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Files</TableCell>
              <TableCell>X</TableCell>
              <TableCell>Y</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell component='th' scope='row'>
                  <FileSelect />
                </TableCell>
                <TableCell>x param</TableCell>
                <TableCell>y param</TableCell>
                <TableCell>
                  <IconButton onClick={() => deleteRow(row.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
