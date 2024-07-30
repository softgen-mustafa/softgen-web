import { Box, Typography } from "@mui/material";
import logoImage from "@/public/logo.png";
import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-[100vh] flex flex-col md:flex-row bg-gray-100 justify-center">
      <Box className="w-1/2 flex flex-col justify-center items-center">
        <Image
          src={logoImage}
          alt="SoftGen Logo"
          width={300}
          height={300}
          className=""
        />
      </Box>
      <Box component={"div"} className="ml-1 w-1/2 overflow-x-hidden">
        <div className="w-full h-full overflow-x-hidden ">{children}</div>
      </Box>
    </div>
  );
}
