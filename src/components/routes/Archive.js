import * as React from 'react';
import { post } from 'utils/requests';

import PropTypes from 'prop-types';
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
  Select,
  TextField,
} from '@mui/material';

import Header from 'components/containers/Header';
import DragDropFileContainer from 'components/containers/DragDropFileContainer';
import RunButton from 'components/buttons/RunButton';

import styles from 'components/App.module.scss';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ marginLeft: '1%', marginTop: '1%' }}>{children}</Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function allyProps(index) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}

export default function Archive() {
  const [items, setItems] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState(0);

  // Create options
  const [fileExtension, setFileExtension] = React.useState('.tar.gz');
  const [removeDirectory, setRemoveDirectory] = React.useState(false);
  const [archiveFormat, setArchiveFormat] = React.useState('PAX');

  // Extract options
  const defaultCriteria =
    '*.streamdef\n' +
    '*.streamlog\n' +
    '*.summarylog\n' +
    '*.tabii\n' +
    '*Trends*\n' +
    '*TR_DPR_Plots*.pdf\n' +
    '*Plant_Collector*/*pco_summary_data.rod';
  const [extractType, setExtractType] = React.useState('all');
  const [searchCriteria, setSearchCriteria] = React.useState(defaultCriteria);
  const [outputDirectory, setOutputDirectory] = React.useState('');
  const [toggleCriteria, setToggleCriteria] = React.useState();

  React.useEffect(() => {
    setToggleCriteria(extractType === 'all' ? false : true);
  }, [extractType]);

  const [processors, setProcessors] = React.useState(1);

  const handleProcessorChange = (event) => {
    setProcessors(event.target.value);
  };

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleButtonClick = () => {
    post(
      JSON.stringify({
        active_tab: activeTab,
        paths: items,
        file_extension: fileExtension,
        remove_directory: removeDirectory,
        archive_format: archiveFormat,
        extract_option: extractType,
        search_criteria: searchCriteria,
        output_directory: outputDirectory,
        processors: processors,
      }),
      'archive-files',
      (response) => alert(response),
      (error) => console.error(error)
    );
  };

  return (
    <div className={styles['route-body']}>
      <Header
        heading='Archives'
        description='Create archive files or extract from existing archives.'
      />
      <DragDropFileContainer files={items} setFiles={setItems} />
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleChange} centered>
            <Tab value={0} label='Create' {...allyProps(0)} />
            <Tab value={1} label='Extract' {...allyProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ marginBotton: '2%' }}>
            <FormControl fullWidth>
              <FormLabel>File Type:</FormLabel>
              <RadioGroup
                aria-labelledby='radio-buttons-group-label'
                defaultValue='.tar.gz'
                name='file-type-radio-buttons-group'
                row
              >
                <FormControlLabel
                  value='.tar'
                  control={<Radio />}
                  label='.tar'
                  onChange={(event) => setFileExtension(event.target.value)}
                />
                <FormControlLabel
                  value='.tar.gz'
                  control={<Radio />}
                  label='.tar.gz'
                  onChange={(event) => setFileExtension(event.target.value)}
                />
              </RadioGroup>
            </FormControl>
          </Box>
          <Box sx={{ marginBotton: '2%' }}>
            <FormControl fullWidth>
              <FormLabel>Archive Format:</FormLabel>
              <RadioGroup
                aria-labelledby='radio-buttons-group-label'
                defaultValue='PAX'
                name='archive-format-radio-buttons-group'
                row
              >
                <FormControlLabel
                  value='PAX'
                  control={<Radio />}
                  label='PAX'
                  onChange={(event) => setArchiveFormat(event.target.value)}
                />
                <FormControlLabel
                  value='GNU'
                  control={<Radio />}
                  label='GNU'
                  onChange={(event) => setArchiveFormat(event.target.value)}
                />
              </RadioGroup>
            </FormControl>
          </Box>
          <Box sx={{ marginBotton: '2%' }}>
            <FormControl fullWidth>
              <FormLabel>Remove directories after completion:</FormLabel>
              <RadioGroup
                aria-labelledby='radio-buttons-group-label'
                defaultValue={false}
                name='remove-directory-radio-buttons-group'
                row
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label='Yes'
                  onChange={(event) => setRemoveDirectory(event.target.value)}
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label='No'
                  onChange={(event) => setRemoveDirectory(event.target.value)}
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ marginBotton: '2%' }}>
            <FormControl fullWidth>
              <FormLabel>Extract Options:</FormLabel>
              <RadioGroup
                aria-labelledby='radio-buttons-group-label'
                defaultValue='all'
                name='extract-type-radio-buttons-group'
                row
              >
                <FormControlLabel
                  value='all'
                  control={<Radio />}
                  label='Entire File'
                  onChange={(event) => setExtractType(event.target.value)}
                />
                <FormControlLabel
                  value='files'
                  control={<Radio />}
                  label='Specific Files'
                  onChange={(event) => setExtractType(event.target.value)}
                />
              </RadioGroup>
            </FormControl>
          </Box>
          {toggleCriteria && (
            <TextField
              label='Search Criteria'
              inputProps={{ style: { paddingLeft: 5 } }}
              multiline
              sx={{ width: '50%' }}
              maxRows={8}
              value={searchCriteria}
              onChange={(event) => setSearchCriteria(event.target.value)}
              variant='outlined'
              spellCheck={false}
            />
          )}
          <Box sx={{ marginBottom: '2%' }}>
            <TextField
              required
              fullWidth
              label='Output Directory'
              variant='outlined'
              value={outputDirectory}
              onChange={(event) => setOutputDirectory(event.target.value)}
            />
          </Box>
        </TabPanel>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FormControl sx={{ width: 100 }}>
            <InputLabel id='processor-select-label'>Processors</InputLabel>
            <Select
              value={processors}
              labelId='processor-select-label'
              id='processor-select'
              label='Processors'
              onChange={handleProcessorChange}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={7}>7</MenuItem>
              <MenuItem value={8}>8</MenuItem>
              <MenuItem value={9}>9</MenuItem>
              <MenuItem value={10}>10</MenuItem>
            </Select>
          </FormControl>
          <RunButton handleClick={handleButtonClick} />
        </Box>
      </Box>
    </div>
  );
}
