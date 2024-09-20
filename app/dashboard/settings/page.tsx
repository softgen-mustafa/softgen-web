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
import GridCardView from "@/app/ui/grid_card";

const Page = () => {
  const views = [
    {
      id: 1,
      weight: 1,
      content: (
        <GridCardView
          title="Date Range Setting"
          permissionCode="DateRangeSettings"
        >
          <DateRangePicker
            onDateChange={(fromDate, toDate) => {
              Cookies.set("fromDate", fromDate ?? "", { expires: 365 });
              Cookies.set("toDate", toDate ?? "", { expires: 365 });
            }}
          />
        </GridCardView>
      ),
    },
    {
      id: 2,
      weight: Weight.Low,
      content: (
        <GridCardView
          title="Company Configuration"
          permissionCode="MovementConfig"
        >
          <MovementConfig />
        </GridCardView>
      ),
    },
    {
      id: 3,
      weight: Weight.Low,
      content: (
        <GridCardView title="User Permissions" permissionCode="UserPermission">
          <UserPermissions />
        </GridCardView>
      ),
    },
    {
      id: 4,
      weight: Weight.Low,
      content: (
        <GridCardView
          title="Master Permissions"
          permissionCode="MasterPermission"
        >
          <MasterPermissions />
        </GridCardView>
      ),
    },
    {
      id: 5,
      weight: Weight.Medium,
      content: (
        <GridCardView title="Aging Settings" permissionCode="AgingConfig">
          <AgingSettings />
        </GridCardView>
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
