"use client";

import "@fontsource/poppins";
import { createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
  palette: {
    primary: {
      main: "#19478A",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#FFFFFF",
      contrastText: "#1EAFE5",
    },
  },
});

export default theme;
