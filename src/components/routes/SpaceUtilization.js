import * as React from 'react';
import { post } from 'utils/requests';
import { formatBytes } from 'utils/utilities';
import Plot from 'react-plotly.js';
import { useResizeDetector } from 'react-resize-detector';
import { Box, TextField, Slider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { v4 as uuid } from 'uuid';
import Header from 'components/containers/Header';
import RunButton from 'components/buttons/RunButton';
import styles from 'components/App.module.scss';
import { number } from 'prop-types';

const marks = [
  {
    label: '-1',
    value: -1,
  },
  {
    label: '2',
    value: 2,
  },
  {
    label: '3',
    value: 3,
  },
  {
    label: '4',
    value: 4,
  },
  {
    label: '5',
    value: 5,
  },
  {
    label: '6',
    value: 6,
  },
  {
    label: '7',
    value: 7,
  },
  {
    label: '8',
    value: 8,
  },
];

const columns = [
  {
    field: 'extension',
    headerName: 'Extension',
    flex: 1,
    minWidth: 125,
  },
  {
    field: 'bytes',
    type: number,
    headerName: 'Bytes',
    valueFormatter: (params) => {
      if (params.value == null) {
        return '';
      }

      const formattedValue = formatBytes(params.value);

      return `${formattedValue}`;
    },
  },
  {
    field: 'perc_bytes',
    type: number,
    headerName: '% Bytes',
    valueFormatter: (params) => {
      if (params.value == null) {
        return '';
      }
      return `${params.value}%`;
    },
  },
  {
    field: 'count',
    type: number,
    headerName: 'Files',
  },
  {
    field: 'perc_count',
    type: number,
    headerName: '% Files',
    valueFormatter: (params) => {
      if (params.value == null) {
        return '';
      }
      return `${params.value}%`;
    },
  },
];

export default function SpaceUtilization() {
  const { width, height, ref } = useResizeDetector();
  const [directory, setDirectory] = React.useState('');
  const [data, setData] = React.useState([]);
  const [extensionData, setExtensionData] = React.useState([]);
  const [depth, setDepth] = React.useState(-1);

  const plotLayout = {
    width: width,
    // height: 500,
  };

  const handlePlotData = (response) => {
    const directory = response['directory'];
    const extensions = response['extensions'];

    const formattedBytes = directory['values'].map((value) =>
      formatBytes(value)
    );

    console.log(formattedBytes);

    const newData = [
      {
        branchvalues: 'total',
        ids: directory['ids'],
        labels: directory['labels'],
        maxdepth: depth,
        parents: directory['parents'],
        root: {
          color: 'lightgrey',
        },
        type: 'treemap',
        values: directory['values'],
        text: formattedBytes,
        hovertemplate: '<b>%{text}</b><extra></extra>',
        textinfo: 'label',
      },
    ];

    setData(newData);

    const newExtensions = extensions.map((row) => {
      const uniqueId = uuid();
      return { ...row, id: uniqueId };
    });
    setExtensionData(newExtensions);
  };

  const handleButtonClick = () => {
    post(
      JSON.stringify(directory),
      'space-utilization',
      // (response) => alert(response),
      (response) => handlePlotData(response),
      (error) => console.error(error)
    );
  };

  React.useEffect(() => {
    const [prevObject] = data;
    const prevData = { ...prevObject, maxdepth: depth };
    setData([prevData]);
  }, [depth]);

  // React.useEffect(() => {
  //   console.log(data);
  // }, [data]);

  return (
    <div className={styles['route-body']}>
      <Header
        heading="Space Utilization"
        description="Figure out how much space your taking up."
      />
      <Box sx={{ marginBottom: '2%' }}>
        <TextField
          required
          fullWidth
          label="Directory"
          variant="outlined"
          value={directory}
          onChange={(event) => setDirectory(event.target.value)}
        />
      </Box>
      <Slider
        aria-label="Depth"
        value={depth}
        valueLabelDisplay="auto"
        marks={marks}
        step={null}
        min={-1}
        max={8}
        onChange={(event) => setDepth(event.target.value)}
      />
      <RunButton handleClick={handleButtonClick} />
      <div ref={ref} style={{ paddingBottom: '2%' }}>
        <Plot data={data} layout={plotLayout} />
      </div>
      <div
        style={{
          height: 1000,
          width: '500px',
          paddingBottom: '2%',
          display: 'flex',
          justifyContent: 'center',
          margin: 'auto',
        }}
      >
        <DataGrid
          rows={extensionData}
          columns={columns}
          disableSelectionOnClick
        />
      </div>
    </div>
  );
}
