"use client";

import {
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getPortalUrl, postAsync } from "@/app/services/rest_services";
import Cookies from "js-cookie";

interface ILoginInfo {
  credential: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();
  const [isLoading, toggleLoading] = useState(false);

  const [loginInfo, updateLoginInfo] = useState<ILoginInfo>({
    credential: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    credential: "",
    password: "",
  });

  const [isFormValid, setFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [messageInfo, toggleMessageVisibility] = useState({
    visible: false,
    message: "",
    isError: false,
  });

  // Validation logic
  const validateForm = () => {
    const newErrors = {
      credential:
        /^\S+@\S+\.\S+$/.test(loginInfo.credential) ||
        /^[0-9]{10}$/.test(loginInfo.credential)
          ? ""
          : "Enter a valid email or 10-digit mobile number",
      password:
        loginInfo.password.length >= 6
          ? ""
          : "Password must be at least 6 characters",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  // Re-validate the form whenever loginInfo changes
  useEffect(() => {
    setFormValid(validateForm());
  }, [loginInfo]);

  const handleChange =
    (field: keyof ILoginInfo) => (e: React.ChangeEvent<HTMLInputElement>) => {
      updateLoginInfo({ ...loginInfo, [field]: e.target.value });
    };

  const login = async () => {
    if (!validateForm()) return;

    let encoded = Buffer.from(loginInfo.password).toString("base64");
    let loginDetails = { ...loginInfo, password: encoded };

    try {
      toggleLoading(true);
      let url = `${getPortalUrl()}/login`;
      let response = await postAsync(url, loginDetails);

      // Check if login was successful and response contains user_info and token
      if (response && response.user_info && response.token) {
        Cookies.set("user_info", JSON.stringify(response.user_info));
        Cookies.set("token", response.token); // Store the Token
        toggleMessageVisibility({
          visible: true,
          message: "Login successful!",
          isError: false,
        });

        // Optionally redirect to another page, such as a dashboard
        router.push("/dashboard");
      } else {
        throw new Error("Invalid response from the server");
      }
    } catch (error) {
      toggleMessageVisibility({
        visible: true,
        message: "Login failed. Please try again.",
        isError: true,
      });
    } finally {
      toggleLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto" }}>
      <TextField
        label="Email or Mobile Number"
        value={loginInfo.credential}
        onChange={handleChange("credential")}
        error={!!errors.credential}
        helperText={errors.credential}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        value={loginInfo.password}
        onChange={handleChange("password")}
        error={!!errors.password}
        helperText={errors.password}
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={togglePasswordVisibility}
                aria-label="toggle password visibility"
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        onClick={login}
        variant="contained"
        color="primary"
        fullWidth
        disabled={isLoading || !isFormValid}
        style={{ marginTop: 16 }}
      >
        {isLoading ? (
          <CircularProgress size={24} />
        ) : (
          <Typography>Login</Typography>
        )}
      </Button>

      <Snackbar
        open={messageInfo.visible}
        autoHideDuration={6000}
        onClose={() =>
          toggleMessageVisibility({ ...messageInfo, visible: false })
        }
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() =>
            toggleMessageVisibility({ ...messageInfo, visible: false })
          }
          severity={messageInfo.isError ? "error" : "success"}
          sx={{ width: "100%" }}
        >
          {messageInfo.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginPage;
