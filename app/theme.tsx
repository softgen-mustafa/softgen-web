"use client";

import "@fontsource/poppins";
import { Theme, createTheme } from "@mui/material";
import { inspiredPalette } from "./ui/theme";

// const appThemes: any = [
//   {
//     name: "Light",
//     code: "light",
//     theme: createTheme({
//       typography: {
//         fontFamily: "Poppins, sans-serif",
//       },
//       palette: {
//         primary: {
//           main: "#303f9f",
//           light: "#1d265c",
//           contrastText: "#ffffff",
//         },
//         secondary: {
//           main: "#FFFFFF",
//           contrastText: "#1EAFE5",
//         },
//       },
//     }),
//   },
//   {
//     name: "Dark",
//     code: "dark",
//     theme: createTheme({
//       typography: {
//         fontFamily: "Poppins, sans-serif",
//       },
//       palette: {
//         primary: {
//           main: inspiredPalette.dark,
//           contrastText: "#ffffff",
//         },
//         secondary: {
//           main: "#FFFFFF",
//           contrastText: "#1EAFE5",
//         },
//       },
//     }),
//   },
//   {
//     name: "Evening",
//     code: "evening",
//     theme: createTheme({
//       typography: {
//         fontFamily: "Poppins, sans-serif",
//       },
//       palette: {
//         primary: {
//           main: inspiredPalette.lightOrange,
//           light: "#f2815e",
//           contrastText: "#232325",
//         },
//         secondary: {
//           main: "#FFFFFF",
//           contrastText: "#1EAFE5",
//         },
//       },
//     }),
//   },
//   {
//     name: "Morning",
//     code: "morning",
//     theme: createTheme({
//       typography: {
//         fontFamily: "Poppins, sans-serif",
//       },
//       palette: {
//         primary: {
//           main: inspiredPalette.lightBlue,
//           light: "#5b9dd4",
//           contrastText: "#232325",
//         },
//         secondary: {
//           main: "#FFFFFF",
//           contrastText: "#1EAFE5",
//         },
//       },
//     }),
//   },
// ];

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
          main: "#8c57ff",
          light: "#7841ef",
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
          main: "#0d9394",
          // light: "",
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
          main: "#ffab1d",
          // light: "#f2815e",
          contrastText: "#000000de",
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
          main: "#eb3d63",
          // light: "#5b9dd4",
          contrastText: "#FFFFFF",
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
