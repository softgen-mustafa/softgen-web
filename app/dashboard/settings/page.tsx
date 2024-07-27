"use client";

import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { Grid } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";
import dayjs from "dayjs";

const Page = () => {
  const gridConfig: GridConfig[] = [
    {
      type: "item",
      children: [],
      view: (
        <CardView>
          <DateCalendar views={["year", "month", "day"]} />
        </CardView>
      ),
    },
  ];
  return (
    <div className="w-full" style={{}}>
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

export default Page;
