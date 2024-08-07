import { Box } from "@mui/material";
import logoImage from "@/public/logo.png";
import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full h-[100vh] flex flex-col  bg-gray-100 justify-center items-center overflow-x-hidden ">
      <Box className="justify-center items-center mt-20">
        <Image
          src={logoImage}
          alt="SoftGen Logo"
          width={300}
          height={300}
          className=""
        />
      </Box>
      <Box component={"div"} className=" w-full md:w-1/2 flex justify-center items-center">
        <div className="w-full h-full">{children}</div>
      </Box>
    </div>
  );
}



