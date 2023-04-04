import * as React from "react";
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

export default function Sidebar() {
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
          <Link to="/">
            <Tooltip title="Space Hogs" placement="right" arrow>
              <ListItem disablePadding>
                <ListItemButton
                  sx={ buttonStyle }
                  selected={ selectedIndex === 0 }
                  onClick={ (event) => handleListItemClick(event, 0) }
                >
                  <span role="img" aria-label="hog">
                    🐷
                  </span>
                </ListItemButton>
              </ListItem>
            </Tooltip>
          </Link>
          <Link to="/cleanup">
            <Tooltip title="File Cleanup" placement="right" arrow>
              <ListItem disablePadding>
                <ListItemButton
                  sx={ buttonStyle }
                  selected={ selectedIndex === 1 }
                  onClick={ (event) => handleListItemClick(event, 1) }
                >
                  <span role="img" aria-label="broom">
                    🧹
                  </span>
                </ListItemButton>
              </ListItem>
            </Tooltip>
          </Link>
          <Link to="/archive">
            <Tooltip title="Archive Files" placement="right" arrow>
              <ListItem disablePadding>
                <ListItemButton
                  sx={ buttonStyle }
                  selected={ selectedIndex === 2 }
                  onClick={ (event) => handleListItemClick(event, 2) }
                >
                  <span role="img" aria-label="cabinet">
                    🗄
                  </span>
                </ListItemButton>
              </ListItem>
            </Tooltip>
          </Link>
          <Link to="/utilization">
            <Tooltip title="Space Utilization" placement="right" arrow>
              <ListItem disablePadding>
                <ListItemButton
                  sx={ buttonStyle }
                  selected={ selectedIndex === 3 }
                  onClick={ (event) => handleListItemClick(event, 3) }
                >
                  <span role="img" aria-label="calculator">
                    🔢
                  </span>
                </ListItemButton>
              </ListItem>
            </Tooltip>
          </Link>
          <Link to="/plots">
            <Tooltip title="Plots" placement="right" arrow>
              <ListItem disablePadding>
                <ListItemButton
                  sx={ buttonStyle }
                  selected={ selectedIndex === 4 }
                  onClick={ (event) => handleListItemClick(event, 4) }
                >
                  <span role="img" aria-label="graph">
                    📈
                  </span>
                </ListItemButton>
              </ListItem>
            </Tooltip>
          </Link>
          <Link to="/flamingo">
            <Tooltip title="Flamingo" placement="right" arrow>
              <ListItem disablePadding>
                <ListItemButton
                  sx={ buttonStyle }
                  selected={ selectedIndex === 5 }
                  onClick={ (event) => handleListItemClick(event, 5) }
                >
                  <span role="img" aria-label="flamingo">
                    🦩
                  </span>
                </ListItemButton>
              </ListItem>
            </Tooltip>
          </Link>
          <Link to="/settings">
            <Tooltip title="Settings" placement="right" arrow>
              <ListItemButton
                sx={ buttonStyle }
                selected={ selectedIndex === 6 }
                onClick={ (event) => handleListItemClick(event, 6) }
              >
                <SettingsIcon />
              </ListItemButton>
            </Tooltip>
          </Link>
          <Link to="/test">
            <Tooltip title="Test" placement="right" arrow>
              <ListItem disablePadding>
                <ListItemButton
                  sx={ buttonStyle }
                  selected={ selectedIndex === 7 }
                  onClick={ (event) => handleListItemClick(event, 7) }
                >
                  <span role="img" aria-label="na">
                    T
                  </span>
                </ListItemButton>
              </ListItem>
            </Tooltip>
          </Link>
          <Tooltip title="Docs" placement="right" arrow>
            <ListItem disablePadding>
              <ListItemButton
                sx={ buttonStyle }
                onClick={ app.docs }
              >
                <ArticleIcon />
                {/* <span role="img" aria-label="documentation">
                  📄
                </span> */}
              </ListItemButton>
            </ListItem>
          </Tooltip>
        </List>
      </Drawer>
    </Box>
  );
}
