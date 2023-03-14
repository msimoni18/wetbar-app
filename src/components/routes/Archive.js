import * as React from "react";
import { post } from "utils/requests";
import { v4 as uuid } from "uuid";
import PropTypes from "prop-types";
import {
  Box,
  Grid,
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
  Tooltip,
  IconButton
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Header from "components/containers/Header";
import DragDropFileContainer from "components/containers/DragDropFileContainer";
import RunButton from "components/buttons/RunButton";
import DeleteTableRow from "components/buttons/DeleteTableRow";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import styles from "components/App.module.scss";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={ value !== index }
      id={ `tabpanel-${index}` }
      { ...other }
    >
      {value === index && (
        <Box sx={ { marginLeft: "1%", marginTop: "1%" } }>{children}</Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function allyProps(index) {
  return {
    "id": `tab-${index}`,
    "aria-controls": `tabpanel-${index}`
  };
}

const numProcessors = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function Archive() {
  const [items, setItems] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState(0);
  const [active, setActive] = React.useState(false);

  // Create options
  const [fileExtension, setFileExtension] = React.useState(".tar.gz");
  const [removeDirectory, setRemoveDirectory] = React.useState(false);
  const [archiveFormat, setArchiveFormat] = React.useState("PAX");

  // Extract options
  const gridRef = React.useRef();
  const gridStyle = React.useMemo(() => ({ height: 300 }), []);
  const [rowData] = React.useState([
    { id: uuid(), criteria: "*.streamdef" },
    { id: uuid(), criteria: "*.streamlog" },
    { id: uuid(), criteria: "*.summarylog" },
    { id: uuid(), criteria: "*.tabii" },
    { id: uuid(), criteria: "*Trends*" },
    { id: uuid(), criteria: "*TR_DPR_Plots*.pdf" },
    { id: uuid(), criteria: "*Plant_Collector*pco_summary_data.rod" }
  ]);

  const [columnDefs] = React.useState([
    { field: "id", hide: true },
    {
      field: "criteria",
      headerName: "Criteria",
      editable: true
    },
    {
      field: "delete",
      headerName: "Delete",
      maxWidth: 80,
      cellRenderer: DeleteTableRow
    }
  ]);

  const defaultColDef = React.useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      sortable: true,
      resizable: true
    };
  });

  const addRow = () => {
    gridRef.current.api.applyTransaction({ add: [{ id: uuid(), criteria: "" }] });
  };

  const [extractType, setExtractType] = React.useState("all");
  const [outputDirectory, setOutputDirectory] = React.useState("");
  const [toggleCriteria, setToggleCriteria] = React.useState();

  React.useEffect(() => {
    setToggleCriteria(extractType !== "all");
  }, [extractType]);

  const [processors, setProcessors] = React.useState(1);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleResponse = (response) => {
    setActive(false);
    alert(response);
  };

  const handleButtonClick = () => {

    const searchCriteria = [];
    if (extractType === "files") {
      gridRef.current.api.forEachNode((row) => {
        searchCriteria.push(row.data.criteria);
      });
    }

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
        processors
      }),
      "archive-files",
      (response) => handleResponse(response),
      (error) => console.error(error)
    );
  };

  return (
    <div className={ styles["route-body"] }>
      <Header
        heading="Archives"
        description="Create archive files or extract from existing archives."
      />
      <Grid container spacing={ 2 }>
        <Grid item xs={ 12 }>
          <DragDropFileContainer files={ items } setFiles={ setItems } />
        </Grid>
        <Grid item xs={ 12 }>
          <Box sx={ { borderBottom: 1, borderColor: "divider" } }>
            <Tabs value={ activeTab } onChange={ handleChange } centered>
              <Tab value={ 0 } label="Create" { ...allyProps(0) } />
              <Tab value={ 1 } label="Extract" { ...allyProps(1) } />
            </Tabs>
          </Box>
          <TabPanel value={ activeTab } index={ 0 }>
            <Grid container spacing={ 2 }>
              <Grid item xs={ 12 } sm={ 4 }>
                <FormControl>
                  <FormLabel>File Type:</FormLabel>
                  <RadioGroup
                    aria-labelledby="radio-buttons-group-label"
                    name="file-type-radio-buttons-group"
                    value={ fileExtension }
                    onChange={ (event) => setFileExtension(event.target.value) }
                    row
                  >
                    <FormControlLabel value=".tar" control={ <Radio /> } label=".tar" />
                    <FormControlLabel value=".tar.gz" control={ <Radio /> } label=".tar.gz" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={ 12 } sm={ 4 }>
                <FormControl>
                  <FormLabel>Archive Format:</FormLabel>
                  <RadioGroup
                    aria-labelledby="radio-buttons-group-label"
                    name="archive-format-radio-buttons-group"
                    value={ archiveFormat }
                    onChange={ (event) => setArchiveFormat(event.target.value) }
                    row
                  >
                    <FormControlLabel value="PAX" control={ <Radio /> } label="PAX" />
                    <FormControlLabel value="GNU" control={ <Radio /> } label="GNU" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={ 12 } sm={ 4 }>
                <FormControl>
                  <FormLabel>Remove directories after completion:</FormLabel>
                  <RadioGroup
                    aria-labelledby="radio-buttons-group-label"
                    name="remove-directory-radio-buttons-group"
                    value={ removeDirectory }
                    onChange={ (event) => setRemoveDirectory(event.target.value) }
                    row
                  >
                    <FormControlLabel value control={ <Radio /> } label="Yes" />
                    <FormControlLabel value={ false } control={ <Radio /> } label="No" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={ activeTab } index={ 1 }>
            <Grid container alignItems="center" spacing={ 2 }>
              <Grid item xs={ 12 } sm={ 12 } md={ 3 }>
                <FormControl>
                  <FormLabel>Extract Options:</FormLabel>
                  <RadioGroup
                    aria-labelledby="radio-buttons-group-label"
                    name="extract-type-radio-buttons-group"
                    value={ extractType }
                    onChange={ (event) => setExtractType(event.target.value) }
                  >
                    <FormControlLabel value="all" control={ <Radio /> } label="Entire File" />
                    <FormControlLabel value="files" control={ <Radio /> } label="Specific Files" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={ 12 } sm={ 12 } md={ 9 }>
                <TextField
                  required
                  fullWidth
                  label="Output Directory"
                  variant="outlined"
                  value={ outputDirectory }
                  onChange={ (event) => setOutputDirectory(event.target.value) }
                />
              </Grid>
              <Grid item xs={ 12 }>
                {toggleCriteria && (
                  <Box>
                    <div className="ag-theme-alpine" style={ gridStyle }>
                      <AgGridReact
                        ref={ gridRef }
                        rowData={ rowData }
                        columnDefs={ columnDefs }
                        defaultColDef={ defaultColDef }
                        rowSelection="multiple"
                        suppressRowClickSelection
                        animateRows
                      />
                    </div>
                    <Tooltip title="Add new row" placement="right">
                      <IconButton onClick={ addRow }>
                        <AddCircleIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Grid>
            </Grid>
          </TabPanel>
        </Grid>
        <Grid container item alignItems="center" justifyContent="center" spacing={ 2 } sx={ { marginTop: "1rem" } }>
          <Grid item xs={ 6 } sm={ 2 }>
            <FormControl sx={ { width: 100 } }>
              <InputLabel id="processor-select-label">Processors</InputLabel>
              <Select
                labelId="processor-select-label"
                id="processor-select"
                label="Processors"
                value={ processors }
                onChange={ (event) => setProcessors(event.target.value) }
              >
                {numProcessors?.map((item, index) => (
                  <MenuItem key={ index } value={ item }>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={ 6 } sm={ 2 }>
            <RunButton active={ active } handleClick={ handleButtonClick } />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
