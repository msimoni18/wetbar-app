import { v4 as uuid } from "uuid";
import { rgbaToString } from "utils/utilities";
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

const initialColors = {
  majorGridline: { r: 230, g: 230, b: 230, a: 1 },
  minorGridline: { r: 216, g: 216, b: 216, a: 1 },
  font: { r: 68, g: 68, b: 68, a: 1 },
  plotBackground: { r: 255, g: 255, b: 255, a: 1 }
};

const baseLayout = {
  height: 400,
  font: {
    color: rgbaToString(initialColors.font),
    size: 12
  },
  title: {
    text: ""
  },
  xaxis: {
    title: "",
    domain: [0, 1],
    gridcolor: rgbaToString(initialColors.majorGridline),
    griddash: "solid",
    gridwidth: 1,
    showgrid: true,
    minor: {
      gridcolor: rgbaToString(initialColors.minorGridline),
      griddash: "dot",
      gridwidth: 1,
      showgrid: true
    }
  },
  yaxis: {
    title: "",
    gridcolor: rgbaToString(initialColors.majorGridline),
    griddash: "solid",
    gridwidth: 1,
    showgrid: true,
    minor: {
      gridcolor: rgbaToString(initialColors.minorGridline),
      griddash: "dot",
      gridwidth: 1,
      showgrid: true
    }
  },
  showlegend: false,
  paper_bgcolor: rgbaToString(initialColors.plotBackground),
  plot_bgcolor: rgbaToString(initialColors.plotBackground),
  margin: {
    b: 80,
    l: 80,
    t: 80,
    r: 80
  },
  barmode: "group"
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
    //     data: [],
    //     layout: {},
    //     options: {
    //       colorscale: "Jet",
    //       reversescale: true
    //     }
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
        [uuid()]: {
          series: {},
          layout: { ...baseLayout },
          data: [],
          options: {
            enableY2: false,
            colorscale: "Jet",
            reversescale: true,
            enableBarOptions: false,
            enableBarLabels: false,
            enableContourOptions: false,
            y2: {
              title: "",
              position: 1
            }
          }
        }
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
    },
    updateLayout: (state, { payload }) => {
      state.plots[payload.id].layout = {
        ...state.plots[payload.id].layout,
        ...payload.newInput
      };
    },
    updateLayoutFont: (state, { payload }) => {
      state.plots[payload.id].layout = {
        ...state.plots[payload.id].layout,
        font: {
          ...state.plots[payload.id].layout.font,
          ...payload.newInput
        }
      };
    },
    updateLayoutTitle: (state, { payload }) => {
      state.plots[payload.id].layout = {
        ...state.plots[payload.id].layout,
        title: {
          ...state.plots[payload.id].layout.title,
          ...payload.newInput
        }
      };
    },
    updateLayoutXAxis: (state, { payload }) => {
      state.plots[payload.id].layout = {
        ...state.plots[payload.id].layout,
        xaxis: {
          ...state.plots[payload.id].layout.xaxis,
          ...payload.newInput
        }
      };
    },
    updateLayoutXAxisGridMinor: (state, { payload }) => {
      state.plots[payload.id].layout = {
        ...state.plots[payload.id].layout,
        xaxis: {
          ...state.plots[payload.id].layout.xaxis,
          minor: {
            ...state.plots[payload.id].layout.xaxis.minor,
            ...payload.newInput
          }
        }
      };
    },
    updateLayoutYAxis: (state, { payload }) => {
      state.plots[payload.id].layout = {
        ...state.plots[payload.id].layout,
        yaxis: {
          ...state.plots[payload.id].layout.yaxis,
          ...payload.newInput
        }
      };
    },
    updateLayoutYAxisGridMinor: (state, { payload }) => {
      state.plots[payload.id].layout = {
        ...state.plots[payload.id].layout,
        yaxis: {
          ...state.plots[payload.id].layout.yaxis,
          minor: {
            ...state.plots[payload.id].layout.yaxis.minor,
            ...payload.newInput
          }
        }
      };
    },
    updateLayoutMargin: (state, { payload }) => {
      state.plots[payload.id].layout = {
        ...state.plots[payload.id].layout,
        margin: {
          ...state.plots[payload.id].layout.yaxis,
          ...payload.newInput
        }
      };
    },
    updateColorScaleOptions: (state, { payload }) => {
      state.data = state.data.map((row) => (
        { ...row, ...payload.newInput }
      ));

      state.options = { ...state.options, ...payload.newInput };
    },
    updateOptions: (state, { payload }) => {
      state.options = { ...state.options, ...payload.newInput };
    },
    updateOptionsY2: (state, { payload }) => {
      state.options = {
        ...state.options,
        y2: {
          ...state.options.y2,
          ...payload.newInput
        } };

      if (state.options.enableY2) {
        state.layout = {
          ...state.layout,
          xaxis: {
            ...state.layout.xaxis,
            domain: [0, state.options.y2.position]
          },
          yaxis2: {
            title: state.options.y2.title,
            showgrid: false,
            minor: {
              showgrid: false
            },
            anchor: "free",
            overlaying: "y",
            side: "right",
            position: state.options.y2.position
          } };
      } else {
        state.layout = {
          ...state.layout,
          xaxis: {
            ...state.layout.xaxis,
            domain: [0, 1]
          },
          yaxis2: {}
        };
      }
    },
    updateBarLabels: (state, { payload }) => {
      state.options = { ...state.option, ...payload.newInput };

      if (state.options.enableBarLabels) {
        state.data = state.data.map((row) => {
          if (row.type === "bar") {
            return { ...row, text: row.y.map(String), textposition: "auto" };
          }
          return row;
        });
      } else {
        state.data = state.data.map((row) => {
          if (row.type === "bar") {
            delete row.text;
            delete row.textposition;
            return row;
          }
        });
      }
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
  updateSeriesNormalize,
  updateLayout,
  updateLayoutFont,
  updateLayoutTitle,
  updateLayoutXAxis,
  updateLayoutXAxisGridMinor,
  updateLayoutYAxis,
  updateLayoutYAxisGridMinor,
  updateLayoutMargin,
  updateColorScaleOptions,
  updateOptions,
  updateOptionsY2,
  updateBarLabels
} = plotsSlice.actions;

export default plotsSlice.reducer;
