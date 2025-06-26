import React, { type JSX, type SetStateAction } from "react";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

const drawerWidth = 240;

interface Props {
  tabs: { title: string; icon: JSX.Element }[];
  activeTabIndex: number;
  setActiveTabIndex: React.Dispatch<SetStateAction<number>>;
  children: React.ReactNode | React.ReactNode[];
}

const CustomDrawer: React.FC<Props> = ({
  tabs,
  activeTabIndex,
  setActiveTabIndex,
  children,
}) => {
  const handleTabClick = (tabIndex: number) => {
    setActiveTabIndex(tabIndex);
  };

  return (
    <Box>
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Permanent drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {tabs.map((t, idx) => (
            <ListItem
              key={idx}
              disablePadding
              onClick={() => handleTabClick(idx)}
            >
              <ListItemButton selected={activeTabIndex === idx}>
                <ListItemIcon>{t.icon}</ListItemIcon>
                <ListItemText primary={t.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
      >
        <Toolbar />
        <Box className="tab-content-wrapper">{children}</Box>
      </Box>
    </Box>
  );
};

export default CustomDrawer;
export type { Props as CustomDrawerProps };
