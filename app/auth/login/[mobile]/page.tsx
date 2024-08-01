"use client";
import { getUmsBaseUrl, postAsync } from "@/app/services/rest_services";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { TextInput } from "@/app/ui/text_inputs";
import { inspiredPalette } from "@/app/ui/theme";
import { Button, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";

const Page = ({ params }: { params: any }) => {
  const router = useRouter();
  const mobile = params.mobile;
  let userDetail = useRef({
    otp: "",
    password: "",
  });

  const [hasReloaded, setHasReloaded] = useState(false);

  useEffect(() => {
    let token = Cookies.get("authToken") ?? null;
    if (token !== null && token!.length  >0) {
      router.push("/dashboard");
      return;
    }

    if (!hasReloaded) {
      sendOtp();
      setHasReloaded(true);
    }
  }, [hasReloaded, router]);

  const gridConfig: GridConfig[] = [
    {
      type: "item",
      view: (
        <div className="flex flex-col justify-center items-center">
          Image here
        </div>
      ),
      className: "",
      children: [],
    },
    {
      type: "item",
      view: (
        <CardView className="flex flex-col justify-center items-center">
          <p>Login Page</p>
          <p>{`You'll get an OTP on your this mobile number: ${mobile}`}</p>
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
            onTextChange={(value: string) => {
              userDetail.current.password = value;
            }}
          />
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
      alert("Could not send OTP");
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
        alert(response["message"] || "Login Failed");
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
      alert("Invalid OTP");
      return;
    }

    const isLoggedIn = await login();
    if (!isLoggedIn) {
      alert("Invalid Credentials");
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
          height: "100vh",
        }}
      >
        {RenderGrid(gridConfig)}
      </Grid>
    </div>
  );
};

export default Page;
