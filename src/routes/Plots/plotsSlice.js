import { v4 as uuid } from "uuid";
import { rgbaToString } from "utils/utilities";
import { createSlice, current } from "@reduxjs/toolkit";

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
  plotBackground: { r: 255, g: 255, b: 255, a: 1 },
  shapeline: { r: 255, g: 0, b: 0, a: 1 },
  shapefill: { r: 255, g: 0, b: 0, a: 0.5 }
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
  barmode: "group",
  shapes: []
};

const basevline = {
  type: "line",
  xref: "x",
  yref: "paper",
  x0: 0,
  x1: 0,
  y0: 0,
  y1: 1,
  line: {
    color: rgbaToString(initialColors.shapeline),
    width: 2
  }
};

const basehline = {
  type: "line",
  xref: "paper",
  yref: "y",
  x0: 0,
  x1: 1,
  y0: 0,
  y1: 0,
  line: {
    color: rgbaToString(initialColors.shapeline),
    width: 2
  }
};

const baserect = {
  type: "rect",
  xref: "x",
  yref: "y",
  x0: 0,
  x1: 0,
  y0: 0,
  y1: 0,
  line: {
    color: rgbaToString(initialColors.shapeline),
    width: 2
  },
  fillcolor: rgbaToString(initialColors.shapefill)
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
    //     shapes: {},
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
          shapes: {},
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
    addData: (state, { payload }) => {
      state.plots[payload.id].data = payload.newData;
    },
    // updateData: (state, {payload}) => {
    //   // For things like yaxis2, bar labels, etc
    //   state.plots[payload.plotId].data = xxx
    // },
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
    updateLayoutYAxis: (state, { payload }) => {
      state.plots[payload.id].layout = {
        ...state.plots[payload.id].layout,
        yaxis: {
          ...state.plots[payload.id].layout.yaxis,
          ...payload.newInput
        }
      };
    },
    updateLayoutMajorGridlines: (state, { payload }) => {
      state.plots[payload.id].layout = {
        ...state.plots[payload.id].layout,
        xaxis: {
          ...state.plots[payload.id].layout.xaxis,
          ...payload.newInput
        },
        yaxis: {
          ...state.plots[payload.id].layout.yaxis,
          ...payload.newInput
        }
      };
    },
    updateLayoutMinorGridlines: (state, { payload }) => {
      state.plots[payload.id].layout = {
        ...state.plots[payload.id].layout,
        xaxis: {
          ...state.plots[payload.id].layout.xaxis,
          minor: {
            ...state.plots[payload.id].layout.xaxis.minor,
            ...payload.newInput
          }
        },
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
          ...state.plots[payload.id].layout.margin,
          ...payload.newInput
        }
      };
    },
    updateColorScaleOptions: (state, { payload }) => {
      state.plots[payload.id].options = {
        ...state.plots[payload.id].options,
        ...payload.newInput
      };

      state.plots[payload.id].data = state.plots[payload.id].data?.map((row) => (
        { ...row, ...payload.newInput }
      ));
    },
    updateOptions: (state, { payload }) => {
      state.plots[payload.id].options = {
        ...state.plots[payload.id].options,
        ...payload.newInput
      };
    },
    updateOptionsY2: (state, { payload }) => {
      state.plots[payload.id].options = {
        ...state.plots[payload.id].options,
        y2: {
          ...state.plots[payload.id].options.y2,
          ...payload.newInput
        }
      };

      if (state.plots[payload.id].options.enableY2) {
        state.layout = {
          ...state.layout,
          xaxis: {
            ...state.layout.xaxis,
            domain: [0, state.plots[payload.id].options.y2.position]
          },
          yaxis2: {
            title: state.plots[payload.id].options.y2.title,
            showgrid: false,
            minor: {
              showgrid: false
            },
            anchor: "free",
            overlaying: "y",
            side: "right",
            position: state.plots[payload.id].options.y2.position
          }
        };
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
      state.plots[payload.id].options = {
        ...state.plots[payload.id].options,
        ...payload.newInput
      };

      if (state.plots[payload.id].options.enableBarLabels) {
        state.plots[payload.id].data = state.plots[payload.id].data?.map((row) => {
          if (row.type === "bar") {
            return { ...row, text: row.y.map(String), textposition: "auto" };
          }
          return row;
        });
      } else {
        state.plots[payload.id].data = state.plots[payload.id].data?.map((row) => {
          if (row.type === "bar") {
            delete row.text;
            delete row.textposition;
          }
          return row;
        });
      }
    },
    addShape: (state, { payload }) => {
      let newShape = {};
      if (payload.type === "vline") {
        newShape = { type: payload.type, shape: { ...basevline } };
      } else if (payload.type === "hline") {
        newShape = { type: payload.type, shape: { ...basehline } };
      } else {
        newShape = { type: payload.type, shape: { ...baserect } };
      }

      const shapeId = uuid();
      state.plots[payload.id].shapes = {
        ...state.plots[payload.id].shapes,
        [shapeId]: {
          id: shapeId,
          ...newShape
        }
      };

      const newShapes = [];
      Object.keys(state.plots[payload.id].shapes).forEach((row) => {
        newShapes.push(state.plots[payload.id].shapes[row].shape);
      });

      state.plots[payload.id].layout = {
        ...state.plots[payload.id].layout,
        shapes: newShapes
      };

    },
    deleteShape: (state, { payload }) => {
      delete state.plots[payload.plotId].shapes[payload.id];

      const newShapes = [];
      Object.keys(state.plots[payload.plotId].shapes).forEach((id) => {
        newShapes.push(state.plots[payload.plotId].shapes[id]);
      });

      state.plots[payload.plotId].layout = {
        ...state.plots[payload.plotId].layout,
        shapes: newShapes
      };
    },
    updateShape: (state, { payload }) => {
      state.plots[payload.plotId].shapes[payload.id] = {
        ...state.plots[payload.plotId].shapes[payload.id],
        shape: {
          ...state.plots[payload.plotId].shapes[payload.id].shape,
          ...payload.newInput
        }
      };

      const newShapes = [];
      Object.keys(state.plots[payload.plotId].shapes).forEach((id) => {
        newShapes.push(state.plots[payload.plotId].shapes[id].shape);
      });

      state.plots[payload.plotId].layout = {
        ...state.plots[payload.plotId].layout,
        shapes: newShapes
      };
    },
    updateShapeLineStyle: (state, { payload }) => {
      state.plots[payload.plotId].shapes[payload.id] = {
        ...state.plots[payload.plotId].shapes[payload.id],
        shape: {
          ...state.plots[payload.plotId].shapes[payload.id].shape,
          line: {
            ...state.plots[payload.plotId].shapes[payload.id].shape.line,
            ...payload.newInput
          }
        }
      };

      const newShapes = [];
      Object.keys(state.plots[payload.plotId].shapes).forEach((id) => {
        newShapes.push(state.plots[payload.plotId].shapes[id].shape);
      });

      state.plots[payload.plotId].layout = {
        ...state.plots[payload.plotId].layout,
        shapes: newShapes
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
  updateSeriesNormalize,
  addData,
  updateLayout,
  updateLayoutFont,
  updateLayoutTitle,
  updateLayoutXAxis,
  updateLayoutYAxis,
  updateLayoutMajorGridlines,
  updateLayoutMinorGridlines,
  updateLayoutMargin,
  updateColorScaleOptions,
  updateOptions,
  updateOptionsY2,
  updateBarLabels,
  addShape,
  updateShape,
  updateShapeLineStyle,
  deleteShape
} = plotsSlice.actions;

export default plotsSlice.reducer;
