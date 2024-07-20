"use client";
import { TextInput } from "@/app/ui/text_inputs";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { getAsync, getUmsBaseUrl } from "../services/rest_services";

const Page = () => {
  let mobileNumber = useRef("");
  const router = useRouter();

  return (
    <div>
      <p>Login Page</p>
      <TextInput
        mode="number"
        placeHolder="Enter Mobile Number"
        onTextChange={(value: string) => {
          mobileNumber.current = value;
        }}
      />
      <br/>
      <br/>
      <Button variant="contained" onClick={() => {
        localStorage.setItem("mobileNumber", JSON.stringify(mobileNumber.current))

         let url = `${getUmsBaseUrl()}/auth/check-registration?MobileNumber=${mobileNumber.current}`;
         getAsync(url).then((response) => {
          if (response["does_exist"]) {
            router.push(`/auth/login/${mobileNumber.current}`);
          }
         });
      }}>Send OTP</Button>
    </div>
  );
};

export default Page;
