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
  Stack,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import logoImage from "@/public/logo.png";
import { inspiredPalette } from "@/app/ui/theme";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CallIcon from "@mui/icons-material/Call";

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
    <div className=" min-h-screen  flex justify-center items-center bg-gray-100 p-[8.5px] pl-4 pr-4 pb-5 md:p-0 overflow-y-auto bg-[url('/assets/images/loginbackgroundimage.jpeg')] bg-center h-screen bg-no-repeat  bg-cover md:bg-[length:100vw_130vh]">
      <div className="max-w-lg md:w-10/12 mx-auto scroll-m-0 justify-center items-center drop-shadow-lg pb-6 pr-6 pl-6 bg-gradient-to-t from-white to-[#C5F6FC] rounded-xl hover:-translate-y-1 duration-200 hover:rounded-3xl hover:drop-shadow-2xl">
        <div className="justify-center flex -mt-8">
          <Image
            src={logoImage}
            alt="SoftGen Logo"
            width={240}
            height={240}
            className="justify-center"
          />
        </div>
        <Stack alignItems={"center"} gap={0.2}>
          <Typography
            sx={{ fontSize: "2rem", fontWeight: 405 }}
            color={inspiredPalette.darker}
          >
            Registration Form
          </Typography>
        </Stack>
        <TextField
          label="Name"
          value={userInfo.name}
          onChange={handleChange("name")}
          error={!!errors.name}
          helperText={errors.name}
          fullWidth
          margin="normal"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "18px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon aria-label="email or mobile icon" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Email Address"
          value={userInfo.email}
          onChange={handleChange("email")}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
          margin="normal"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "18px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon aria-label="email or mobile icon" />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Mobile Number"
          value={userInfo.mobile_number}
          onChange={handleChange("mobile_number")}
          error={!!errors.mobile_number}
          helperText={errors.mobile_number}
          fullWidth
          margin="normal"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "18px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CallIcon aria-label="email or mobile icon" />
              </InputAdornment>
            ),
          }}
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
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon aria-label="email or mobile icon" />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "18px", // Customize the border radius
            },
          }}
        />
        <div className="justify-center flex">
          <Button
            onClick={register}
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading || !isFormValid} // Use pre-validated state
            sx={{
              mt: 2,
              mb: 2,
              padding: {
                xs: "8px 12px",
                sm: "10px 16px",
              },
              width: { xs: "90%", md: "100%" },
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
            }}
          >
            {isLoading ? (
              <CircularProgress size={24} />
            ) : (
              <Typography>Register</Typography>
            )}
          </Button>
        </div>
      </div>

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
