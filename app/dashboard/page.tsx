"use client";
import { CustomerDetailsCard } from "./cards/customer_card";
import { Grid } from "@mui/material";
import { OutstandingCard } from "./cards/outstanding_card";
import { SalesReportCard } from "./cards/sales_report_card";
import { InventoryCard } from "./cards/inventory_card";
import { OutstandingTask } from "./cards/outstanding_task_card";
import { CardView, GridConfig, RenderGrid } from "../ui/responsive_grid";
import { DropDown } from "../ui/drop_down";
import { getAsync, getBmrmBaseUrl } from "../services/rest_services";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";

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
        <CardView>
          <CompanyCard />
        </CardView>
      ),
      className: "",
      children: [],
    },
    {
      type: "item",
      view: (
        <CardView>
          <OutstandingCard />
        </CardView>
      ),
      className: "",
      children: [],
    },
    {
      type: "item",
      view: (
        <CardView>
          <InventoryCard />
        </CardView>
      ),
      className: "",
      children: [],
    },
    {
      type: "item",
      view: (
        <CardView>
          <OutstandingTask />
        </CardView>
      ),
      className: "",
      children: [],
    },
    {
      type: "item",
      view: (
        <CardView>
          <CustomerDetailsCard></CustomerDetailsCard>
        </CardView>
      ),
      className: "",
      children: [],
    },
  ];
  return (
    <div className="">
      <Grid
        container
        className="bg-gray-200"
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
