"use client";

import "@fontsource/poppins";
import { Theme, createTheme } from "@mui/material";
import { inspiredPalette } from "./ui/theme";

const appThemes: any = [
  {
    name: "Light",
    code: "light",
    theme: createTheme({
      typography: {
        fontFamily: "Poppins, sans-serif",
      },
      palette: {
        primary: {
          main: "#303f9f",
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#FFFFFF",
          contrastText: "#1EAFE5",
        },
      },
    }),
  },
  {
    name: "Dark",
    code: "dark",
    theme: createTheme({
      typography: {
        fontFamily: "Poppins, sans-serif",
      },
      palette: {
        primary: {
          main: inspiredPalette.dark,
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#FFFFFF",
          contrastText: "#1EAFE5",
        },
      },
    }),
  },
  {
    name: "Evening",
    code: "evening",
    theme: createTheme({
      typography: {
        fontFamily: "Poppins, sans-serif",
      },
      palette: {
        primary: {
          main: inspiredPalette.lightOrange,
          contrastText: "#232325",
        },
        secondary: {
          main: "#FFFFFF",
          contrastText: "#1EAFE5",
        },
      },
    }),
  },
  {
    name: "Morning",
    code: "morning",
    theme: createTheme({
      typography: {
        fontFamily: "Poppins, sans-serif",
      },
      palette: {
        primary: {
          main: inspiredPalette.lightBlue,
          contrastText: "#232325",
        },
        secondary: {
          main: "#FFFFFF",
          contrastText: "#1EAFE5",
        },
      },
    }),
  },
];

const getTheme = (type: Theme) => {
  return type;
};

export { getTheme, appThemes };
