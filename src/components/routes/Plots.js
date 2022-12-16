import * as React from 'react';
import Plot from 'react-plotly.js';
import { useResizeDetector } from 'react-resize-detector';
import { post, get } from 'utils/requests';
import {
  Box,
  Tabs,
  Tab,
  InputLabel,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Checkbox,
  Select,
  TextField,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  CircularProgress,
} from '@mui/material';
import { green, red, grey } from '@mui/material/colors';
import DatasetIcon from '@mui/icons-material/Dataset';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArticleIcon from '@mui/icons-material/Article';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SaveIcon from '@mui/icons-material/Save';

import Header from 'components/containers/Header';
import DragDropFileContainer from 'components/containers/DragDropFileContainer';
import SimpleFileContainer from 'components/containers/SimpleFileContainer';
import DataGridTable from 'components/containers/DataGridTable';
import LinePlot from 'components/containers/LinePlot';

import styles from 'components/App.module.scss';
import plotStyles from './Plots.module.scss';

export default function Plots() {
  const { width, height, ref } = useResizeDetector();

  // File Options
  const [openFileOptions, setOpenFileOptions] = React.useState(false);
  const [items, setItems] = React.useState([]); // [{name: 'x1', path: 'y1'}, {name: 'x2', path: 'y2'}, ...]
  const [searchCriteria, setSearchCriteria] = React.useState('folder'); // or file
  const [regex, setRegex] = React.useState('*.xlsx');
  const [skiprows, setSkiprows] = React.useState('');
  const [delimiter, setDelimiter] = React.useState('');
  const [sheets, setSheets] = React.useState('');
  const [loadedData, setLoadedData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  // const [success, setSuccess] = React.useState(false);

  //   const buttonSx = {
  //     ...(success && {
  //         bgcolor: green[500],
  //         '&:hover': {
  //             bgcolor: green[700]
  //         }
  //     })
  //   }

  const handleOpenFileOptions = () => {
    setOpenFileOptions(true);
  };

  const handleCloseFileOptions = () => {
    setOpenFileOptions(false);
  };

  const handleLoadFiles = () => {
    setLoading(true);
    // setSuccess(false);
    post(
      JSON.stringify({
        paths: items,
        search_criteria: searchCriteria,
        regex: regex,
        skiprows: skiprows,
        delimiter: delimiter,
        sheets: sheets,
      }),
      'load-files',
      (response) => setLoadedData(response),
      (error) => console.log(error)
    );
  };

  React.useEffect(() => {
    setLoading(false);
    // setSuccess(true)
  }, [loadedData]);

  // Loaded Files
  const [openViewLoadedFiles, setOpenViewLoadedFiles] = React.useState(false);
  const [viewLoadedData, setViewLoadedData] = React.useState({});

  const handleOpenViewLoadedFiles = () => {
    get(
      'get-loaded-data',
      (response) => setViewLoadedData(response),
      (error) => console.error(error)
    );
    setOpenViewLoadedFiles(true);
  };

  const handleCloseViewLoadedFiles = () => {
    setOpenViewLoadedFiles(false);
  };

  // Data
  const [openPlotData, setOpenPlotData] = React.useState(false);
  const [tableRows, setTableRows] = React.useState([]);
  const [plotData, setPlotData] = React.useState([]);

  const handleOpenPlotData = () => {
    setOpenPlotData(true);
  };

  const handleClosePlotData = () => {
    const cellData = [];
    tableRows.forEach((row) => {
      const cells = {
        file: row['selectedFile'],
        x: row['selectedX'],
        y: row['selectedY'],
        name: row['name'],
        mode: row['selectedMode'],
      };
      cellData.push(cells);
    });

    post(
      JSON.stringify(cellData),
      'get-plot-data',
      (response) => setPlotData(response),
      (response) => console.error(response)
    );

    setOpenPlotData(false);
  };

  React.useEffect(() => {
    console.log(plotData);
  }, [plotData]);

  // Layout
  const [openLayoutOptions, setOpenLayoutOptions] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [xLabel, setXLabel] = React.useState('');
  const [yLabel, setYLabel] = React.useState('');
  const [legend, setLegend] = React.useState(false);

  const layout = {
    width: width,
    // height: height,
    title: title,
    xaxis: {
      title: xLabel,
    },
    yaxis: {
      title: xLabel,
    },
    showlegend: legend,
  };

  const handleOpenLayoutOptions = () => {
    setOpenLayoutOptions(true);
  };

  const handleCloseLayoutOptions = () => {
    setOpenLayoutOptions(false);
  };

  // Speed Dial
  const actions = [
    {
      icon: <ArticleIcon />,
      name: 'File Options',
      click: handleOpenFileOptions,
    },
    {
      icon: <CheckCircleIcon />,
      name: 'Loaded Files',
      click: handleOpenViewLoadedFiles,
    },
    {
      icon: <DatasetIcon />,
      name: 'Data',
      click: handleOpenPlotData,
    },
    {
      icon: <DashboardIcon />,
      name: 'Layout',
      click: handleOpenLayoutOptions,
    },
    // {
    //   icon: <SaveIcon />,
    //   name: "Save",
    //   click: handleOpenFileOptions,
    // },
  ];

  return (
    <div className={styles['route-body']}>
      <Header
        heading='Plots'
        description='Build interactive plots with ease.'
      />
      <SpeedDial
        ariaLabel='options'
        icon={<SpeedDialIcon />}
        sx={{ position: 'absolute', bottom: 16, left: 72 }}
        direction='up'
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.click}
          />
        ))}
      </SpeedDial>
      <Dialog
        open={openFileOptions}
        onClose={handleCloseFileOptions}
        fullWidth
        maxWidth='lg'
      >
        <DialogTitle>File Options</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Supported file extensions include: .rod, .xlsx, .csv, .txt,
            .cfff.xml
          </DialogContentText>
          <hr />
          <DragDropFileContainer files={items} setFiles={setItems} />
          <FormControl>
            <FormLabel>Search Criteria:</FormLabel>
            <RadioGroup
              aria-labelledby='demo-radio-buttons-group-label'
              value={searchCriteria}
              name='radio-buttons-group'
            >
              <FormControlLabel
                value='file'
                control={<Radio />}
                label='File'
                onChange={(event) => setSearchCriteria(event.target.value)}
              />
              <FormControlLabel
                value='folder'
                control={<Radio />}
                label='Folder'
                onChange={(event) => setSearchCriteria(event.target.value)}
              />
            </RadioGroup>
          </FormControl>
          <TextField
            margin='dense'
            id='search-criteria'
            label='Search folders for regex:'
            type='input'
            fullWidth
            variant='standard'
            value={regex}
            onChange={(event) => setRegex(event.target.value)}
          />
          <FormControl>
            <FormLabel>Optional inputs for .xlsx, .csv, .txt files:</FormLabel>
            <TextField
              margin='dense'
              id='skiprows'
              label='Skip Rows'
              type='input'
              fullWidth
              variant='standard'
              value={skiprows}
              onChange={(event) => setSkiprows(event.target.value)}
            />
            <TextField
              margin='dense'
              id='delimiter'
              label='Delimiter'
              type='input'
              fullWidth
              variant='standard'
              value={delimiter}
              onChange={(event) => setDelimiter(event.target.value)}
            />
            <TextField
              margin='dense'
              id='sheets'
              label='Sheets'
              type='input'
              fullWidth
              variant='standard'
              value={sheets}
              onChange={(event) => setSheets(event.target.value)}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={handleCloseFileOptions}>
            Cancel
          </Button>
          <Box sx={{ m: 1, position: 'relative' }}>
            <Button
              variant='contained'
              //   sx={buttonSx}
              disabled={loading}
              onClick={handleLoadFiles}
            >
              Load Files
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  color: grey[800],
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openViewLoadedFiles}
        onClose={handleCloseViewLoadedFiles}
        fullWidth
        maxWidth='lg'
      >
        <DialogTitle>Loaded Files</DialogTitle>
        <DialogContent>
          <SimpleFileContainer files={viewLoadedData} />
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={handleCloseViewLoadedFiles}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openPlotData}
        onClose={handleClosePlotData}
        fullWidth
        maxWidth='lg'
      >
        <DialogTitle>Plot Data</DialogTitle>
        <DialogContent>
          <DataGridTable
            data={loadedData}
            rows={tableRows}
            setRows={setTableRows}
          />
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={handleClosePlotData}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openLayoutOptions}
        onClose={handleCloseLayoutOptions}
        fullWidth
        maxWidth='lg'
      >
        <DialogTitle>Layout Options</DialogTitle>
        <DialogContent>
          <div className={plotStyles['dialog-component']}>
            <FormControl>
              <FormLabel>Labels</FormLabel>
              <TextField
                margin='dense'
                id='x-label'
                label='X-Axis Label'
                type='input'
                fullWidth
                variant='standard'
                value={xLabel}
                onChange={(event) => setXLabel(event.target.value)}
              />
              <TextField
                margin='dense'
                id='y-label'
                label='Y-Axis Label'
                type='input'
                fullWidth
                variant='standard'
                value={yLabel}
                onChange={(event) => setYLabel(event.target.value)}
              />
              <TextField
                margin='dense'
                id='title-label'
                label='Plot Title'
                type='input'
                fullWidth
                variant='standard'
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </FormControl>
          </div>
          <div className={plotStyles['dialog-component']}>
            <FormControl>
              <FormLabel>Legend</FormLabel>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={legend}
                    onClick={() => setLegend(!legend)}
                  />
                }
                label='On'
              />
              <TextField
                margin='dense'
                id='location'
                label='Location'
                type='input'
                fullWidth
                variant='standard'
              />
            </FormControl>
          </div>
          <div className={plotStyles['dialog-component']}>
            <FormControl>
              <FormLabel>Gridlines</FormLabel>
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label='Major'
              />
              <TextField
                margin='dense'
                id='major-gridline'
                label='Major Color'
                type='input'
                fullWidth
                variant='standard'
              />
              <FormControlLabel
                control={<Checkbox defaultChecked />}
                label='Minor'
              />
              <TextField
                margin='dense'
                id='minor-gridline'
                label='Minor Color'
                type='input'
                fullWidth
                variant='standard'
              />
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant='contained' onClick={handleCloseLayoutOptions}>
            Cancel
          </Button>
          <Button variant='contained' onClick={handleCloseLayoutOptions}>
            Done
          </Button>
        </DialogActions>
      </Dialog>
      <div ref={ref} className={plotStyles['plot-container']}>
        <LinePlot data={plotData} layout={layout} />
      </div>
    </div>
  );
}
