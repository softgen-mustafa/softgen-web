"use client";
import { TextInput } from "@/app/ui/text_inputs";
import { Button, Grid, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getAsync, getUmsBaseUrl } from "../services/rest_services";
import { CardView, GridConfig, RenderGrid } from "../ui/responsive_grid";
import { inspiredPalette } from "../ui/theme";
import Cookies from "js-cookie";

const Page = () => {
  const mobileNumber = useRef("");
  const error = useRef("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
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
    }
  };

  const gridConfig: GridConfig[] = [
    {
      type: "item",
      view: (
        <CardView className="flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold mb-4">Login To BizOpp</h1>
          <TextInput
            mode="number"
            placeHolder="Enter Mobile Number"
            onTextChange={handleMobileNumberChange}
          />
          {error.current && (
            <p className="text-red-500 mt-2">{error.current}</p>
          )}
          <div className="mt-4">
            <Button
              variant="contained"
              style={{
                background: inspiredPalette.dark,
              }}
              onClick={onNext}
            >
              Send OTP
            </Button>
          </div>
        </CardView>
      ),
      className: "",
      children: [],
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <Grid
        container
        sx={{
          flexGrow: 1,
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {RenderGrid(gridConfig)}
      </Grid>
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
