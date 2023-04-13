import { createSlice } from "@reduxjs/toolkit";

const cleanupSlice = createSlice({
  name: "cleanup",
  initialState: {
    folders: [],
    option: "dryRun",
    files: [],
    stats: {
      dirCount: 0,
      fileCount: 0,
      spaceReduction: "0",
      totalTime: 0
    }
  },
  reducers: {
    addFolders: (state, action) => {
      const index = state.folders.findIndex((object) => object.path === action.payload.path);
      if (index === -1) {
        state.folders.push(action.payload);
      }
    },
    deleteFolder: (state, action) => {
      state.folders = state.folders.filter((_, i) => i !== action.payload);
    },
    changeOption: (state, { payload }) => {
      state.option = payload;
    },
    addFiles: (state, { payload }) => {
      state.files = payload;
    },
    updateStats: (state, { payload }) => {
      state.stats = payload;
    }
  }
});

export const {
  addFolders,
  deleteFolder,
  changeOption,
  addFiles,
  updateStats
} = cleanupSlice.actions;

export default cleanupSlice.reducer;
