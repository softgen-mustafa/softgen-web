"use client";

import { TextInput } from "@/app/ui/text_inputs";
import { inspiredPalette } from "@/app/ui/theme";
import {
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import React, { useRef, useState } from "react";
import logoImage from "@/public/logo.png";
import { getUmsBaseUrl, postAsync } from "@/app/services/rest_services";
import { useRouter } from "next/navigation";

const Page = ({ params }: { params: any }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const error = useRef<string[]>([]);
  const router = useRouter();

  const showSnackbar = (message: string) => {
    setSnackbar({ open: true, message });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const mobile = params.mobile;

  let userDetail = useRef({
    mobile_number: mobile,
    password: "",
  });

  const isPasswordInvalid = (text: string): [boolean, string] => {
    error.current = [];

    if (text.length < 8 || text.length > 15) {
      error.current.push("Password must be between 8 and 15 characters.");
    } else if (!/[a-z]/.test(text)) {
      error.current.push(
        "Password must contain at least one lowercase letter."
      );
    } else if (!/[A-Z]/.test(text)) {
      error.current.push(
        "Password must contain at least one uppercase letter."
      );
    } else if (!/[\d#$%&*@!_]/.test(text)) {
      error.current.push(
        "Password must contain at least one of the allowed symbols (# $ % & * @ ! _) or a number."
      );
    }

    return [error.current.length > 0, error.current.join("\n")];
  };

  const handlePasswordChange = (value = "") => {
    userDetail.current.password = value;
    const [isInvalid, validationMessages] = isPasswordInvalid(value);
    if (isInvalid) {
      error.current = validationMessages.split("\n");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let url = `${getUmsBaseUrl()}/auth/reset-password`;
      let encoded = Buffer.from(userDetail.current.password).toString("base64");
      let requestBody = {
        mobile_number: mobile,
        password: encoded,
      };
      let response = await postAsync(url, requestBody);
      console.log(response);
      if (response.is_success) {
        showSnackbar(response["message"]);

        window.history.replaceState(null, "", `/auth/login/${mobile}`);
        router.push(`/auth/login/${mobile}`);
      } else {
        showSnackbar(response["message"] || "Something went wrong");
        return false;
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" min-h-screen  flex justify-center items-center bg-gray-100 p-[8.5px] pl-4 pr-4 pb-5 md:p-0 overflow-y-auto bg-[url('/assets/images/loginbackgroundimage.jpeg')] bg-center h-screen bg-no-repeat  bg-cover md:bg-[length:100vw_130vh]">
      <Box
        className="shadow-lg"
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        bgcolor={"#FFFFFF"}
        borderRadius={3}
        sx={{
          maxWidth: "32rem", // max-w-lg in Tailwind
          width: {
            md: "83.333333%", // w-10/12 in Tailwind
          },
          mx: "auto", // mx-auto (centers horizontally)
          scrollMargin: 0, // scroll-m-0
          display: "flex", // flex layout
          justifyContent: "center", // justify-center in Tailwind
          alignItems: "center", // items-center in Tailwind
          boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)", // drop-shadow-lg in Tailwind
          paddingBottom: "1.5rem", // pb-6 in Tailwind
          paddingRight: "1.5rem", // pr-6 in Tailwind
          paddingLeft: "1.5rem", // pl-6 in Tailwind
          backgroundImage: "linear-gradient(to top, #ffffff, #C5F6FC)", // bg-gradient-to-t from-white to-[#C5F6FC]
          borderRadius: "1rem", // rounded-xl in Tailwind
          transition: "transform 0.2s, border-radius 0.2s, box-shadow 0.2s", // duration-200 for hover effects
          "&:hover": {
            transform: "translateY(-0.25rem)", // hover:-translate-y-1 in Tailwind
            borderRadius: "1.5rem", // hover:rounded-3xl in Tailwind
            boxShadow: "0 15px 25px rgba(0, 0, 0, 0.2)", // hover:drop-shadow-2xl in Tailwind
          },
        }}
      >
        <Box
          sx={{
            justifyContent: "center", // justify-center in Tailwind
            display: "flex", // flex layout
            marginTop: "-2rem", // -mt-8 in Tailwind (negative margin-top)
          }}
        >
          <Image
            src={logoImage}
            alt="SoftGen Logo"
            width={240}
            height={240}
            className="justify-center"
          />
        </Box>
        <Stack
          alignItems={"center"}
          sx={{
            width: "100%",
            maxWidth: 400,
          }}
        >
          <Stack alignItems={"center"} gap={0.2} mb={3}>
            <Typography
              variant="h5"
              color={inspiredPalette.darker}
              sx={{ fontSize: "1.7rem", fontWeight: 400 }}
            >
              Reset Password
            </Typography>
            <Typography
              variant="body2"
              textAlign={"center"}
              color={inspiredPalette.darkTextGrey}
            >
              Enter new password
            </Typography>
          </Stack>
          <Box className="pl-5 pr-5 md:pl-10 md:pr-10">
            <TextInput
              mode="password"
              placeHolder="Enter New Password"
              onTextChange={handlePasswordChange}
            />

            {error.current.length > 0 && (
              <p className="text-red-500">{error.current.join(", ")}</p>
            )}
            <div className="justify-center flex">
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  mb: 2,
                  padding: {
                    xs: "8px 12px",
                    sm: "10px 16px",
                  },
                  width: { xs: "50%", md: "80%" },
                  borderRadius: "12px",
                  backgroundImage:
                    "linear-gradient(90deg, #42A5F5 0%, #1E88E5 100%)", // Gradient background
                  color: "white",
                  fontWeight: "1rem",
                  fontSize: "1rem",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                    backgroundImage:
                      "linear-gradient(90deg, #2196F3 0%, #1565C0 100%)", // Darker gradient on hover
                    transform: "translateY(-2px)",
                  },
                  textTransform: "capitalize",
                  marginTop: 4,
                }}
                onClick={() => handleSubmit()}
              >
                {loading ? (
                  <CircularProgress size={16} sx={{ color: "#FFFFFF" }} />
                ) : (
                  <Typography textTransform="capitalize">Submit</Typography>
                )}
              </Button>
            </div>
          </Box>
        </Stack>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={closeSnackbar}
        message={snackbar.message}
      />
    </div>
  );
};

export default Page;
