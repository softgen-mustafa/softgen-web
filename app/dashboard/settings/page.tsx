"use client";

import { DateRangePicker } from "@/app/ui/date_ui";
import { CardView, GridConfig, DynGrid, Weight, GridDirection } from "@/app/ui/responsive_grid";
import { Grid, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { AgingSettings } from "./aging_setting";
import UserPermissions from "./user_permissions";
import MasterPermissions from "./master_permissions";
import MovementConfig from "./movement_config";
import { DropDown } from "@/app/ui/drop_down";
import { useEffect, useState } from "react";
import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import { DataTable } from "@/app/ui/data_grid";

const Page = () => {
  const [data, setData] = useState([]);
  const [cachedCompanyIndex, setCompanyId] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/info/user-tenant/get/companies`;
      let response = await getAsync(url);
      let values = response.map((entry: any) => {
        return {
          id: entry["company_id"],
          name: entry["company_name"],
          user_id: entry.user_id,
        };
      });
      setData(values);
      if (values && values.length > 0) {
        let existingCompany = Cookies.get("companyId");
        let exisitngIndex = values.findIndex(
          (entry: any) => entry.id === existingCompany
        );
        var guid = values[0].id;
        setCompanyId(0);
        if (exisitngIndex !== -1) {
          guid = values[exisitngIndex].id;
          setCompanyId(exisitngIndex);
        }
        Cookies.set("companyId", guid);
      }
    } catch (error) {
      console.error("Failed to load companies", error);
    }
  };

  const gridConfig = [
    {
    weight: Weight.Low,
      view: (
        <CardView className="max-h-fit h-fit" title="Switch Company">
          <DropDown
            label={"Select Company"}
            displayFieldKey={"name"}
            valueFieldKey={null}
            selectionValues={data}
            helperText={""}
            defaultSelectionIndex={cachedCompanyIndex}
            onSelection={(selection) => {
              const companyId = selection.id;
              Cookies.set("companyId", companyId);
            }}
          />
        </CardView>
      ),
    },
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
