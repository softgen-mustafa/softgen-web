"use client";
import { CustomerDetailsCard } from "./cards/customer_card";
import { Grid, Typography } from "@mui/material";
import { OutstandingCard } from "./cards/outstanding_card";
import { SalesReportCard } from "./cards/sales_report_card";
import { InventoryCard } from "./cards/inventory_card";
import { OutstandingTask } from "./cards/outstanding_task_card";
import { CardView, GridConfig, RenderGrid } from "../ui/responsive_grid";
import { DropDown } from "../ui/drop_down";
import { getAsync, getBmrmBaseUrl } from "../services/rest_services";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { inspiredPalette } from "../ui/theme";

const CompanyCard = () => {
  const [data, setData] = useState([]);

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
        Cookies.set("companyId", values[0].id);
      }
    } catch {}
  };

  return (
    <div>
      <DropDown
        label={"Select Company"}
        displayFieldKey={"name"}
        valueFieldKey={null}
        selectionValues={data}
        helperText={""}
        onSelection={(selection) => {
          Cookies.set("companyId", selection.id);
        }}
      />
    </div>
  );
};

const DashboardPage = () => {
  const gridConfig: GridConfig[] = [
    {
      type: "item",
      view: (
        <CardView title="Overview">
          <CompanyCard />
          <CustomerDetailsCard></CustomerDetailsCard>
        </CardView>
      ),
      className: "",
      children: [],
    },
    {
      type: "item",
      view: (
        <CardView title="Outstanding Overview">
          <OutstandingCard />
        </CardView>
      ),
      className: "",
      children: [],
    },
    {
      type: "item",
      view: (
        <CardView title="Inventory">
          <InventoryCard />
        </CardView>
      ),
      className: "",
      children: [],
    },
    {
      type: "item",
      view: (
        <CardView title="Today's O/S">
          <OutstandingTask />
        </CardView>
      ),
      className: "",
      children: [],
    },
  ];
  return (
    <div className="">
      <Typography
        className="mt-14 ml-2 text-3xl mb-2 font-medium"
        style={{ color: inspiredPalette.dark }}
      >
        Dashboard
      </Typography>
      <Grid
        container
        sx={{
          flexGrow: 1,
          height: "100vh",
        }}
      >
        {RenderGrid(gridConfig)}
      </Grid>
    </div>
  );
};
export default DashboardPage;
