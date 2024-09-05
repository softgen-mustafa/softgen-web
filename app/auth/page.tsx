"use client";
import { TextInput } from "@/app/ui/text_inputs";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Snackbar,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getAsync, getUmsBaseUrl } from "../services/rest_services";
import { CardView, GridConfig, RenderGrid } from "../ui/responsive_grid";
import { inspiredPalette } from "../ui/theme";
import Cookies from "js-cookie";
import Image from "next/image";
import logoImage from "@/public/logo.png";

const Page = () => {
  const mobileNumber = useRef("");
  const error = useRef("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("authToken") ?? null;
    if (token !== null && token.length > 0) {
      router.push("/dashboard");
    }
  }, [router]);

  const validateMobileNumber = (number: string): boolean => {
    return /^\d{10}$/.test(number);
  };

  const handleMobileNumberChange = (value: string) => {
    mobileNumber.current = value;
    error.current = "";
  };

  const onNext = async () => {
    if (!validateMobileNumber(mobileNumber.current)) {
      error.current = "Please enter a valid 10-digit mobile number.";
      setSnackbarOpen(true);
      return;
    }
    setLoading(true);
    try {
      const url = `${getUmsBaseUrl()}/auth/check-registration?MobileNumber=${
        mobileNumber.current
      }`;
      const response = await getAsync(url);

      localStorage.setItem("mobileNumber", mobileNumber.current);

      if (response["does_exist"]) {
        router.push(`/auth/login/${mobileNumber.current}`);
      } else {
        error.current = "Mobile number not registered. Please sign up.";
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error("Error checking registration:", err);
      error.current = "An error occurred. Please try again.";
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // const gridConfig: GridConfig[] = [
  //   {
  //     type: "item",
  //     view: (
  //       <CardView className="flex flex-col justify-center items-center">
  //         <Typography className="text-2xl font-bold mb-1 color ">
  //           {" "}
  //           Welcome To BizOpp
  //         </Typography>
  //         <Typography className="text-base mb-8 justify-center">
  //           Your Decision Making Buddy
  //         </Typography>
  //         <TextInput
  //           mode="number"
  //           placeHolder="Enter Mobile Number"
  //           onTextChange={handleMobileNumberChange}
  //         />
  //         {error.current && (
  //           <p className="text-red-500 mt-2">{error.current}</p>
  //         )}
  //         <div className="mt-4">
  //           <Button
  //             variant="contained"
  //             sx={{
  //               width: 150,
  //               height: 45,
  //               background: theme.palette.primary.main,
  //             }}
  //             onClick={onNext}
  //           >
  //             {loading ? (
  //               <CircularProgress size={16} sx={{ color: "#FFFFFF" }} />
  //             ) : (
  //               <Typography textTransform="capitalize">Send OTP</Typography>
  //             )}
  //           </Button>
  //         </div>
  //       </CardView>
  //     ),
  //     className: "",
  //     children: [],
  //   },
  // ];

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <Box
        className="shadow-lg"
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        bgcolor={"#FFFFFF"}
        borderRadius={3}
        sx={{
          p: { xs: 2, sm: 3, md: 5 },
          width: { xs: 350, sm: 400, md: 500 }, // Adjust width for different screen sizes
          height: { xs: 500, sm: 550, md: 650 }, // Adjust height for different screen sizes
          maxWidth: "100%", // Ensures it doesn't exceed the screen width
          maxHeight: 650,
        }}
      >
        <Box
          sx={{
            width: { xs: 200, sm: 250, md: 300 },
            height: { xs: 200, sm: 250, md: 300 },
          }}
        >
          <Image src={logoImage} alt="SoftGen Logo" className="" />
        </Box>
        <Stack
          alignItems={"center"}
          sx={{
            width: "100%", // Responsive width adjustments
            maxWidth: 400, // Maximum width to ensure it doesn't get too wide
          }}
        >
          <Stack alignItems={"center"} gap={0.2} mb={3}>
            <Typography variant="h5" color={inspiredPalette.darker}>
              Welcome To BizOpp
            </Typography>
            <Typography variant="body2" color={inspiredPalette.darkTextGrey}>
              Your Decision Making Buddy
            </Typography>
          </Stack>
          <Box className="w-full px-5">
            <TextInput
              mode="number"
              placeHolder="Enter Mobile Number"
              onTextChange={handleMobileNumberChange}
            />
            {error.current && (
              <p className="text-red-500 mt-1">{error.current}</p>
            )}
            <div className="mt-4">
              <Button
                variant="contained"
                sx={{
                  width: "100%",
                  height: 45,
                  background: theme.palette.primary.main,
                }}
                onClick={onNext}
              >
                {loading ? (
                  <CircularProgress size={16} sx={{ color: "#FFFFFF" }} />
                ) : (
                  <Typography textTransform="capitalize">Send OTP</Typography>
                )}
              </Button>
            </div>
          </Box>
        </Stack>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={error.current}
      />
    </div>
  );
};

export default Page;
