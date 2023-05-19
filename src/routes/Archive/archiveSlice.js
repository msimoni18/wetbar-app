import { createSlice } from "@reduxjs/toolkit";

const archiveSlice = createSlice({
  name: "archive",
  initialState: {
    items: [],
    create: {
      extension: ".tar.gz",
      removeDir: false,
      format: "PAX"
    },
    extract: {
      type: "all",
      outputDir: ""
      // criteria: ""
    }
  },
  reducers: {
    addItems: (state, action) => {
      const index = state.items.findIndex(
        (object) => object.path === action.payload.path
      );
      if (index === -1) {
        state.items.push(action.payload);
      }
    },
    deleteItem: (state, action) => {
      state.items = state.items.filter((_, i) => i !== action.payload);
    },
    changeExtension: (state, { payload }) => {
      state.create.extension = payload;
    },
    changeRemoveDir: (state, { payload }) => {
      state.create.removeDir = payload;
    },
    changeFormat: (state, { payload }) => {
      state.create.format = payload;
    },
    changeType: (state, { payload }) => {
      state.extract.type = payload;
    },
    changeOutputDir: (state, { payload }) => {
      state.extract.outputDir = payload;
    }
    // changeCriteria: (state, { payload }) => {
    //   state.extract.criteria = payload;
    // }
  }
});

export const {
  addItems,
  deleteItem,
  changeExtension,
  changeRemoveDir,
  changeFormat,
  changeType,
  changeOutputDir,
  changeCriteria
} = archiveSlice.actions;

export default archiveSlice.reducer;
