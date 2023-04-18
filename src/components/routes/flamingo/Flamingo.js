import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { post } from "utils/requests";
import { str2bool } from "utils/utilities";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography
} from "@mui/material";
import Header from "components/containers/Header";
import RunButton from "components/buttons/RunButton";
import DragDropTextField from "components/containers/DragDropTextField";
import { setIsRunning, setIsNotRunning } from "components/appSlice";
import {
  changeYamlFile,
  changeOutputName,
  changeOutputDir,
  changeLoggingLevel,
  changeWriteExpandedYaml,
  changeSkipMath,
  changeRemoveEmptyRows
} from "./flamingoSlice";

export default function Flamingo() {
  const dispatch = useDispatch();
  const {
    yamlFile,
    outputName,
    outputDir,
    loggingLevel,
    writeExpandedYaml,
    skipMath,
    removeEmptyRows
  } = useSelector((state) => state.flamingo);

  const handleResponse = (response) => {
    dispatch(setIsNotRunning());
    alert(response.message); // eslint-disable-line no-alert
  };

  const handleButtonClick = () => {
    dispatch(setIsRunning());
    post(
      JSON.stringify({
        yamlFile,
        outputName,
        outputDir,
        loggingLevel,
        writeExpandedYaml,
        skipMath,
        removeEmptyRows
      }),
      "flamingo",
      (response) => handleResponse(response),
      (error) => console.error(error)
    );
  };

  return (
    <React.Fragment>
      <Header
        heading="Flamingo"
        description="User interface for running flamingo."
      />
      <Grid container spacing={ 2 }>
        <Grid item xs={ 12 }>
          <Typography>YAML File</Typography>
          <DragDropTextField item={ yamlFile } setItem={ changeYamlFile } />
        </Grid>
        <Grid item xs={ 12 } sm={ 3 }>
          <FormControl fullWidth>
            <TextField
              id="output-name"
              variant="outlined"
              label="Output File Name"
              value={ outputName }
              onChange={ (event) => dispatch(changeOutputName(event.target.value)) }
            />
          </FormControl>
        </Grid>
        <Grid item xs={ 12 } sm={ 9 }>
          <FormControl fullWidth>
            <TextField
              id="output-directory"
              variant="outlined"
              label="Output Directory"
              value={ outputDir }
              onChange={ (event) => dispatch(changeOutputDir(event.target.value)) }
            />
          </FormControl>
        </Grid>
        <Grid item xs={ 12 } sm={ 3 }>
          <FormControl>
            <FormLabel>Logging Level:</FormLabel>
            <RadioGroup
              aria-labelledby="radio-buttons-group-label"
              name="logging-level-radio-buttons-group"
              value={ loggingLevel }
              onChange={ (event) => dispatch(changeLoggingLevel(event.target.value)) }
            >
              <FormControlLabel value="DEBUG" control={ <Radio /> } label="DEBUG" />
              <FormControlLabel value="INFO" control={ <Radio /> } label="INFO" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={ 12 } sm={ 3 }>
          <FormControl>
            <FormLabel>Write Expanded YAML:</FormLabel>
            <RadioGroup
              aria-labelledby="radio-buttons-group-label"
              name="write-yaml-radio-buttons-group"
              value={ writeExpandedYaml }
              onChange={ (event) => dispatch(changeWriteExpandedYaml(str2bool(event.target.value))) }
            >
              <FormControlLabel value control={ <Radio /> } label="True" />
              <FormControlLabel value={ false } control={ <Radio /> } label="False" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={ 12 } sm={ 3 }>
          <FormControl>
            <FormLabel>Skip MathOperations:</FormLabel>
            <RadioGroup
              aria-labelledby="radio-buttons-group-label"
              name="skip-math-radio-buttons-group"
              value={ skipMath }
              onChange={ (event) => dispatch(changeSkipMath(str2bool(event.target.value))) }
            >
              <FormControlLabel value control={ <Radio /> } label="True" />
              <FormControlLabel value={ false } control={ <Radio /> } label="False" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={ 12 } sm={ 3 }>
          <FormControl>
            <FormLabel>Remove Empty Rows:</FormLabel>
            <RadioGroup
              aria-labelledby="radio-buttons-group-label"
              name="remove-empty-rows-radio-buttons-group"
              value={ removeEmptyRows }
              onChange={ (event) => dispatch(changeRemoveEmptyRows(str2bool(event.target.value))) }
            >
              <FormControlLabel value control={ <Radio /> } label="True" />
              <FormControlLabel value={ false } control={ <Radio /> } label="False" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={ 12 } sx={ { display: "flex", justifyContent: "center" } }>
          <RunButton handleClick={ handleButtonClick }>Run</RunButton>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
