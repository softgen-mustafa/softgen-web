"use client";
import { Logout } from "@mui/icons-material";
import { DropDown } from "../ui/drop_down";
import {
  convertToDate,
  getUserInfo,
  numericToString,
} from "../services/Local/helper";
import {
  Box,
  ButtonBase,
  Drawer,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Modal,
  Button,
  Stack,
} from "@mui/material";
import { useTheme, Theme } from "@mui/material/styles";
import React, { Suspense, useMemo, useEffect, useState, useRef } from "react";
import { inspiredPalette } from "../ui/theme";
import { useRouter } from "next/navigation";
import Loading from "./loading";
import Cookies from "js-cookie";
import {
  getAsync,
  getBmrmBaseUrl,
  getPortalUrl,
  getSgBizBaseUrl,
  getUmsBaseUrl,
} from "../services/rest_services";
import { SnackbarProvider } from "../ui/snack_bar_provider";
import { DrawerList } from "./drawer";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { getTheme, appThemes } from "../theme";
import CheckIcon from "@mui/icons-material/Check";
import MenuIcon from "@mui/icons-material/Menu";

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
    let token = Cookies.get("token") ?? null;
    if (token === null || token!.length < 1) {
      router.push("/auth/login");
      return;
    }

    // Fetch the userName and userid  from cookies
    const userInfo = getUserInfo();
    if (userInfo === null) {
      router.push("/auth/login");
      return;
    }
    setUserName(userInfo.name);
  }, []);

  const handleLogout = () => {
    Cookies.set("token", "", { expires: 400 });
    router.push("/auth/login");
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
                color: "#FFFFFF",
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

      <Stack
        className="ml-4"
        flexDirection={"row"}
        alignItems={"center"}
        gap={2}
        mb={1}
      >
        {appThemes.map((_theme: any) => {
          return (
            <Box
              className="flex items-center justify-center"
              key={_theme.code}
              bgcolor={_theme.theme.palette.primary.main}
              width={35}
              height={35}
              borderRadius={"50%"}
              onClick={() => {
                onThemeChange(_theme.theme);
                Cookies.set("theme", _theme.code);
                Cookies.set("themeColor", _theme.theme.palette.primary.main);
              }}
              sx={{
                cursor: "pointer",
                borderWidth: _theme.theme.palette === theme.palette ? 2 : 0,
                borderColor:
                  _theme.theme.palette === theme.palette
                    ? theme.palette.primary.contrastText
                    : "",
              }}
            >
              {_theme.theme.palette === theme.palette && (
                <CheckIcon
                  fontSize="small"
                  sx={{ color: theme.palette.primary.contrastText }}
                />
              )}
            </Box>
          );
        })}
      </Stack>

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
    <Box style={{}}>
      {/* <Box
            className={`fixed top-0 left-0 m-2 mb-2 shadow-md bg-[#2e263d14] rounded-xl justify-center items-center`}
            style={{
                zIndex: 230,
            }}
            >
            <IconButton
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            size="large"
            >
            <Dashboard />
            </IconButton>
            </Box> */}
      {/* <Box
            className="flex items-center justify-center fixed m-2"
            onClick={handleDrawerToggle}
            sx={{
                bgcolor: "rgb(203 213 225)",
            }}
            >
            <MenuIcon sx={{ color: "#000000" }} />
            </Box> */}
      <Box
        width={50}
        height={50}
        borderRadius={2}
        border={2}
        borderColor="#000000"
        className="flex items-center shadow-lg justify-center fixed ml-3 mt-2"
        onClick={handleDrawerToggle}
      >
        <MenuIcon sx={{ color: "#000000" }} />
      </Box>
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
    </Box>
  );
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let currentTheme =
    appThemes.find((th: any) => th.code == Cookies.get("theme")) ??
    appThemes[0];

  const [palette, changePalette] = useState<any>(currentTheme.theme);
  const [key, renderKey] = useState(0);

  const [companyData, setCompanyData] = useState([]);
  const [cachedCompanyIndex, setCompanyId] = useState(0);
  const [syncInfo, setSyncInfo] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const theme = useMemo(() => {
    return getTheme(palette);
  }, [palette]);

  const changeTheme = (themeName: Theme) => {
    changePalette(themeName);
  };

  const cmpId = Cookies.get("companyId");

  useEffect(() => {
    loadLastSync(cmpId);
  }, [cmpId]);

  const loadLastSync = async (companyId: any) => {
    try {
      let url = `${getSgBizBaseUrl()}/sync-info/get`;
      url += `?companyId=${companyId}`;
      let response = await getAsync(url);
      const syncInfo = convertToDate(response.Data.SyncDateTime);
      setSyncInfo(syncInfo);
      return syncInfo;
    } catch (error) {}
  };

  const loadData = async () => {
    try {
      const userInfo = getUserInfo();
      if (userInfo === null) {
        return;
      }
      let url = `${getPortalUrl()}/companies?id=${userInfo.id}`;
      console.log("Company url", url);
      let response = await getAsync(url);

      let values = response.map((entry: any) => {
        return {
          id: entry["CompanyGuid"],
          name: entry["CompanyName"],
          // user_id: entry.user_id,
        };
      });
      setCompanyData(values);
      if (values && values.length > 0) {
        let existingCompany = Cookies.get("companyId");
        let exisitngIndex = values.findIndex(
          (entry: any) => entry.id === existingCompany
        );
        setCompanyId(0);
        let guid = values[0].id;
        if (exisitngIndex !== -1) {
          guid = values[exisitngIndex].id;
          setCompanyId(exisitngIndex);
        }
        Cookies.set("companyId", guid);
      }
    } catch (error) {
      console.error("Failed to load companies", error);
    } finally {
    }
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
          <div className="flex flex-col w-full">
            <div
              className="bg-gray-100 min-h-[70px] flex flex-row justify-end items-center py-4 pr-3"
              style={{
                borderBottomWidth: 2,
                borderBottomColor: theme.palette.primary.main,
              }}
            >
              <DropDown
                label={"Select Company"}
                displayFieldKey={"name"}
                valueFieldKey={null}
                selectionValues={companyData}
                helperText={""}
                defaultSelectionIndex={cachedCompanyIndex}
                useFullWidth={false}
                onSelection={(selection) => {
                  const companyId = selection.id;
                  let exisitngIndex = companyData.findIndex(
                    (entry: any) => entry.id === companyId
                  );
                  if (exisitngIndex != -1) {
                    setCompanyId(exisitngIndex);
                    Cookies.set("companyId", companyId);
                    let newKey = (key + 1) % 2;
                    renderKey(newKey);
                    loadLastSync(companyId).catch(() => {});
                  }
                }}
              />
            </div>
            <Typography className="text-base justify-center text-slate-950 mx-3 pt-1">
              {`Last Sync: ${syncInfo}`}
            </Typography>
            <Suspense fallback={<Loading />}>
              <Box
                key={key}
                component={"div"}
                className="ml-1 w-full overflow-x-hidden mt-2"
              >
                <div className="w-full h-full overflow-x-hidden ">
                  {children}
                </div>
              </Box>
            </Suspense>
          </div>
        </div>
      </SnackbarProvider>
    </ThemeProvider>
  );
}
