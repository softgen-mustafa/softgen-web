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
      <div className="">
        <Button onClick={() => {
          setOpen(!open);
        }}>Toggle Drawer</Button>
        <h1>Dashboard</h1>
      </div>
        <Drawer open={open} onClose={() => {setOpen(false);}}>
          <Box sx={{width: 250}}></Box>
        </Drawer>
        <div>
          {children}
        </div>
    </div>
  );
}
