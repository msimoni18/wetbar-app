import * as React from 'react';
import Plot from 'react-plotly.js';
import { useResizeDetector } from 'react-resize-detector';

import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import Header from 'components/containers/Header';
import styles from 'components/App.module.scss';
import hogStyles from './SpaceHogs.module.scss';

// Electron inter process communcation and dialog
const { ipcRenderer } = window.require('electron');

// Dynamically generated TCP (open) port between 3000-3999
const port = ipcRenderer.sendSync('get-port-number');

const columns = [
  { field: 'user', headerName: 'User', width: 200 },
  { field: 'size', headerName: 'User', type: 'number', width: 200 },
  { field: 'util', headerName: 'User', type: 'number', width: 200 },
  { field: 'size_gt_year', headerName: 'User', type: 'number', width: 200 },
  { field: 'util_gt_year', headerName: 'User', type: 'number', width: 200 },
  { field: 'split_gt_year', headerName: 'User', type: 'number', width: 200 },
];

export default function SpaceHogs() {
  const { width, height, ref } = useResizeDetector();
  const [site, setSite] = React.useState('Knolls');
  const [data, setData] = React.useState({});
  const [rows, setRows] = React.useState([]);
  const [plotData, setPlotData] = React.useState([]);

  const plotLayout = {
    width: width,
    // height: 500,
    xaxis: {
      tickangle: -45,
    },
    yaxis: {
      title: 'Size (GB)',
    },
    showlegend: false,
    annotations: [
      {
        xref: 'paper',
        yref: 'paper',
        x: 0.5,
        xanchor: 'center',
        y: 1.1,
        yanchor: 'bottom',
        text: 'Red bars indicate over 12% utilization',
        showarrow: false,
      },
    ],
  };

  React.useEffect(() => {
    fetch(`http://localhost:${port}/space-hogs`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(site),
    })
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error));
  }, [site]);

  React.useEffect(() => {
    if (Object.keys(data).length > 0) {
      setRows(data['stats']);

      const name = [];
      const stat = [];
      const util = [];
      data['stats'].map((item) => {
        if (item['user'] !== 's1b_rp') {
          name.push(item['user']);
          stat.push(item['size']);
          util.push(item['util']);
        }
      });

      const colors = util.map((val) => (val >= 12 ? 'red' : 'blue'));

      setPlotData([
        {
          x: name,
          y: stat,
          type: 'bar',
          marker: { color: colors },
        },
      ]);
    }
  }, [data]);

  return (
    <div className={styles['route-body']}>
      <Header
        heading='Space Hogs'
        description='See what coworkers are hogging all of the shared space.'
      />
      <div className={hogStyles['form']}>
        <FormControl>
          <RadioGroup
            aria-labelledby='radio-buttons-group-label'
            defaultValue='Knolls'
            name='site-buttons-group'
            row
          >
            <FormControlLabel
              value='Knolls'
              control={<Radio />}
              label='Knolls'
              sx={{ marginRight: '25px' }}
              onChange={(event) => setSite(event.target.value)}
            />
            <FormControlLabel
              value='Bettis'
              control={<Radio />}
              label='Bettis'
              sx={{ marginLeft: '25px' }}
              onChange={(event) => setSite(event.target.value)}
            />
          </RadioGroup>
        </FormControl>
      </div>
      <div className={hogStyles['output']}>
        <div className={hogStyles['info']}>
          <p>
            <b>Site: </b>
            {data['site']}
          </p>
          <p>
            <b>Total Allocation (GB): </b>
            {data['allocation']}
          </p>
          <p>
            <b>Last Updated: </b>
            {data['last_update']}
          </p>
        </div>
        <div className={hogStyles['table']}>
          <Box sx={{ height: 400 }}>
            <DataGrid rows={rows} columns={columns} disableSelectionOnClick />
          </Box>
        </div>
        <div ref={ref} className={hogStyles['plot']}>
          <Plot data={plotData} layout={plotLayout} />
        </div>
      </div>
    </div>
  );
}
