"use client";
import { Box } from "@mui/material";
import { OutstandingCard } from "./cards/outstanding_card";
import { OutstandingTask } from "./cards/outstanding_task_card";
import { Weight } from "../ui/responsive_grid";
import { useRef, useState } from "react";
import Cookies from "js-cookie";
import RankedPartyOutstandingCard from "./cards/ranked_party";
import { AgingView } from "./cards/aging_card";
import ResponsiveCardGrid from "@/app/components/ResponsiveCardGrid";
import GridCardView from "../ui/grid_card";
import { CollectionPrompts } from "./cards/collection_prompts";
import { CollectionReport } from "./cards/collection_report";
import { PartyReportGraph } from "./cards/party_report_graph";
import { UpcomingGraphOverview } from "./cards/upcoming_wise_graph";

const DashboardPage = () => {
  let incomingBillType = "Receivable"; // populate later
  const [types, updateTypes] = useState([
    { id: 1, label: "Receivable", code: "receivable" },
    { id: 2, label: "Payable", code: "payable" },
  ]);

  let selectedType = useRef(types[incomingBillType === "Payable" ? 1 : 0]);

  const initialCards = [
    {
      id: 7,
      weight: Weight.Low,
      content: (
        <div>
          <CollectionPrompts />
        </div>
      ),
    },
    {
      id: 8,
      weight: Weight.Low,
      content: (
        <div>
          <CollectionReport />
        </div>
      ),
    },
    {
      id: 1,
      weight: Weight.Medium,
      content: (
        <GridCardView
          permissionCode="PayableReceivable"
          title="Payable vs Receivable"
        >
          <OutstandingCard
            companyId={Cookies.get("companyId") ?? ""}
            title="Outstanding Overview"
          />
        </GridCardView>
      ),
    },
    {
      id: 2,
      weight: Weight.Medium,
      content: (
        <GridCardView
          permissionCode="OutstandingAgingOverview"
          title=" Outstanding Aging Overview"
        >
          <AgingView
            billType={selectedType.current.code}
            companyId={Cookies.get("companyId") ?? ""}
            title="Aging-Wise O/S"
          />
        </GridCardView>
      ),
    },
    {
      id: 3,
      weight: Weight.High,
      content: (
        <GridCardView
          title="Party Overview"
          permissionCode="PartyWiseOutstanding"
        >
          {/* <Typography className="text-xl mb-2">Party Overview</Typography> */}
          <PartyReportGraph
            companyId={Cookies.get("companyId") ?? ""}
          ></PartyReportGraph>
        </GridCardView>
      ),
      children: [],
    },
    {
      id: 4,
      weight: Weight.High,
      content: (
        <GridCardView
          permissionCode="TodaysOutstanding"
          title="Todays Outstanding"
        >
          {/* <Typography className="text-xl mb-2">Todays Outstanding</Typography> */}
          <OutstandingTask companyId={Cookies.get("companyId") ?? ""} />
        </GridCardView>
      ),
    },
    {
      id: 5,
      weight: Weight.High,
      content: (
        <GridCardView permissionCode="TopRankedParties" title=" Ranked Parties">
          {/* <Typography className="text-xl mb-2">Ranked Parties</Typography> */}
          <RankedPartyOutstandingCard
            companyId={Cookies.get("companyId") ?? ""}
            billType={selectedType.current.code}
          />
        </GridCardView>
      ),
    },
    {
      id: 6,
      weight: Weight.High,
      content: (
        <GridCardView
          permissionCode="UpcomingCollections"
          title="Upcoming Collections"
        >
          <UpcomingGraphOverview></UpcomingGraphOverview>
        </GridCardView>
      ),
    },
  ];

  return (
    <Box className="w-full h-full">
      <ResponsiveCardGrid screenName="dashboard" initialCards={initialCards} />
    </Box>
  );
};

export default DashboardPage;
