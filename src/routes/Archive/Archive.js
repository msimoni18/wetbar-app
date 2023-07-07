import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { post } from "utils/requests";
import { str2bool } from "utils/utilities";
import { v4 as uuid } from "uuid";
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
import {
  addItems,
  deleteItem,
  changeExtension,
  changeRemoveDir,
  changeFormat,
  changeType,
  changeOutputDir
} from "./archiveSlice";
import { setIsRunning, setIsNotRunning } from "../../appSlice";
import { TabPanel, allyProps } from "./TabPanel";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function Archive() {
  const dispatch = useDispatch();
  const { items, create, extract } = useSelector((state) => state.archive);
  const [activeTab, setActiveTab] = React.useState(0);
  const [processors, setProcessors] = React.useState(1);

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
  }, []);

  const addRow = () => {
    gridRef.current.api.applyTransaction({ add: [{ id: uuid(), criteria: "" }] });
  };

  const [toggleCriteria, setToggleCriteria] = React.useState();

  React.useEffect(() => {
    setToggleCriteria(extract.type !== "all");
  }, [extract.type]);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleResponse = (response) => {
    dispatch(setIsNotRunning());
    alert(response); // eslint-disable-line no-alert
  };

  const handleButtonClick = () => {

    dispatch(setIsRunning());

    const searchCriteria = [];
    if (extract.type === "files") {
      gridRef.current.api.forEachNode((row) => {
        searchCriteria.push(row.data.criteria);
      });
    }

    post(
      JSON.stringify({
        active_tab: activeTab,
        paths: items,
        file_extension: create.extension,
        remove_directory: create.removeDir,
        archive_format: create.format,
        extract_option: extract.type,
        // search_criteria: extract.criteria,
        search_criteria: searchCriteria,
        output_directory: extract.outputDir,
        processors
      }),
      "archive-files",
      (response) => handleResponse(response),
      (error) => console.error(error)
    );
  };

  return (
    <React.Fragment>
      <Header
        heading="Archives"
        description="Create archive files or extract from existing archives."
      />
      <Grid container spacing={ 2 }>
        <Grid item xs={ 12 }>
          <DragDropFileContainer items={ items } setItems={ addItems } deleteItem={ deleteItem } />
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
                    value={ create.extension }
                    onChange={ (event) => dispatch(changeExtension(event.target.value)) }
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
                    value={ create.format }
                    onChange={ (event) => dispatch(changeFormat(event.target.value)) }
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
                    value={ create.removeDir }
                    onChange={ (event) => dispatch(changeRemoveDir(str2bool(event.target.value))) }
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
                    value={ extract.type }
                    onChange={ (event) => dispatch(changeType(event.target.value)) }
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
                  value={ extract.outputDir }
                  onChange={ (event) => dispatch(changeOutputDir(event.target.value)) }
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
        <Grid container item alignItems="center" justifyContent="center" spacing={ 2 } sx={ { marginTop: "1rem", marginBottom: "2rem" } }>
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
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => (
                  <MenuItem key={ index } value={ item }>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={ 6 } sm={ 2 }>
            <RunButton handleClick={ handleButtonClick }>Run</RunButton>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
