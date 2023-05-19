import React from "react";
import { useSelector } from "react-redux";
import StatCard from "components/cards/StatCard";
import Grid from "@mui/material/Grid";
import { addCommaToNumber, formatBytes } from "utils/utilities";

export default function Stats() {
  const { stats } = useSelector((state) => state.cleanup);

  return (
    <Grid container spacing={ 2 }>
      <Grid item xs={ 12 }>
        <StatCard title="Directories searched" stat={ addCommaToNumber(stats.dirCount) } />
      </Grid>
      <Grid item xs={ 12 }>
        <StatCard title="Files deleted" stat={ addCommaToNumber(stats.fileCount) } />
      </Grid>
      <Grid item xs={ 12 }>
        <StatCard title="Total space reduction" stat={ formatBytes(stats.spaceReduction) } />
      </Grid>
      <Grid item xs={ 12 }>
        <StatCard title="Time elapsed (H:M:S)" stat={ stats.totalTime } />
      </Grid>
    </Grid>
  );
}
