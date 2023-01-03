import * as React from 'react';
import { post } from 'utils/requests';
import Plot from 'react-plotly.js';
import { useResizeDetector } from 'react-resize-detector';
import { Box, TextField, Slider } from '@mui/material';
import Header from 'components/containers/Header';
import RunButton from 'components/buttons/RunButton';
import styles from 'components/App.module.scss';
const marks = [
  {
    value: -1,
    label: '-1',
  },
  {
    value: 2,
    label: '2',
  },
  {
    value: 3,
    label: '3',
  },
  {
    value: 4,
    label: '4',
  },
  {
    value: 5,
    label: '5',
  },
  {
    value: 6,
    label: '6',
  },
  {
    value: 7,
    label: '7',
  },
  {
    value: 8,
    label: '8',
  },
];

export default function SpaceUtilization() {
  const { width, height, ref } = useResizeDetector();
  const [directory, setDirectory] = React.useState('');
  const [data, setData] = React.useState([]);
  const [depth, setDepth] = React.useState(-1);

  const plotLayout = {
    width: width,
    // height: 500,
  };

  const handleButtonClick = () => {
    console.log('button clicked');
    post(
      JSON.stringify(directory),
      'space-utilization',
      // (response) => alert(response),
      (response) => handlePlotData(response),
      (error) => console.error(error)
    );
  };

  const handlePlotData = (response) => {
    console.log(response);
    const newData = [
      {
        type: 'treemap',
        labels: response['labels'],
        parents: response['parents'],
        ids: response['ids'],
        values: response['size'],
        // branchvalues: 'total',
        root: {
          color: 'lightgrey',
        },
        maxdepth: depth,
      },
    ];

    setData(newData);
  };

  React.useEffect(() => {
    const prevObject = data[0];
    const prevData = { ...prevObject, maxdepth: depth };
    setData([prevData]);
  }, [depth]);

  React.useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <div className={styles['route-body']}>
      <Header
        heading='Space Utilization'
        description='Figure out how much space your taking up.'
      />
      <Box sx={{ marginBottom: '2%' }}>
        <TextField
          required
          fullWidth
          label='Directory'
          variant='outlined'
          value={directory}
          onChange={(event) => setDirectory(event.target.value)}
        />
      </Box>
      <Slider
        aria-label='Depth'
        value={depth}
        valueLabelDisplay='auto'
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
    </div>
  );
}
