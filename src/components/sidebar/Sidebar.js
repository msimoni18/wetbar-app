import React from 'react';
import { MemoryRouter as Router, Routes, Route, Link } from 'react-router-dom';

import { Box, Drawer, List, ListItem, ListItemButton } from '@mui/material';

const iconStyle = {
  fontSize: '24px',
  padding: '20px 0 20px 0',
  width: '100%',
  textAlign: 'center',
};

const drawerWidth = 60;

export default function Sidebar() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            marginTop: '32px',
            alignItems: 'center',
            backgroundColor: '#eaeaea',
          },
        }}
        variant='permanent'
        anchor='left'
      >
        <List sx={{ width: '100%' }}>
          <Link to='/'>
            <ListItem disablePadding>
              <ListItemButton>
                <span role='img' aria-label='na' className={iconStyle}>
                  T
                </span>
              </ListItemButton>
            </ListItem>
          </Link>
          <Link to='/space-hogs'>
            <ListItem disablePadding>
              <ListItemButton>
                <span role='img' aria-label='hog' className={iconStyle}>
                  🐷
                </span>
              </ListItemButton>
            </ListItem>
          </Link>
          <Link to='/cleanup'>
            <ListItem disablePadding>
              <ListItemButton>
                <span role='img' aria-label='broom' className={iconStyle}>
                  🧹
                </span>
              </ListItemButton>
            </ListItem>
          </Link>
          <Link to='/archive'>
            <ListItem disablePadding>
              <ListItemButton>
                <span role='img' aria-label='cabinet' className={iconStyle}>
                  🗄
                </span>
              </ListItemButton>
            </ListItem>
          </Link>
          <Link to='/utilization'>
            <ListItem disablePadding>
              <ListItemButton>
                <span role='img' aria-label='calculator' className={iconStyle}>
                  🔢
                </span>
              </ListItemButton>
            </ListItem>
          </Link>
          <Link to='/plots'>
            <ListItem disablePadding>
              <ListItemButton>
                <span role='img' aria-label='graph' className={iconStyle}>
                  📈
                </span>
              </ListItemButton>
            </ListItem>
          </Link>
          <Link to='/flamingo'>
            <ListItem disablePadding>
              <ListItemButton>
                <span role='img' aria-label='flamingo' className={iconStyle}>
                  🦩
                </span>
              </ListItemButton>
            </ListItem>
          </Link>
        </List>
      </Drawer>
    </Box>
  );
}
