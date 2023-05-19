import { createSlice } from "@reduxjs/toolkit";

const flamingoSlice = createSlice({
  name: "flamingo",
  initialState: {
    yamlFile: "",
    outputName: "Flamingo",
    outputDir: "",
    loggingLevel: "INFO",
    writeExpandedYaml: false,
    skipMath: true,
    removeEmptyRows: true
  },
  reducers: {
    changeYamlFile: (state, { payload }) => {
      state.yamlFile = payload;
    },
    changeOutputName: (state, { payload }) => {
      state.outputName = payload;
    },
    changeOutputDir: (state, { payload }) => {
      state.outputDir = payload;
    },
    changeLoggingLevel: (state, { payload }) => {
      state.loggingLevel = payload;
    },
    changeWriteExpandedYaml: (state, { payload }) => {
      state.writeExpandedYaml = payload;
    },
    changeSkipMath: (state, { payload }) => {
      state.skipMath = payload;
    },
    changeRemoveEmptyRows: (state, { payload }) => {
      state.removeEmptyRows = payload;
    }
  }
});

export const {
  changeYamlFile,
  changeOutputName,
  changeOutputDir,
  changeLoggingLevel,
  changeWriteExpandedYaml,
  changeSkipMath,
  changeRemoveEmptyRows
} = flamingoSlice.actions;

export default flamingoSlice.reducer;
