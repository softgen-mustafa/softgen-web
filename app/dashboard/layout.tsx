"use client";
import {
  Home,
  Logout,
  MenuRounded,
  PendingActions,
} from "@mui/icons-material";
import {
  Box,
  ButtonBase,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { inspiredPalette } from "../ui/theme";
import { useRouter } from "next/navigation";
import { GridConfig } from "../ui/responsive_grid";

const drawerWidth = 240;

const drawerNavigations = [
  {
    title: "Home",
    destination: "/dashboard",
    icon: <Home />,
  },
  {
    title: "Outstanding",
    destination: "/dashboard/outstanding",
    icon: <PendingActions />,
  },
];

const DrawerContent = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full h-full overflow-x-hidden" style={{}}>
      <div className="flex flex-row justify-center md:justify-start items-center pt-1 pl-3 z-50" style={{
        background: inspiredPalette.dark,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
      }}>
        <Typography style={{color: 'white'}}>Log-out</Typography>
        <IconButton size="medium" style={{color:'white'
          
        }}>
          <Logout fontSize="inherit"/>
        </IconButton>
      </div>
      <List>
        {drawerNavigations.map((path, index) => (
          <ButtonBase
            key={index}
            style={{ marginTop: 5 }}
            onClick={() => {
              router.push(path.destination);
            }}
          >
            <ListItem>
              <ListItemIcon style={{ color: "white" }}>
                {path.icon}
              </ListItemIcon>
              <ListItemText style={{ color: "white" }} primary={path.title} />
            </ListItem>
          </ButtonBase>
        ))}
      </List>
    </div>
  );
};

const SideNav: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div
      style={{
        background: inspiredPalette.dark,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
      }}
    >
      <div
        className="fixed top-0 left-0 m-2 shadow-md rounded-lg justify-center items-center lg:hidden"
        style={{
          background: inspiredPalette.dark,
        }}
      >
        <IconButton
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          size="large"
          sx={{ color: "white" }}
        >
          <MenuRounded />
        </IconButton>
      </div>
      <Box sx={{ display: { md: "none", xs: "block", sm: "block" } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              background: inspiredPalette.dark,
            },
          }}
        >
          <DrawerContent />
        </Drawer>
      </Box>
      <Box
        sx={{
          display: {
            md: "block",
            xs: "none",
            sm: "none",
            minWidth: drawerWidth,
            maxWidth: drawerWidth,
          },
        }}
      >
        <DrawerContent />
      </Box>
    </div>
  );
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-[100vh] flex flex-col md:flex-row bg-grey-200">
      <SideNav />
      <Box component={"div"} className="ml-1 w-full overflow-x-hidden" >
        <div className="w-full h-full overflow-x-hidden bg-gray-100">{children}</div>
      </Box>
    </div>
  );
}
