import * as React from "react";
import {
  Box,
  InputLabel,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField
} from "@mui/material";
import Header from "components/containers/Header";
import RunButton from "components/buttons/RunButton";
import styles from "components/App.module.scss";

const forms = {
  width: "250px",
  border: "1px solid black"
};

export default function Flamingo() {
  const [outputName, setOutputName] = React.useState("Flamingo");
  const [outputDirectory, setOutputDirectory] = React.useState("");
  const [loggingLevel, setLoggingLevel] = React.useState("INFO");
  const [writeExpandedYaml, setWriteExpandedYaml] = React.useState(false);
  const [skipMath, setSkipMath] = React.useState(true);
  const [removeEmptyRows, setRemoveEmptyRows] = React.useState(true);
  const [active, setActive] = React.useState(false);

  const handleButtonClick = () => {
    console.log("Button click");
  };

  return (
    <div className={ styles["route-body"] }>
      <Header
        heading="Flamingo"
        description="User interface for running flamingo."
      />
      <FormControl fullWidth>
        <TextField
          id="output-name"
          variant="outlined"
          label="Output File Name"
          value={ outputName }
          onChange={ (event) => setOutputName(event.target.value) }
        />
        <TextField
          id="output-directory"
          variant="outlined"
          label="Output Directory"
          value={ outputDirectory }
          onChange={ (event) => setOutputDirectory(event.target.value) }
        />
      </FormControl>
      <Box sx={ { display: "flex", justifyContent: "space-between" } }>
        <Box sx={ forms }>
          <FormControl>
            <FormLabel>Logging Level:</FormLabel>
            <RadioGroup
              aria-labelledby="radio-buttons-group-label"
              name="logging-level-radio-buttons-group"
              value={ loggingLevel }
              onChange={ (event) => setLoggingLevel(event.target.value) }
            >
              <FormControlLabel value="DEBUG" control={ <Radio /> } label="DEBUG" />
              <FormControlLabel value="INFO" control={ <Radio /> } label="INFO" />
            </RadioGroup>
          </FormControl>
        </Box>
        <Box sx={ forms }>
          <FormControl>
            <FormLabel>Write Expanded YAML:</FormLabel>
            <RadioGroup
              aria-labelledby="radio-buttons-group-label"
              name="write-yaml-radio-buttons-group"
              value={ writeExpandedYaml }
              onChange={ (event) => setWriteExpandedYaml(event.target.value) }
            >
              <FormControlLabel value control={ <Radio /> } label="True" />
              <FormControlLabel value={ false } control={ <Radio /> } label="False" />
            </RadioGroup>
          </FormControl>
        </Box>
        <Box sx={ forms }>
          <FormControl>
            <FormLabel>Skip MathOperations:</FormLabel>
            <RadioGroup
              aria-labelledby="radio-buttons-group-label"
              name="skip-math-radio-buttons-group"
              value={ skipMath }
              onChange={ (event) => setSkipMath(event.target.value) }
            >
              <FormControlLabel value control={ <Radio /> } label="True" />
              <FormControlLabel value={ false } control={ <Radio /> } label="False" />
            </RadioGroup>
          </FormControl>
        </Box>
        <Box sx={ forms }>
          <FormControl>
            <FormLabel>Remove Empty Rows:</FormLabel>
            <RadioGroup
              aria-labelledby="radio-buttons-group-label"
              name="remove-empty-rows-radio-buttons-group"
              value={ removeEmptyRows }
              onChange={ (event) => setRemoveEmptyRows(event.target.value) }
            >
              <FormControlLabel value control={ <Radio /> } label="True" />
              <FormControlLabel value={ false } control={ <Radio /> } label="False" />
            </RadioGroup>
          </FormControl>
        </Box>
      </Box>
      <RunButton active={ active } handleClick={ handleButtonClick } />
    </div>
  );
}
