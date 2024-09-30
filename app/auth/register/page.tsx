"use client";

import { getPortalUrl, postAsync } from "@/app/services/rest_services";
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

interface IRegisterInfo {
  email: string;
  name: string;
  mobile_number: string;
  password: string;
  type: string;
}

const Page = () => {
  const router = useRouter();
  const [isLoading, toggleLoading] = useState(false);

  const [userInfo, updateUserInfo] = useState<IRegisterInfo>({
    name: "",
    mobile_number: "",
    email: "",
    password: "",
    type: "client",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobile_number: "",
    password: "",
  });

  const [isFormValid, setFormValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [messageInfo, toggleMessageVisibility] = useState({
    visible: false,
    message: "",
    isError: false,
  });

  // Validation logic wrapped in a separate function
  const validateForm = () => {
    const newErrors = {
      name: userInfo.name ? "" : "Name is required",
      email: /^\S+@\S+\.\S+$/.test(userInfo.email) ? "" : "Enter a valid email",
      mobile_number: /^[0-9]{10}$/.test(userInfo.mobile_number) // Assuming 10 digits for phone number
        ? ""
        : "Enter a valid 10-digit mobile number",
      password:
        userInfo.password.length >= 6
          ? ""
          : "Password must be at least 6 characters",
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  // Re-validate the form whenever userInfo changes
  useEffect(() => {
    setFormValid(validateForm());
  }, [userInfo]);

  const handleChange =
    (field: keyof IRegisterInfo) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateUserInfo({ ...userInfo, [field]: e.target.value });
    };

  const register = async () => {
    // Only validate when trying to register
    if (!validateForm()) return;

    let encoded = Buffer.from(userInfo.password).toString("base64");
    let userDetail = userInfo;
    userDetail.password = encoded;
    try {
      toggleLoading(true);
      let url = `${getPortalUrl()}/register`;
      let response = await postAsync(url, userDetail);

      toggleMessageVisibility({
        visible: true,
        message: "Registration successful!",
        isError: false,
      });

      // Redirect to login page or elsewhere
      router.push("/login");
    } catch (error) {
      toggleMessageVisibility({
        visible: true,
        message: "Registration failed. Please try again.",
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
        label="Name"
        value={userInfo.name}
        onChange={handleChange("name")}
        error={!!errors.name}
        helperText={errors.name}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Email Address"
        value={userInfo.email}
        onChange={handleChange("email")}
        error={!!errors.email}
        helperText={errors.email}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Mobile Number"
        value={userInfo.mobile_number}
        onChange={handleChange("mobile_number")}
        error={!!errors.mobile_number}
        helperText={errors.mobile_number}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type={showPassword ? "text" : "password"}
        value={userInfo.password}
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
        onClick={register}
        variant="contained"
        color="primary"
        fullWidth
        disabled={isLoading || !isFormValid} // Use pre-validated state
        style={{ marginTop: 16 }}
      >
        {isLoading ? (
          <CircularProgress size={24} />
        ) : (
          <Typography>Register</Typography>
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

export default Page;
