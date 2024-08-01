"use client";
import { TextInput } from "@/app/ui/text_inputs";
import { Button, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { getAsync, getUmsBaseUrl } from "../services/rest_services";
import { CardView, GridConfig, RenderGrid } from "../ui/responsive_grid";
import { inspiredPalette } from "../ui/theme";
import Cookies from "js-cookie";

const Page = () => {
  let mobileNumber = useRef("");
  const router = useRouter();


  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token !== null && token!.length  >0) 
      {
      router.push("/dashboard");
      return;
    }

  }, [ router]);

  const gridConfig: GridConfig[] = [
    {
      type: "item",
      view: (
        <CardView className="flex flex-col justify-center items-center">
          <p>Login To BizOpp</p>
          <br />
          <TextInput
            mode="number"
            placeHolder="Enter Mobile Number"
            onTextChange={(value: string) => {
              mobileNumber.current = value;
            }}
          />
          <br />
          <br />
          <div className="flex flex-row justify-end">
            <Button
              variant="contained"
              style={{
                background: inspiredPalette.dark,
              }}
              onClick={() => {
                localStorage.setItem(
                  "mobileNumber",
                  JSON.stringify(mobileNumber.current),
                );

                let url = `${getUmsBaseUrl()}/auth/check-registration?MobileNumber=${
                  mobileNumber.current
                }`;
                getAsync(url).then((response) => {
                  if (response["does_exist"]) {
                    router.push(`/auth/login/${mobileNumber.current}`);
                  }
                });
              }}
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
