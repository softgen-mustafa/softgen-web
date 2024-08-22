"use client";

import { DateRangePicker } from "@/app/ui/date_ui";
import { CardView, GridConfig, DynGrid, Weight, GridDirection } from "@/app/ui/responsive_grid";
import { Grid, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { AgingSettings } from "./aging_setting";
import UserPermissions from "./user_permissions";
import MasterPermissions from "./master_permissions";
import MovementConfig from "./movement_config";

const Page = () => {

  const gridConfig = [
    {
    weight: Weight.Low,
      view: (
        <CardView className="max-h-fit h-fit" title="Date Range Setting">
          <DateRangePicker
            onDateChange={(fromDate, toDate) => {
              Cookies.set("fromDate", fromDate ?? "", { expires: 365 });
              Cookies.set("toDate", toDate ?? "", { expires: 365 });
            }}
          />
        </CardView>
      ),
    },
    {
    weight: Weight.Low,
      view: (
        <CardView
          className="max-h-fit h-fit"
          title="Company Configuration"
          permissionCode="MasterConfigButton"
        >
          <MovementConfig />
        </CardView>
      ),
    },
    {
    weight: Weight.Low,
      view: (
        <CardView
          className="max-h-fit h-fit"
          title="User Permissions"
          permissionCode="MasterConfigButton"
        >
          <UserPermissions />
        </CardView>
      ),
    },
    {
    weight: Weight.Low,
      view: (
        <CardView
          className="max-h-fit h-fit"
          title="Master Permissions"
          permissionCode="MasterConfigButton"
        >
          <MasterPermissions />
        </CardView>
      ),
    },

    {
    weight: Weight.Medium,
      view: (
        <CardView
          className="h-fit"
          title="Aging Settings"
          permissionCode="MasterConfigButton"
        >
          <AgingSettings />
        </CardView>
      ),
    },
  ];
  return (
    <div className="w-full" style={{}}>
        <DynGrid views={gridConfig} direction={GridDirection.Row}/>
    </div>
  );
};

export default Page;
