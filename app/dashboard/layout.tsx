"use client";
import {
  Home,
  Logout,
  MenuRounded,
  PendingActions,
  Receipt,
  Settings,
  Inventory,
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
  Modal,
  Button,
} from "@mui/material";
import React, { Suspense, useEffect, useState } from "react";
import { inspiredPalette } from "../ui/theme";
import { useRouter } from "next/navigation";
import { GridConfig } from "../ui/responsive_grid";
import Loading from "./loading";
import Cookies from "js-cookie";

const drawerWidth = 240;

const drawerNavigations = [
  {
    title: "Home",
    destination: "/dashboard",
    icon: <Home />,
    selected: true,
  },
  {
    title: "Outstanding",
    destination: "/dashboard/outstanding",
    icon: <PendingActions />,
    selected: false,
  },
  {
    title: "Transactions",
    destination: "/dashboard/vouchers",
    icon: <Receipt />,
    selected: false,
  },
  {
    title: "Inventory",
    destination: "/dashboard/Inventory",
    icon: <Inventory />,
    selected: false,
  },
  {
    title: "Settings",
    destination: "/dashboard/settings",
    icon: <Settings />,
    selected: false,
  },
];

const DrawerContent = () => {
  const router = useRouter();

  const [paths, setPaths] = useState(drawerNavigations);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);

  useEffect(() => {
    let token = Cookies.get("authToken") ?? null;
    if (token === null || token!.length < 1) {
      router.push("/auth");
      return;
    }
  }, []);

  const handleLogout = () => {
    Cookies.set("authToken", "", { expires: 400 });
    router.push("/auth");
  };

  return (
    <div className="flex flex-col w-full h-full overflow-x-hidden" style={{}}>
      <div
        className="flex flex-row justify-center md:justify-start items-center pt-1 pl-3 z-50"
        style={{
          background: inspiredPalette.dark,
        }}
      >
        <Typography style={{ color: "white" }}>Log-out</Typography>
        <IconButton
          size="medium"
          style={{ color: "white" }}
          onClick={() => setOpenLogoutModal(true)}
        >
          <Logout fontSize="inherit" />
        </IconButton>
      </div>
      <Modal
        open={openLogoutModal}
        onClose={() => setOpenLogoutModal(false)}
        aria-labelledby="logout-modal-title"
        aria-describedby="logout-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            borderRadius: 4,
            p: 4,
          }}
        >
          <Typography id="logout-modal-title" variant="h6" component="h2">
            Confirm Logout
          </Typography>
          <Typography id="logout-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to log out?
          </Typography>
          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={() => setOpenLogoutModal(false)} sx={{ mr: 1 }}>
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              variant="contained"
              style={{ background: inspiredPalette.darkRed }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Modal>

      <List className="justify-center">
        {paths.map((path, index) => (
          <ButtonBase
            key={index}
            className="w-11/12 m-2 flex flex-row justify-center"
            style={{
              marginTop: 5,
            }}
            onClick={() => {
              let values = paths.map((entry: any) => {
                let selected = path.title == entry.title;
                return {
                  ...entry,
                  selected: selected,
                };
              });
              setPaths(values);
              router.push(path.destination);
            }}
          >
            <ListItem
              style={{
                borderWidth: path.selected ? 1 : 0,
                borderRadius: 8,
                borderColor: path.selected ? "white" : inspiredPalette.dark,
              }}
            >
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
    <div className="w-full h-[100vh] flex flex-col md:flex-row bg-gray-100">
      <SideNav />
      <Suspense fallback={<Loading />}>
        <Box component={"div"} className="ml-1 w-full overflow-x-hidden">
          <div className="w-full h-full overflow-x-hidden ">{children}</div>
        </Box>
      </Suspense>
    </div>
  );
}
