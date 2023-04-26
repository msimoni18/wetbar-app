import { v4 as uuid } from "uuid";
import { createSlice } from "@reduxjs/toolkit";

// TODO: Consider thunk for updating name
//       for better performance

const baseSeries = {
  file: "",
  x: "",
  y: "",
  name: "",
  type: "scatter",
  mode: "lines",
  yaxis: "y",
  booleans: {
    y2: false
  },
  normalize: {
    enable: false,
    type: "min",
    useDifferentParameter: false,
    parameter: ""
  },
  z: "",
  aggregate: "min"
};

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
    plots: {}
    // plots: {
    //   'plot-id-1': {
    //     series: {
    //       'series-id-1': {x, y, z},
    //       'series-id-1': {x, y, z},
    //     },
    //     layout: {}
    //   }
    // }
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
    addPlot: (state) => {
      state.plots = {
        ...state.plots,
        [uuid()]: { series: {}, layout: {} }
      };
    },
    deletePlot: (state, { payload }) => {
      delete state.plots[payload];
    },
    addSeries: (state, { payload }) => {
      const seriesId = uuid();
      state.plots[payload].series = {
        ...state.plots[payload].series,
        [seriesId]: { id: seriesId, ...baseSeries }
      };
    },
    deleteSeries: (state, { payload }) => {
      delete state.plots[payload.plotId].series[payload.id];
    },
    updateSeries: (state, { payload }) => {
      state.plots[payload.plotId].series[payload.id] = {
        ...state.plots[payload.plotId].series[payload.id],
        ...payload.newInput
      };
    },
    updateSeriesBooleans: (state, { payload }) => {
      state.plots[payload.plotId].series[payload.id] = {
        ...state.plots[payload.plotId].series[payload.id],
        booleans: {
          ...state.plots[payload.plotId].series[payload.id].booleans,
          ...payload.newInput
        }
      };
    },
    updateSeriesNormalize: (state, { payload }) => {
      state.plots[payload.plotId].series[payload.id] = {
        ...state.plots[payload.plotId].series[payload.id],
        normalize: {
          ...state.plots[payload.plotId].series[payload.id].normalize,
          ...payload.newInput
        }
      };
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
  addPlot,
  deletePlot,
  addSeries,
  deleteSeries,
  updateSeries,
  updateSeriesBooleans,
  updateSeriesNormalize
} = plotsSlice.actions;

export default plotsSlice.reducer;
