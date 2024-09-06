"use client";
import { Logout, Dashboard } from "@mui/icons-material";
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
import { useTheme, Theme } from "@mui/material/styles";
import React, {
  Suspense,
  useMemo,
  useEffect,
  useState,
  useRef,
  cache,
} from "react";
import { inspiredPalette } from "../ui/theme";
import { useRouter } from "next/navigation";
import { GridConfig } from "../ui/responsive_grid";
import Loading from "./loading";
import Cookies from "js-cookie";
import {
  getAsync,
  getBmrmBaseUrl,
  getUmsBaseUrl,
} from "../services/rest_services";
import { SnackbarProvider } from "../ui/snack_bar_provider";
import { DrawerList } from "./drawer";
import { DropDown } from "@/app/ui/drop_down";

import { PaletteMode } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { getTheme, appThemes } from "../theme";

const drawerWidth = 300;

const DrawerContent = ({
  onThemeChange,
  onRoute,
}: {
  onThemeChange: (themeName: any) => void;
  onRoute: () => void;
}) => {
  const router = useRouter();

  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [userName, setUserName] = useState("");

  let userType = useRef("");

  useEffect(() => {
    let token = Cookies.get("authToken") ?? null;
    if (token === null || token!.length < 1) {
      router.push("/auth");
      return;
    }
    fetchUserName();
    fetchUserType();
  }, []);

  const handleLogout = () => {
    Cookies.set("authToken", "", { expires: 400 });
    router.push("/auth");
  };

  const fetchUserName = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/user-info/get/self-id`;
      let response = await getAsync(url);
      console.log(response);
      if (response) {
        try {
          let baseUrl = `${getUmsBaseUrl()}/users/get?userId=${response}`;
          let res = await getAsync(baseUrl);
          setUserName(res.name);
        } catch (error) {
          console.log("Something went wrong...");
        }
      }
    } catch {}
  };
  const fetchUserType = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/user-info/get/user-details`;
      let response = await getAsync(url);
      let userTypeResponse = response["user_type"];
      Cookies.set("userType", userTypeResponse ?? "");
      userType.current = userTypeResponse ?? "";
    } catch (e) {
    } finally {
    }
  };

  const theme = useTheme();

  return (
    <div className="flex flex-col w-full h-full overflow-x-hidden" style={{}}>
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
            width: 450,
            bgcolor: "background.paper",
            border: "0px solid #000",
            boxShadow: 24,
            borderRadius: 4,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" color="#000000">
            Confirm Logout
          </Typography>
          <Typography
            id="logout-modal-description"
            color="#232323"
            sx={{ mt: 2 }}
          >
            Are you sure you want to log out?
          </Typography>
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => setOpenLogoutModal(false)}
              sx={{ mr: 1.5, textTransform: "capitalize" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              variant="contained"
              style={{
                background: inspiredPalette.darkRed,
                textTransform: "capitalize",
              }}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Modal>

      <Box className="ml-6 mt-5 mb-1">
        <Typography color={theme.palette.primary.contrastText} fontSize={20}>
          Hello, {userName} 👋🏻
        </Typography>
      </Box>
      <DrawerList userType={userType.current} onRoute={onRoute} />

      <div className="mx-3 p-2 bg-white rounded-md">
        <DropDown
          label={"Change theme"}
          displayFieldKey={"name"}
          valueFieldKey={null}
          selectionValues={appThemes}
          helperText={""}
          onSelection={(selection) => {
            onThemeChange(selection.theme);
          }}
        />
      </div>

      <ButtonBase
        className="w-11/12 m-3 mb-3 rounded-md flex flex-row align-middle justify-center bg-white"
        onClick={() => {
          setOpenLogoutModal(true);
        }}
      >
        <ListItem>
          <ListItemIcon>
            <Logout style={{ color: inspiredPalette.darker }} />
          </ListItemIcon>
          <ListItemText color={inspiredPalette.darker} primary={"Logout"} />
        </ListItem>
      </ButtonBase>
    </div>
  );
};

const SideNav = ({
  onThemeChange,
}: {
  onThemeChange: (themeName: any) => void;
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div style={{}}>
      <div
        className={`fixed top-0 left-0 m-2 shadow-xl rounded-xl justify-center items-center`}
        style={{
          background: theme.palette.primary.main,
          zIndex: 230,
        }}
      >
        <IconButton
          aria-label="open drawer"
          onClick={handleDrawerToggle}
          size="large"
          sx={{ color: theme.palette.primary.contrastText }}
        >
          <Dashboard />
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
              background: theme.palette.primary.main,
            },
          }}
        >
          <DrawerContent
            onThemeChange={onThemeChange}
            onRoute={() => {
              setMobileOpen(false);
            }}
          />
        </Drawer>
      </Box>
    </div>
  );
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [palette, changePalette] = useState<any>(appThemes[0].theme);
  const theme = useMemo(() => {
    return getTheme(palette);
  }, [palette]);

  const changeTheme = (themeName: Theme) => {
    changePalette(themeName);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <div
          className="w-full h-[100vh] flex flex-col md:flex-row "
          style={{ background: "rgb(247, 249, 252)" }}
        >
          <SideNav onThemeChange={changeTheme} />
          <Suspense fallback={<Loading />}>
            <Box
              component={"div"}
              className="ml-1 w-full overflow-x-hidden mt-12"
            >
              <div className="w-full h-full overflow-x-hidden ">{children}</div>
            </Box>
          </Suspense>
        </div>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
