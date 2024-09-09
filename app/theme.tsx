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
          light: "#1d265c",
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
          light: "#f2815e",
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
          light: "#5b9dd4",
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
