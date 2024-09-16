"use client";

import { DateRangePicker } from "@/app/ui/date_ui";
import {
  CardView,
  GridConfig,
  DynGrid,
  Weight,
  GridDirection,
} from "@/app/ui/responsive_grid";
import { Grid, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { AgingSettings } from "./aging_setting";
import UserPermissions from "./user_permissions";
import MasterPermissions from "./master_permissions";
import MovementConfig from "./movement_config";
import { OsSettingsView } from "../outstanding/report/outstanding_setings";
import ResponsiveCardGrid from "@/app/components/ResponsiveCardGrid";

const Page = () => {
  const views = [
    {
      id: 1,
      weight: 1,
      content: (
        <div className="max-h-fit h-fit" title="Date Range Setting">
          <DateRangePicker
            onDateChange={(fromDate, toDate) => {
              Cookies.set("fromDate", fromDate ?? "", { expires: 365 });
              Cookies.set("toDate", toDate ?? "", { expires: 365 });
            }}
          />
        </div>
      ),
    },
    {
      id: 2,
      weight: Weight.Low,
      content: (
        <div
          className="max-h-fit h-fit"
          title="Company Configuration"
          // permissionCode="MasterConfigButton"
        >
          <MovementConfig />
        </div>
      ),
    },
    {
      id: 3,
      weight: Weight.Low,
      content: (
        <div
          className="max-h-fit h-fit overflow-scroll"
          title="User Permissions"
          // permissionCode="MasterConfigButton"
        >
          <UserPermissions />
        </div>
      ),
    },
    {
      id: 4,
      weight: Weight.Low,
      content: (
        <div
          className="max-h-fit h-fit overflow-scroll"
          title="Master Permissions"
          // permissionCode="MasterConfigButton"
        >
          <MasterPermissions />
        </div>
      ),
    },
    {
      id: 5,
      weight: Weight.Medium,
      content: (
        <div
          className="h-fit overflow-scroll"
          title="Aging Settings"
          // permissionCode="MasterConfigButton"
        >
          <AgingSettings />
        </div>
      ),
    },
  ];
  return (
    <div className="w-full" style={{}}>
      {/* <DynGrid views={gridConfig} direction={GridDirection.Row} /> */}
      <ResponsiveCardGrid screenName="settings" initialCards={views} />
    </div>
  );
};

export default Page;
