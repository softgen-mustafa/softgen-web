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
    <Box className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 overflow-y-scroll">
      <div className="bg-white p-8 rounded shadow-md w-1/3 overflow-y-hidden">
        <div className="flex flex-row justify-between items-center mb-4">
          <Typography className="text-black text-xl">
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
            <div className="mt-2" />
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
            <div className="mt-2" />
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

            <div className="mt-4" />
            <Button
              variant={"contained"}
              onClick={() => {
                toggleEmailConfig(!showEmailConfig);
              }}
            >
              {showEmailConfig ? "Hide" : "Show"} Email Config
            </Button>

            {showEmailConfig && (
              <Box>
                <div className="mt-2" />
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
                <div className="mt-2" />
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
                <div className="mt-2" />
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
                <div className="mt-2" />
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
                <div className="mt-2" />
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
                <div className="mt-2" />
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
                <div className="mt-2" />
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

            <div className="mt-4" />
            <Button variant={"contained"} onClick={handleUpdate}>
              Update
            </Button>

            <Button
              variant={"contained"}
              onClick={() => {
                router.push("/dashboard/settings/email-template");
              }}
            >
              Create Email Template
            </Button>
          </>
        ) : (
          <Button variant={"contained"} onClick={handleCreate}>
            Create
          </Button>
        )}
      </div>
    </Box>
  );
};

export { OsSettingsView };
