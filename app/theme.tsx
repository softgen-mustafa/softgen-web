"use client";

import "@fontsource/poppins";
import { Theme, colors, createTheme } from "@mui/material";
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

const getColorKey = (hex: string) => {
  switch (hex) {
    case "#eb3d63":
      return "red";
  }
};
const themeWheelByHex = {
  red: ["red"],
};

const appThemes: any = [
  // {
  //   name: "Red",
  //   code: "red",
  //   colors: [
  //     // "#a2273e", // Darker Shade 3
  //     // "#f4879f", // Lighter Tint 2
  //     // "#7a7a7a", // Neutral Gray
  //     // "#63eb3d", // Triadic Color 2
  //     // "#d13354", // Darker Shade 1
  //     // // "#f4879f", // Lighter Tint 2
  //     // "#eb3d4d", // Analogous Color 3
  //     // "#3db4eb", // Split Complementary 2
  //     // "#eb1d53", // Monochromatic 2
  //     // // "#a2273e", // Darker Shade 3
  //     // "#f06281", // Lighter Tint 1
  //     // "#eb3d63", // Primary Color
  //     // "#3deb85", // Split Complementary 1
  //     // "#eb3d8f", // Analogous Color 1
  //     // "#3debcb", // Complementary Color
  //     // "#f8acbd", // Lighter Tint 3
  //     // "#b92d49", // Darker Shade 2
  //     // "#fcd1db", // Lighter Tint 4
  //     // "#eb3daf", // Analogous Color 2
  //     // "#8b2234", // Darker Shade 4
  //     // "#63eb3d", // Triadic Color 1
  //     // "#eb4d73", // Monochromatic 1
  //     "#d10070", // Bright Fuchsia (Primary)
  //     "#871f1e", // Very Dark Red
  //     "#91253a", // Burgundy
  //     "#eb5e00", // Bright Orange
  //     "#ebb700", // Bright Golden Yellow (Primary)
  //     "#f2a400", // Vibrant Yellow-Orange
  //     "#4d2c91", // Indigo
  //     "#ffeb3b", // Bright Yellow
  //     "#f2c94c", // Light Golden Yellow
  //     "#5b0606", // Blackish Red
  //   ],
  //   theme: createTheme({
  //     typography: {
  //       fontFamily: "Poppins, sans-serif",
  //     },
  //     palette: {
  //       primary: {
  //         main: "#eb3d63",
  //         // light: "#5b9dd4",
  //         contrastText: "#FFFFFF",
  //       },
  //       secondary: {
  //         main: "#FFFFFF",
  //         contrastText: "#1EAFE5",
  //       },
  //     },
  //   }),
  // },
  {
    name: "Light Blue",
    code: "light-blue",
    colors: [
      "#ffab91", // Complementary Color 1 (Soft Coral)
      "#4fc3f7", // Lighter Tint 3 (Bright Light Blue)
      "#80deea", // Triadic Color 2 (Bright Cyan)
      "#b3e5fc", // Lighter Tint 1 (Soft Light Blue)
      "#ff7043", // Complementary Color 3 (Warm Orange)
      "#4dd0e1", // Analogous Color 1 (Cyan Tint)
      "#ffca28", // Triadic Color 1 (Vibrant Yellow)
      "#81d4fa", // Lighter Tint 2 (Sky Blue)
      "#ff5252", // Complementary Color 2 (Bright Coral Red)
      "#29b6cc", // Analogous Color 2 (Sky Blue)
      "#b0bec5", // Neutral Gray
      "#0288d1", // Darker Shade 1 (Deeper Blue)
      "#e6f7ff", // Lighter Tint 8 (Pale Blue)
      "#ffeb3b", // Triadic Color 3 (Bright Yellow)
      "#e1f5fe", // Lighter Tint 5 (Pale Blue)
      "#1e88e5", // Split Complementary 2 (Intense Blue)
      "#01579b", // Darker Shade 3 (Deep Navy Blue)
      "#84ffff", // Split Complementary 1 (Light Aqua)
      "#4fc4ff", // Lighter Tint 7 (Soft Light Blue)
      "#03a9f4", // Primary Color (Vivid Blue)
      "#0277bd", // Darker Shade 2 (Bold Blue)
      "#0286cc", // Monochromatic 1 (Deep Blue)
      "#e0f7fa", // Lighter Tint 6 (Pale Aqua)
      "#29b6f6", // Lighter Tint 4 (Moderate Blue)
    ],
    theme: createTheme({
      typography: {
        fontFamily: "Poppins, sans-serif",
      },
      palette: {
        primary: {
          main: "#03a9f4", // Main light blue color
          contrastText: "#ffffff",
        },
        secondary: {
          main: "#FFFFFF",
          contrastText: "#1EAFE5",
        },
      },
    }),
  },
  // {
  //   name: "Purple",
  //   code: "purple",
  //   colors: [
  //     "#ff57a8", // Complementary Color
  //     "#c1a3ff", // Lighter Tint 3
  //     "#b457ff", // Analogous Color 3
  //     "#6d3fdb", // Darker Shade 1
  //     "#57ff8c", // Split Complementary 1
  //     "#d754ff", // Monochromatic 1
  //     "#57aaff", // Split Complementary 2
  //     "#8c57ff", // Primary Color
  //     "#b4b4b4", // Neutral Gray
  //     "#c248ff", // Monochromatic 2
  //     "#a957ff", // Analogous Color 2
  //     "#3b1e80", // Darker Shade 4
  //     "#ff57d4", // Triadic Color 2
  //     "#a577ff", // Lighter Tint 1
  //     "#9c57ff", // Analogous Color 1
  //     "#5a34b3", // Darker Shade 2
  //     "#b48aff", // Lighter Tint 2
  //     "#7d57ff", // Triadic Color 1
  //     "#d0bfff", // Lighter Tint 4
  //     "#4a2b9c", // Darker Shade 3
  //   ],
  //   theme: createTheme({
  //     typography: {
  //       fontFamily: "Poppins, sans-serif",
  //     },
  //     palette: {
  //       primary: {
  //         main: "#8c57ff",
  //         // light: "#7841ef",
  //         contrastText: "#ffffff",
  //       },
  //       secondary: {
  //         main: "#FFFFFF",
  //         contrastText: "#1EAFE5",
  //       },
  //     },
  //   }),
  // },
  {
    name: "Green",
    code: "green",
    colors: [
      "#0d9b80", // Triadic Color 1
      "#0d7a8c", // Analogous Color 2
      "#6b8cff", // Split Complementary 2
      "#7ed0d0", // Lighter Tint 3
      "#0a7474", // Darker Shade 1
      "#9e9e9e", // Neutral Gray
      "#4ec0c0", // Lighter Tint 2
      "#1d8c8b", // Monochromatic 1
      "#6bff6b", // Split Complementary 1
      "#0d9394", // Primary Color
      "#0d7a78", // Monochromatic 2
      "#ff6f6f", // Complementary Color
      "#0d8a95", // Analogous Color 3
      "#032b2b", // Darker Shade 4
      "#1eb0b0", // Lighter Tint 1
      "#80d09b", // Triadic Color 2
      "#7b8e8e", // Darker Shade 2
      "#0d6e8b", // Analogous Color 1
      "#aee0e0", // Lighter Tint 4
      "#085c5c", // Darker Shade 3
    ],
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
    name: "Light Coral",
    code: "light-coral",
    colors: [
      "#ff9999", // Lighter Tint 2 (Soft Coral)
      "#00ced1", // Split Complementary 2 (Turquoise)
      "#ffcccb", // Lighter Tint 1 (Coral)
      "#c71585", // Triadic Color 2 (Deep Violet Pink)
      "#ff7f7f", // Lighter Tint 3 (Coral Pink)
      "#32cd32", // Complementary Color (Lime Green)
      "#ff6666", // Lighter Tint 4 (Coral Red)
      "#ff4500", // Darker Shade 1 (Orange-Red)
      "#ffd700", // Triadic Color 1 (Bright Gold)
      "#1e90ff", // Split Complementary 1 (Dodger Blue)
      "#ffd1dc", // Lighter Tint 6 (Light Pink Coral)
      "#ff69b4", // Analogous Color 2 (Hot Pink)
      "#ffe5e5", // Lighter Tint 5 (Pale Coral)
      "#ff8c00", // Analogous Color 1 (Orange)
      "#ffb347", // Monochromatic 1 (Peach)
    ],
    theme: createTheme({
      typography: {
        fontFamily: "Poppins, sans-serif",
      },
      palette: {
        primary: {
          main: "#ff6666", // Main coral color
          contrastText: "#000000", // Black contrast
        },
        secondary: {
          main: "#FFFFFF",
          contrastText: "#1EAFE5",
        },
      },
    }),
  },

  {
    name: "Yellow",
    code: "yellow",
    colors: [
      "#995c00", // Darker Shade 4
      "#e68a00", // Darker Shade 1
      "#ffce80", // Lighter Tint 2
      "#1d6bff", // Complementary Color
      "#cc7a00", // Darker Shade 2
      "#ff761d", // Analogous Color 2
      "#ff9d1d", // Monochromatic 1
      "#b0b0b0", // Neutral Gray
      "#ffddaa", // Lighter Tint 3
      "#ff7e1d", // Analogous Color 3
      "#ffab1d", // Primary Color
      // "#995c00", // Darker Shade 4
      "#ffbf57", // Triadic Color 1
      "#1d9eff", // Split Complementary 2
      "#ffbf4d", // Lighter Tint 1
      "#1dff57", // Split Complementary 1
      // "#e68a00", // Darker Shade 1
      "#ff851d", // Monochromatic 2
      "#ff6f1d", // Analogous Color 1
      "#b36d00", // Darker Shade 3
      "#ffeecc", // Lighter Tint 4
      "#57ffbf", // Triadic Color 2
    ],
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
];

const getTheme = (type: Theme) => {
  return type;
};

export { getTheme, appThemes, themeWheelByHex, getColorKey };
