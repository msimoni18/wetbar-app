import { configureStore } from "@reduxjs/toolkit";
import appReducer from "components/appSlice";
import spaceHogsReducer from "components/routes/spacehogs/spaceHogsSlice";
import cleanupReducer from "components/routes/cleanup/cleanupSlice";
import archiveReducer from "components/routes/archive/archiveSlice";
import spaceUtilizationReducer from "components/routes/spaceutilization/spaceUtilizationSlice";
import plotsReducer from "components/routes/plots/plotsSlice";
import flamingoReducer from "components/routes/flamingo/flamingoSlice";
import settingsReducer from "components/routes/settings/settingsSlice";

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
