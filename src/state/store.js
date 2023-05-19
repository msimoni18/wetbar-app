import { configureStore } from "@reduxjs/toolkit";
import spaceHogsReducer from "routes/SpaceHogs/spaceHogsSlice";
import cleanupReducer from "routes/Cleanup/cleanupSlice";
import archiveReducer from "routes/Archive/archiveSlice";
import spaceUtilizationReducer from "routes/SpaceUtilization/spaceUtilizationSlice";
import plotsReducer from "routes/Plots/plotsSlice";
import flamingoReducer from "routes/Flamingo/flamingoSlice";
import settingsReducer from "routes/Settings/settingsSlice";
import appReducer from "../appSlice";

export default configureStore({
  reducer: {
    app: appReducer,
    spacehogs: spaceHogsReducer,
    cleanup: cleanupReducer,
    archive: archiveReducer,
    spaceutilization: spaceUtilizationReducer,
    plots: plotsReducer,
    flamingo: flamingoReducer,
    settings: settingsReducer
  }
});
