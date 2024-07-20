"use client";
import { Box, Button, Drawer } from "@mui/material";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(false);
  return (
    <div>
        <h1>Dashboard</h1>
        <Button onClick={() => {
          setOpen(!open);
        }}>Toggle Drawer</Button>
        <Drawer open={open} onClose={() => {setOpen(false);}}>
          <Box sx={{width: 250}}></Box>
        </Drawer>
        <div>
          {children}
        </div>
    </div>
  );
}
