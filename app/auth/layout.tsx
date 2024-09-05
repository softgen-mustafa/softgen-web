import { Box } from "@mui/material";
import logoImage from "@/public/logo.png";
import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-[100vh] flex flex-col items-center overflow-x-hidden">
      <div className="w-full h-full">{children}</div>
    </div>
  );
}
