import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@mui/material";
import theme from "./ui/mui_theme";
import "../src/index.css";

export const metadata: Metadata = {
  title: "Softgen",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`w-full bg-gray-100 ${inter.className} overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
