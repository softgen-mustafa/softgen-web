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
      main: "#1EAFE5",
      contrastText: "#ffffff",
    },
  },
});

export default theme;
