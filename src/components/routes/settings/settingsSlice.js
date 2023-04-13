import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: "settings",
  initialState: {},
  reducers: {
    addFiles: (state, { payload }) => {
      state.files = payload;
    }
  }
});

export const { addFiles } = settingsSlice.actions;

export default settingsSlice.reducer;
