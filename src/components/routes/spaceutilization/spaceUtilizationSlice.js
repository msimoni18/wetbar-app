import { createSlice } from "@reduxjs/toolkit";

const spaceUtilizationSlice = createSlice({
  name: "spaceutilization",
  initialState: {
    folder: ""
  },
  reducers: {
    changeFolder: (state, { payload }) => {
      state.folder = payload;
    }
  }
});

export const { changeFolder } = spaceUtilizationSlice.actions;

export default spaceUtilizationSlice.reducer;
