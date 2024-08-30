"use client";

import {
    Box,
    Typography,
    Button
} from "@mui/material";
import { 
    TextInput 
} from "@/app/ui/text_inputs";
import { useRef, useState } from "react";


interface EmailSettings {
    SmtpServer: string;
    SmtpPort: string;
    To: string;
    Cc: string;
    Subject: string;
    Body: string;
    BodyType: string;
}


interface OsSettings {
    CutOffDate: string;
    DueDays: number;
    OverDueDays: number;
    SendAllDue: boolean;
    SendDueOnly: boolean;
    AutoReminderInterval: string;
    ReminderIntervalDays: number;
    EmailSetting: EmailSettings;
}

const OsSettingsView = () => {

    let settings = useRef<OsSettings>({
        CutOffDate: "",
        DueDays: 0,
        OverDueDays: 0,
        SendAllDue: false,
        SendDueOnly: false,
        AutoReminderInterval: "",
        ReminderIntervalDays: 10,
        EmailSetting: {
            SmtpServer: "",
            SmtpPort: "",
            To: "",
            Cc: "",
            Subject: "",
            Body: "",
            BodyType: "",
        },
    });

    const [showEmailConfig, toggleEmailConfig] = useState(false);

        //<Box className="fixed inset-0 bg-white w-[60%]  m-8 p-2 rounded-xl items-center justify-center">
    return (
        <Box className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 overflow-y-hidden">
          <div className="bg-white p-8 rounded shadow-md w-1/ 3overflow-y-hidden">
            <Typography>Outstanding Settings</Typography>
            <TextInput 
            mode="text"
            placeHolder="Cut Off Date"
            onTextChange={(value) => {
                settings.current.CutOffDate = value;
            }}
            defaultValue=""
            />
            <div className="mt-2"/>
            <TextInput 
            mode="number"
            placeHolder="Due Days"
            onTextChange={(value) => {
                settings.current.DueDays = parseInt(value ?? "0");
            }}
            defaultValue=""
            />
            <div className="mt-2"/>
            <TextInput 
            mode="number"
            placeHolder="Over-Due Days"
            onTextChange={(value) => {
                settings.current.OverDueDays = parseInt(value ?? "0");
            }}
            defaultValue=""
            />
            <div className="mt-2"/>
            <TextInput 
            mode="number"
            placeHolder="Reminder Interval Days"
            onTextChange={(value) => {
                settings.current.ReminderIntervalDays = parseInt(value ?? "0");
            }}
            defaultValue=""
            />

            <div className="mt-4"/>
            <Button variant={"contained"} onClick={() => {
                toggleEmailConfig(!showEmailConfig);
            }}>{showEmailConfig ? "Hide" : "Show"} Email Config</Button>

            {

                showEmailConfig
                &&
                <Box>
                    <div className="mt-2"/>
                    <TextInput 
                    mode="text"
                    placeHolder="Mail Server"
                    onTextChange={(value) => {
                        settings.current.EmailSetting.SmtpServer = value
                    }}
                    />
                    <div className="mt-2"/>
                    <TextInput 
                    mode="text"
                    placeHolder="Mail Port"
                    onTextChange={(value) => {
                        settings.current.EmailSetting.SmtpPort = value
                    }}
                    />
                    <div className="mt-2"/>
                    <TextInput 
                    mode="text"
                    placeHolder="To Email(s)"
                    onTextChange={(value) => {
                        settings.current.EmailSetting.To = value
                    }}
                    />
                    <div className="mt-2"/>
                    <TextInput 
                    mode="text"
                    placeHolder="Cc Email(s)"
                    onTextChange={(value) => {
                        settings.current.EmailSetting.Cc = value
                    }}
                    />
                    <div className="mt-2"/>
                    <TextInput 
                    mode="text"
                    placeHolder="Subject"
                    onTextChange={(value) => {
                        settings.current.EmailSetting.Subject = value
                    }}
                    />
                    <div className="mt-2"/>
                    <TextInput 
                    mode="text"
                    multiline={true}
                    placeHolder="body"
                    onTextChange={(value) => {
                        settings.current.EmailSetting.Body = value
                    }}
                    />
                </Box>
            }

            <div className="mt-4"/>
            <Button variant={"contained"} onClick={() => {
            }}>Save</Button>
            </div>
        </Box>
    );
}

export { OsSettingsView };
