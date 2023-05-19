import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isRunning: false
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsRunning: (state) => {
      state.isRunning = true;
    },
    setIsNotRunning: (state) => {
      state.isRunning = false;
    }
  }
});

export const { setIsRunning, setIsNotRunning } = appSlice.actions;

export default appSlice.reducer;
