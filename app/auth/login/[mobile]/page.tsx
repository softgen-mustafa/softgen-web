"use client";
import {
  getAsync,
  getUmsBaseUrl,
  postAsync,
} from "@/app/services/rest_services";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { TextInput } from "@/app/ui/text_inputs";
import { inspiredPalette } from "@/app/ui/theme";
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
import Cookies from "js-cookie";
import Image from "next/image";
import logoImage from "@/public/logo.png";

const Page = ({ params }: { params: any }) => {
  const router = useRouter();
  const mobile = params.mobile;
  const error = useRef<string[]>([]);
  const otpError = useRef("");

  let userDetail = useRef({
    otp: "",
    password: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [hasReloaded, setHasReloaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    let token = Cookies.get("authToken") ?? null;
    if (token !== null && token!.length > 0) {
      router.push("/dashboard");
      return;
    }

    if (!hasReloaded) {
      sendOtp();
      setHasReloaded(true);
    }
  }, [hasReloaded, router]);

  const isPasswordInvalid = (text: string): [boolean, string] => {
    error.current = [];

    if (text.length < 8 || text.length > 15) {
      error.current.push("Password must be between 8 and 15 characters.");
    } else if (!/[a-z]/.test(text)) {
      error.current.push(
        "Password must contain at least one lowercase letter.",
      );
    } else if (!/[A-Z]/.test(text)) {
      error.current.push(
        "Password must contain at least one uppercase letter.",
      );
    } else if (!/[\d#$%&*@!_]/.test(text)) {
      error.current.push(
        "Password must contain at least one of the allowed symbols (# $ % & * @ ! _) or a number.",
      );
    }

    return [error.current.length > 0, error.current.join("\n")];
  };

  const isOtpInvalid = (text: string) => {
    let otpRegex = /^\d{5}$/;
    otpError.current = "";

    if (otpRegex.test(text)) {
      otpError.current = "";
    } else {
      otpError.current = "Invalid Otp";
    }
  };

  const handlePasswordChange = (value = "") => {
    userDetail.current.password = value;
    const [isInvalid, validationMessages] = isPasswordInvalid(value);
    if (isInvalid) {
      error.current = validationMessages.split("\n");
    }
  };

  const showSnackbar = (message: string) => {
    setSnackbar({ open: true, message });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleForgetPassword = async () => {
    const isOtpValid = await verifyOtp();
    if (!isOtpValid) {
      showSnackbar("Invalid OTP");

      return;
    }

    router.push(`/auth/forgetPassword/${mobile}`);
  };

  const gridConfig: GridConfig[] = [
    {
      type: "item",
      view: (
        <CardView className="flex flex-col justify-center items-center">
          <Typography className="justify-center center self-center text-2xl font-bold mb-5">
            Login to Your Account{" "}
          </Typography>
          <Typography className="font-medium text-1xl">{`You'll get an OTP on your this mobile number: ${mobile}`}</Typography>
          <br />
          <TextInput
            mode="number"
            placeHolder="Enter OTP"
            onTextChange={(value: string) => {
              userDetail.current.otp = value;
            }}
          />
          <br />
          <TextInput
            mode="password"
            placeHolder="Enter Password"
            onTextChange={handlePasswordChange}
          />
          {error.current.length > 0 && (
            <p className="text-red-500 mt-2">{error.current.join(", ")}</p>
          )}

          <br />
          <br />
          <div className="flex flex-row justify-end">
            <Button
              sx={{
                background: theme.palette.primary.main,
                height: 45,
                width: 100,
              }}
              variant="contained"
              onClick={() => {
                onSubmit();
              }}
            >
              {loading ? (
                <CircularProgress size={16} sx={{ color: "#FFFFFF" }} />
              ) : (
                <Typography textTransform={"capitalize"} letterSpacing={0.8}>
                  Login
                </Typography>
              )}
            </Button>
          </div>
        </CardView>
      ),
      className: "",
      children: [],
    },
  ];

  const sendOtp = async () => {
    try {
      let url = `${getUmsBaseUrl()}/auth/otp/send`;
      let body = {
        mobile_number: mobile,
      };
      await postAsync(url, body);
    } catch {
      showSnackbar("Could not send OTP");
    }
  };
  const verifyOtp = async () => {
    setLoading(true);
    try {
      let url = `${getUmsBaseUrl()}/auth/otp/verify`;
      let body = {
        mobile_number: mobile,
        otp: userDetail.current.otp,
      };
      let response = await postAsync(url, body);
      console.log(`verify OTP: ${JSON.stringify(response)}`);
      return response["is_success"];
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    setLoading(true);
    try {
      let url = `${getUmsBaseUrl()}/auth/login`;
      let encoded = Buffer.from(userDetail.current.password).toString("base64");
      let body = {
        mobile_number: mobile,
        password: encoded,
      };
      let response = await postAsync(url, body);
      if (!response["is_success"]) {
        showSnackbar(response["message"] || "Login Failed");
        return false;
      }
      let tokenInfo = response["token"];
      console.log(response, "183");
      Cookies.set("authToken", tokenInfo["value"], { expires: 14 });
      try {
        let getCompanies = `${getUmsBaseUrl()}/info/user-tenant/get/companies`;
        let response = await getAsync(getCompanies);
        // console.log("220", response);
        Cookies.set("companyId", response[0]?.company_id);
        Cookies.set("user_id", response[0]?.user_id);
      } catch (error) {}
      return true;
    } catch {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async () => {
    const isOtpValid = await verifyOtp();
    if (!isOtpValid) {
      showSnackbar("Invalid OTP");

      return;
    }

    const isLoggedIn = await login();
    if (!isLoggedIn) {
      showSnackbar("Invalid Credentials");
      return;
    }

    // Prevent back navigation to login page
    window.history.replaceState(null, "", "/dashboard");
    router.push("/dashboard");
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
          width: { xs: 380, sm: 400, md: 500 }, // Adjust width for different screen sizes
          height: { xs: 550, sm: 550, md: 650 }, // Adjust height for different screen sizes
          maxWidth: "100%", // Ensures it doesn't exceed the screen width
          maxHeight: 650,
        }}
        // overflow="hidden"
      >
        <Box
          sx={{
            width: { xs: 200, sm: 250, md: 280 },
            // height: { xs: 200, sm: 250, md: 300 },
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
              Login to Your Account
            </Typography>
            <Typography
              variant="body2"
              textAlign={"center"}
              color={inspiredPalette.darkTextGrey}
            >
              {`You'll get an OTP on your this mobile number: ${mobile}`}
            </Typography>
          </Stack>
          <Box
            className="w-full px-5 flex flex-col gap-2.5"
            sx={{ flexGrow: 1 }}
          >
            <TextInput
              mode="number"
              placeHolder="Enter OTP"
              onTextChange={(value: string) => {
                userDetail.current.otp = value;
              }}
            />
            <TextInput
              mode="password"
              placeHolder="Enter Password"
              onTextChange={handlePasswordChange}
            />
            {error.current.length > 0 && (
              <Typography variant="body2" color="error">
                {error.current.join(", ")}
              </Typography>
            )}
            <Button
              onClick={() => handleForgetPassword()}
              variant="text"
              sx={{ fontSize: 14, textTransform: "capitalize" }}
            >
              Forget Password
            </Button>
            <div className="mt-1">
              <Button
                variant="contained"
                sx={{
                  width: "100%",
                  height: 40,
                  background: theme.palette.primary.main,
                  boxShadow: "none",
                }}
                onClick={() => onSubmit()}
              >
                {loading ? (
                  <CircularProgress size={16} sx={{ color: "#FFFFFF" }} />
                ) : (
                  <Typography textTransform="capitalize">Login</Typography>
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
