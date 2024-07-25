"use client";
import { CustomerDetailsCard } from "./cards/customer_card";
import { Grid } from "@mui/material";
import { OutstandingCard } from "./cards/outstanding_card";
import { SalesReportCard } from "./cards/sales_report_card";
import { InventoryCard } from "./cards/inventory_card";
import { OutstandingTask } from "./cards/outstanding_task_card";
import { CardView, GridConfig, RenderGrid } from "../ui/responsive_grid";

const DashboardPage = () => {
  const gridConfig: GridConfig[] = [
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
          <SalesReportCard />
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
