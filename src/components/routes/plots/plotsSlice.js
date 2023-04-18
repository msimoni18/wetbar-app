import { v4 as uuid } from "uuid";
import { createSlice } from "@reduxjs/toolkit";

const plotsSlice = createSlice({
  name: "plots",
  initialState: {
    fileOptions: {
      items: [],
      searchCriteria: "folder",
      regex: "*.xlsx",
      skipRows: "",
      delimiter: "",
      sheets: "",
      loadedData: {}
    },
    plotList: []
  },
  reducers: {
    addItems: (state, { payload }) => {
      const index = state.fileOptions.items.findIndex(
        (object) => object.path === payload.path
      );
      if (index === -1) {
        state.fileOptions.items.push(payload);
      }
    },
    deleteItem: (state, { payload }) => {
      state.fileOptions.items = state.fileOptions.items.filter((_, i) => i !== payload);
    },
    changeCriteria: (state, { payload }) => {
      state.fileOptions.searchCriteria = payload;
    },
    changeRegex: (state, { payload }) => {
      state.fileOptions.regex = payload;
    },
    changeSkipRows: (state, { payload }) => {
      state.fileOptions.skipRows = payload;
    },
    changeDelimiter: (state, { payload }) => {
      state.fileOptions.delimiter = payload;
    },
    changeSheets: (state, { payload }) => {
      state.fileOptions.sheets = payload;
    },
    addLoadedFiles: (state, { payload }) => {
      state.fileOptions.loadedData = payload;
    },
    addNewPlot: (state) => {
      state.plotList = [...state.plotList, uuid()];
    },
    deletePlot: (state, { payload }) => {
      state.plotList = state.plotList.filter((id) => id !== payload);
    }
  }
});

export const {
  addItems,
  deleteItem,
  changeCriteria,
  changeRegex,
  changeSkipRows,
  changeDelimiter,
  changeSheets,
  addLoadedFiles,
  addNewPlot,
  deletePlot
} = plotsSlice.actions;

export default plotsSlice.reducer;
