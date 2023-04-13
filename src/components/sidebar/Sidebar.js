import * as React from "react";
import { useSelector } from "react-redux";
import { app } from "utils/services";
import { MemoryRouter as Router, Routes, Route, Link } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Tooltip
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ArticleIcon from "@mui/icons-material/Article";
import "./Sidebar.module.scss";

const drawerWidth = 60;

const buttonStyle = {
  justifyContent: "center",
  height: "50px"
};

const sidebarItems = [
  {
    id: 0,
    tooltipTitle: "Space Hogs",
    route: "/",
    image: <span role="img" aria-label="hog">🐷</span>
  },
  {
    id: 1,
    tooltipTitle: "File Cleanup",
    route: "/cleanup",
    image: <span role="img" aria-label="broom">🧹</span>
  },
  {
    id: 2,
    tooltipTitle: "Archive Files",
    route: "/archive",
    image: <span role="img" aria-label="cabinet">🗄</span>
  },
  {
    id: 3,
    tooltipTitle: "Space Utilization",
    route: "/utilization",
    image: <span role="img" aria-label="calculator">🔢</span>
  },
  {
    id: 4,
    tooltipTitle: "Plots",
    route: "/plots",
    image: <span role="img" aria-label="graph">📈</span>
  },
  {
    id: 5,
    tooltipTitle: "Flamingo",
    route: "/flamingo",
    image: <span role="img" aria-label="flamingo">🦩</span>
  },
  {
    id: 6,
    tooltipTitle: "Settings",
    route: "/settings",
    image: <SettingsIcon />
  }
  // {
  //   id: 7,
  //   tooltipTitle: "Test",
  //   route: "/test",
  //   image: <span role="img" aria-label="na">T</span>
  // }
];

export default function Sidebar() {
  const { isRunning } = useSelector((store) => store.app);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <Box sx={ { display: "flex" } }>
      <Drawer
        sx={ {
          "width": drawerWidth,
          "flexShrink": 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            marginTop: "32px",
            alignItems: "center",
            backgroundColor: "#eaeaea"
          }
        } }
        variant="permanent"
        anchor="left"
      >
        <List sx={ { width: "100%" } }>
          {sidebarItems.map((item) => (
            <Tooltip key={ item.id } title={ item.tooltipTitle } placement="right" arrow>
              <Link to={ item.route } onClick={ isRunning ? (e) => e.preventDefault() : undefined }>
                <ListItem disablePadding>
                  <ListItemButton
                    disabled={ isRunning }
                    sx={ buttonStyle }
                    selected={ selectedIndex === `${item.id}` }
                    onClick={ (event) => handleListItemClick(event, `${item.id}`) }
                  >
                    {item.image}
                  </ListItemButton>
                </ListItem>
              </Link>
            </Tooltip>
          ))}
          <Tooltip title="Docs" placement="right" arrow>
            <ListItem disablePadding>
              <ListItemButton sx={ buttonStyle } onClick={ app.docs }>
                <ArticleIcon />
                {/* <span role="img" aria-label="documentation">📄</span> */}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        </List>
      </Drawer>
    </Box>
  );
}
