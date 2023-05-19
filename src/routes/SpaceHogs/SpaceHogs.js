import * as React from "react";
import {
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { post } from "utils/requests";
import Header from "components/containers/Header";
import StatCard from "components/cards/StatCard";
import { updateSite } from "./spaceHogsSlice";
import SpaceHogsTable from "./SpaceHogsTable";
import SpaceHogsPlot from "./SpaceHogsPlot";

export default function SpaceHogs() {
  const dispatch = useDispatch();
  const { site } = useSelector((store) => store.spacehogs);
  const [data, setData] = React.useState({});
  const [rows, setRows] = React.useState([]);
  const [plotData, setPlotData] = React.useState([]);

  React.useEffect(() => {
    post(
      JSON.stringify(site),
      "space-hogs",
      (response) => setData(response),
      (error) => console.error(error)
    );
  }, [site]);

  const handleChange = (newSite) => {
    dispatch(updateSite(newSite));
  };

  React.useEffect(() => {
    if (Object.keys(data).length > 0) {
      setRows(data.stats);

      const name = data.stats.map((item) => (item.user !== "s1b_rp" ? item.user : null));
      const stat = data.stats.map((item) => (item.user !== "s1b_rp" ? item.size : null));
      const util = data.stats.map((item) => (item.user !== "s1b_rp" ? item.util : null));
      const colors = util.map((val) => (val >= 12 ? "red" : "blue"));

      setPlotData([
        {
          x: name,
          y: stat,
          type: "bar",
          marker: { color: colors }
        }
      ]);
    }
  }, [data]);

  return (
    <React.Fragment>
      <Header
        heading="Space Hogs"
        description="See what coworkers are hogging all of the shared space."
      />
      <Grid container spacing={ 4 }>
        <Grid item xs={ 12 } sx={ { textAlign: "center" } }>
          <FormControl>
            <RadioGroup
              value={ site }
              name="site-buttons-group"
              row
            >
              <FormControlLabel
                value="Knolls"
                control={ <Radio /> }
                label="Knolls"
                onChange={ (event) => handleChange(event.target.value) }
              />
              <FormControlLabel
                value="Bettis"
                control={ <Radio /> }
                label="Bettis"
                onChange={ (event) => handleChange(event.target.value) }
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={ 12 } sm={ 6 }>
          <StatCard title="Total allocation" stat={ `${data.allocation} GB` } />
        </Grid>
        <Grid item xs={ 12 } sm={ 6 }>
          <StatCard title="Last updated" stat={ data.last_update } />
        </Grid>
        <Grid item xs={ 12 }>
          <SpaceHogsTable rows={ rows } />
        </Grid>
        <Grid item xs={ 12 }>
          <SpaceHogsPlot data={ plotData } />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
