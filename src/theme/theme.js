import { createTheme } from "@mui/material";

const theme = createTheme({
  // palette: {
  //   primary: {
  //     main: "#262626"
  //   }
  // },
  components: {
    MuiListItemButton: {
      root: {
        "&.Mui-selected:": {
          backgroundColor: "#a3a3a3"
        }
      }
    }
  }
});

export default theme;
