import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/Inbox';
import Link from 'next/link';
import { ListItemIcon, ListItemText } from '@mui/material';

const drawerWidth = 240;

export default function BurgerMenu() {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar/>
      <Divider/>
      <List>
        <ListItem disablePadding>
          <Link href='/strategies' className="w-full">
            <ListItemButton>
              <ListItemText primary={'Strategies'}/>
            </ListItemButton>
          </Link>
        </ListItem>

        <ListItem disablePadding>
          <Link href='https://rld-1.gitbook.io/rld/' className="w-full">
            <ListItemButton>
              <ListItemText primary={'Docs'}/>
            </ListItemButton>
          </Link>
        </ListItem>
      </List>
    </div>

  );

  const container = globalThis.window !== undefined ? () => globalThis.window.document.body : undefined;

  return (
    <div className="md:hidden ml-3">
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
      >
        <MenuIcon/>
      </IconButton>
      <Drawer
        container={container}
        anchor={'right'}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: {xs: 'block'},
          '& .MuiDrawer-paper': {boxSizing: 'border-box', width: drawerWidth},
        }}
      >
        {drawer}
      </Drawer>
    </div>
  );
}