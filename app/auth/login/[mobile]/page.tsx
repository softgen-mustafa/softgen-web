"use client";
import { getUmsBaseUrl, postAsync } from "@/app/services/rest_services";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { TextInput } from "@/app/ui/text_inputs";
import { inspiredPalette } from "@/app/ui/theme";
import { Button, Grid, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";

const Page = ({ params }: { params: any }) => {
  const router = useRouter();
  const mobile = params.mobile;
  const error = useRef<string[]>([]);
  let userDetail = useRef({
    otp: "",
    password: "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [hasReloaded, setHasReloaded] = useState(false);

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

  const showSnackbar = (message: string) => {
    setSnackbar({ open: true, message });
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const gridConfig: GridConfig[] = [
    {
      type: "item",
      view: (
        <CardView className="flex flex-col justify-center items-center">
          <h1 className="justify-center center self-center text-2xl font-bold mb-5">
            Login to Your Account{" "}
          </h1>
          <p className="font-medium text-1xl">{`You'll get an OTP on your this mobile number: ${mobile}`}</p>
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
              style={{
                background: inspiredPalette.dark,
              }}
              variant="contained"
              onClick={() => {
                onSubmit();
              }}
            >
              Login
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
    }
  };

  const login = async () => {
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
      Cookies.set("authToken", tokenInfo["value"], { expires: 14 });
      return true;
    } catch {
      return false;
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
    <div>
      <Grid
        container
        sx={{
          flexGrow: 1,
          // height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {RenderGrid(gridConfig)}
      </Grid>
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
