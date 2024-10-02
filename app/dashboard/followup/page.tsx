"use client";

import React from "react";
import ResponsiveCardGrid from "@/app/components/ResponsiveCardGrid";
import { DateWiseFollowup } from "./datewisefollowup";
import { TeamFollowup } from "./teamfollowup";
import { PartyFollowup } from "./partyfollowup";
import { Box } from "@mui/material";
import { Create } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import GridCardView from "@/app/ui/grid_card";
const Page = () => {
  const router = useRouter();
  const gridConfig: any[] = [
    {
      id: 1,
      weight: 1,
      content: (
        <GridCardView
          title="Day-Wise Follow-Up Summary"
          permissionCode="DayWiseFollowUpSummary"
        >
          <DateWiseFollowup />
        </GridCardView>
      ),
    },
    {
      id: 2,
      weight: 1,
      content: (
        <GridCardView
          title=" Team Follow-Up Summary"
          permissionCode="TeamFollowUpSummary"
        >
          <TeamFollowup />
        </GridCardView>
      ),
    },
    {
      id: 3,
      weight: 1,
      content: (
        <GridCardView
          title=" Party Follow-Up Summary"
          permissionCode="PartyFollowUpSummary"
        >
          <PartyFollowup />
        </GridCardView>
      ),
    },
  ];

  return (
    <div className="w-full">
      <Box
        width={55}
        height={50}
        borderRadius={2}
        border={2}
        borderColor="#000000"
        className="flex items-center shadow-lg justify-center fixed mr-3 mb-2 bg-white"
        sx={{
          bottom: 0,
          right: 0,
        }}
        onClick={() => {
          router.push("/dashboard/followup/create");
        }}
      >
        <Create sx={{ color: "#000000" }} />
      </Box>
      <ResponsiveCardGrid
        screenName="FollowUpDashboard"
        initialCards={gridConfig}
      />
    </div>
  );
};

export default Page;
