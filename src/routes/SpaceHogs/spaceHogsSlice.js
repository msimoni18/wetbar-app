import { createSlice } from "@reduxjs/toolkit";

const spaceHogsSlice = createSlice({
  name: "spacehogs",
  initialState: {
    site: "Knolls"
  },
  reducers: {
    updateSite: (state, action) => {
      state.site = action.payload;
    }
  }
});

export const { updateSite } = spaceHogsSlice.actions;

export default spaceHogsSlice.reducer;
