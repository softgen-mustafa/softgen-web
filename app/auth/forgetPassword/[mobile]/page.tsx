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
          width: { xs: 380, sm: 400, md: 500 },
          height: { xs: 550, sm: 550, md: 650 },
          maxWidth: "100%",
          maxHeight: 650,
        }}
      >
        <Box
          sx={{
            width: { xs: 200, sm: 250, md: 300 },
            // height: { xs: 200, sm: 250, md: 300 },
          }}
        >
          <Image src={logoImage} alt="SoftGen Logo" className="" />
        </Box>
        <Stack
          alignItems={"center"}
          sx={{
            width: "100%",
            maxWidth: 400,
          }}
        >
          <Stack alignItems={"center"} gap={0.2} mb={3}>
            <Typography variant="h5" color={inspiredPalette.darker}>
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
          <Box className="w-full px-5 flex flex-col gap-2.5">
            <TextInput
              mode="password"
              placeHolder="Enter New Password"
              onTextChange={handlePasswordChange}
            />
            {error.current.length > 0 && (
              <p className="text-red-500">{error.current.join(", ")}</p>
            )}
            <div className="mt-3">
              <Button
                variant="contained"
                sx={{
                  width: "100%",
                  height: 40,
                  background: theme.palette.primary.main,
                  boxShadow: "none",
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
