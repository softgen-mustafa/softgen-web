"use client";

import { Box, Typography, Button, IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";
import { TextInput } from "@/app/ui/text_inputs";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import {
  getAsync,
  getSgBizBaseUrl,
  postAsync,
  putAsync,
} from "@/app/services/rest_services";
import { useSnackbar } from "@/app/ui/snack_bar_provider";
import { useRouter } from "next/navigation";
import React from "react";
import theme from "@/app/ui/mui_theme";

interface EmailSettings {
  SmtpServer: string;
  SmtpPort: string;
  To: string[];
  Cc: string[];
  Bcc: string[];
  Subject: string;
  Body: string;
  BodyType: number;
  Signature: string;
}

interface OsSettings {
  ID: string;
  CompanyId: string;
  CutOffDate: string;
  DueDays: number;
  OverDueDays: number;
  SendAllDue: boolean;
  SendDueOnly: boolean;
  AutoReminderInterval: number;
  ReminderIntervalDays: number;
  EmailSetting: EmailSettings;
}

const OsSettingsView = ({ onClose }: { onClose: () => void }) => {
  const initialSettings: OsSettings = {
    ID: "",
    CompanyId: Cookies.get("companyId") || "",
    CutOffDate: "",
    DueDays: 0,
    OverDueDays: 0,
    SendAllDue: false,
    SendDueOnly: false,
    AutoReminderInterval: 0,
    ReminderIntervalDays: 10,
    EmailSetting: {
      SmtpServer: "",
      SmtpPort: "",
      To: [],
      Cc: [],
      Bcc: [],
      Subject: "",
      Body: "",
      BodyType: 0,
      Signature: "",
    },
  };

  const [settings, setSettings] = useState<OsSettings>(initialSettings);
  const [showEmailConfig, toggleEmailConfig] = useState(false);
  const isSettingsLoaded = useRef(false);
  const router = useRouter();

  const snackbar = useSnackbar();

  useEffect(() => {
    const loadData = async () => {
      try {
        let url = `${getSgBizBaseUrl()}/os-setting/get`;
        let response = await getAsync(url);
        if (response.Data && response.Data.length > 0) {
          setSettings(response.Data[0]);
          isSettingsLoaded.current = true;
        } else {
          isSettingsLoaded.current = false;
        }
      } catch (error) {
        console.error("Error loading data:", error);
        isSettingsLoaded.current = false;
      }
    };
    loadData();
  }, []);

  const handleCreate = async () => {
    try {
      let url = `${getSgBizBaseUrl()}/os-setting/create`;
      console.log("Create URL hit:", url);

      let requestBody = { ...settings };
      console.log("Create request body:", requestBody);

      let response = await postAsync(url, requestBody);
      console.log("Create response:", response);

      //   onClose();
    } catch (error) {
      console.error("Error creating data:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      let url = `${getSgBizBaseUrl()}/os-setting/update`;

      let requestBody = { ...settings };

      let response = await postAsync(url, requestBody);
      snackbar.showSnackbar("Settings Updated", "success");
    } catch (error) {
      snackbar.showSnackbar("Could not Update Settings", "error");
    }
  };

  return (
    <Box className="fixed  inset-0 flex items-center justify-center  bg-gray-900 bg-opacity-50  overflow-y-scroll">
      <div className="bg-white p-7 rounded-2xl shadow-md w-11/12  max-w-lg max-h-screen overflow-y-scroll">
        <div className="flex flex-row justify-between items-center mb-4 ml-4">
          <Typography className="text-black text-xl mr-5">
            Configure Settings
          </Typography>
          <IconButton size={"large"} onClick={onClose}>
            <Close />
          </IconButton>
        </div>
        {isSettingsLoaded.current ? (
          <>
            <TextInput
              mode="text"
              placeHolder="Cut Off Date"
              onTextChange={(value) => {
                setSettings((prev) => ({ ...prev, CutOffDate: value }));
              }}
              defaultValue={settings.CutOffDate}
            />
            <div className="mt-5 sm:mt-4" />
            <TextInput
              mode="number"
              placeHolder="Over-Due Days"
              onTextChange={(value) => {
                setSettings((prev) => ({
                  ...prev,
                  OverDueDays: parseInt(value ?? "0"),
                }));
              }}
              defaultValue={settings.OverDueDays.toString()}
            />
            <div className="mt-5 sm:mt-4" />
            <TextInput
              mode="number"
              placeHolder="Reminder Interval Days"
              onTextChange={(value) => {
                setSettings((prev) => ({
                  ...prev,
                  ReminderIntervalDays: parseInt(value ?? "0"),
                }));
              }}
              defaultValue={settings.ReminderIntervalDays.toString()}
            />

            <div className="mt-5 sm:mt-4" />
            <Button
              variant={"contained"}
              onClick={() => {
                toggleEmailConfig(!showEmailConfig);
              }}
              sx={{
                color: "white",
                fontSize: { xs: "0.730rem", md: "0.9rem" },
                fontWeight: "normal",
                paddingX: 2, // Equivalent to px-4
                paddingY: 1, // Equivalent to py-2
                borderRadius: 3, // Equivalent to rounded-md
                boxShadow: 4, // Equivalent to shadow
                "&:hover": {
                  boxShadow: 10, // Equivalent to hover:shadow-lg
                },
                "&:focus": {
                  outline: "none",
                  ring: 2,
                  // Equivalent to focus:ring-2 focus:ring-gray-400
                },
                transition: "box-shadow 0.2s", // Smooth transition for the box shadow
                textTransform: "capitalize",
                width: "100%", // Full width
                display: "flex", // Use flexbox for alignment
                justifyContent: "center", // Center align items
                alignItems: "center", // Center align items vertically
              }}
            >
              {showEmailConfig ? "Hide" : "Show"} Email Config
            </Button>

            {showEmailConfig && (
              <Box>
                <div className="mt-5 sm:mt-4" />
                <TextInput
                  mode="text"
                  placeHolder="Mail Server"
                  onTextChange={(value) => {
                    setSettings((prev) => ({
                      ...prev,
                      EmailSetting: { ...prev.EmailSetting, SmtpServer: value },
                    }));
                  }}
                  defaultValue={settings.EmailSetting.SmtpServer}
                />
                <div className="mt-5 sm:mt-4" />
                <TextInput
                  mode="text"
                  placeHolder="Mail Port"
                  onTextChange={(value) => {
                    setSettings((prev) => ({
                      ...prev,
                      EmailSetting: { ...prev.EmailSetting, SmtpPort: value },
                    }));
                  }}
                  defaultValue={settings.EmailSetting.SmtpPort}
                />
                <div className="mt-5 sm:mt-4" />
                <TextInput
                  mode="text"
                  placeHolder="To Email(s)"
                  onTextChange={(value) => {
                    setSettings((prev) => ({
                      ...prev,
                      EmailSetting: {
                        ...prev.EmailSetting,
                        To: value.split(","),
                      },
                    }));
                  }}
                  defaultValue={settings.EmailSetting.To.join(",")}
                />
                <div className="mt-5 sm:mt-4" />
                <TextInput
                  mode="text"
                  placeHolder="Cc Email(s)"
                  onTextChange={(value) => {
                    setSettings((prev) => ({
                      ...prev,
                      EmailSetting: {
                        ...prev.EmailSetting,
                        Cc: value.split(","),
                      },
                    }));
                  }}
                  defaultValue={settings.EmailSetting.Cc.join(",")}
                />
                <div className="mt-5 sm:mt-4" />
                <TextInput
                  mode="text"
                  placeHolder="Bcc Email(s)"
                  onTextChange={(value) => {
                    setSettings((prev) => ({
                      ...prev,
                      EmailSetting: {
                        ...prev.EmailSetting,
                        Bcc: value.split(","),
                      },
                    }));
                  }}
                  defaultValue={settings.EmailSetting.Bcc.join(",")}
                />
                <div className="mt-5 sm:mt-4" />
                <TextInput
                  mode="text"
                  placeHolder="Subject"
                  onTextChange={(value) => {
                    setSettings((prev) => ({
                      ...prev,
                      EmailSetting: { ...prev.EmailSetting, Subject: value },
                    }));
                  }}
                  defaultValue={settings.EmailSetting.Subject}
                />
                <div className="mt-5 sm:mt-4" />
                <TextInput
                  mode="text"
                  multiline={true}
                  placeHolder="Body"
                  onTextChange={(value) => {
                    setSettings((prev) => ({
                      ...prev,
                      EmailSetting: { ...prev.EmailSetting, Body: value },
                    }));
                  }}
                  defaultValue={settings.EmailSetting.Body}
                />
              </Box>
            )}

            <div className="mt-2 " />
            <div className="mt-1 flex flex-row sm:flex-row justify-between gap-1">
              <Button
                variant={"contained"}
                onClick={handleUpdate}
                sx={{
                  color: "white",
                  fontSize: { xs: "0.687rem", md: "0.9rem" }, // Reduced font size for mobile
                  fontWeight: "normal",
                  paddingX: { xs: 1, md: 2 }, // Smaller padding for mobile
                  paddingY: { xs: 0.8, md: 0.9 }, // Smaller padding for mobile
                  borderRadius: { xs: 2.5, md: 3 }, // Equivalent to rounded-md
                  boxShadow: 4, // Equivalent to shadow
                  "&:hover": {
                    boxShadow: 10, // Equivalent to hover:shadow-lg
                  },
                  "&:focus": {
                    outline: "none",
                    ring: 2,
                    // Equivalent to focus:ring-2 focus:ring-gray-400
                  },
                  transition: "box-shadow 0.2s", // Smooth transition for the box shadow
                  textTransform: "capitalize",
                  width: "100%", // Full width
                  display: "flex", // Use flexbox for alignment
                  justifyContent: "center", // Center align items
                  alignItems: "center",
                }}
              >
                Update
              </Button>

              <Button
                variant={"contained"}
                sx={{
                  color: "white",
                  fontSize: { xs: "0.662rem", md: "0.9rem" }, // Reduced font size for mobile
                  fontWeight: "normal",
                  paddingX: { xs: 1, md: 2 }, // Smaller padding for mobile
                  paddingY: { xs: 0.8, md: 0.9 }, // Smaller padding for mobile
                  borderRadius: { xs: 2.5, md: 3 }, // Equivalent to rounded-md
                  boxShadow: 4, // Equivalent to shadow
                  "&:hover": {
                    boxShadow: 10, // Equivalent to hover:shadow-lg
                  },
                  "&:focus": {
                    outline: "none",
                    ring: 2,
                    // Equivalent to focus:ring-2 focus:ring-gray-400
                  },
                  transition: "box-shadow 0.2s", // Smooth transition for the box shadow
                  textTransform: "capitalize",
                  width: "100%", // Full width
                  display: "flex", // Use flexbox for alignment
                  justifyContent: "center", // Center align items
                  alignItems: "center",
                }}
                onClick={() => {
                  router.push("/dashboard/settings/email-template");
                }}
              >
                Create Email Template
              </Button>
            </div>
          </>
        ) : (
          <Button
            variant={"contained"}
            sx={{
              backgroundColor: "gray.200",
              color: "gray.800",
              borderRadius: "10px",
              boxShadow: 8,
              textTransform: "none", // Removes capitalization from text
              paddingX: 2,
              paddingY: 1,
              "&:hover": {
                boxShadow: 4,
                backgroundColor: "gray.300", // Slightly darker on hover
              },
            }}
            onClick={handleCreate}
          >
            Create
          </Button>
        )}
      </div>
    </Box>
  );
};

export { OsSettingsView };
