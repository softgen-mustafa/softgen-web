"use client";

import React from "react";
import {
  CardView,
  DynGrid,
  GridDirection,
  Weight,
} from "@/app/ui/responsive_grid";
import DateWiseFollowup from "./datewisefollowup";
import TeamFollowup from "./teamfollowup";
import PartyFollowup from "./partyfollowup";

const Page = () => {
  const gridConfig = [
    {
      weight: Weight.Medium,
      view: (
        <CardView className="max-h-fit h-fit" title="Date Wise Follow Up">
          <DateWiseFollowup />
        </CardView>
      ),
    },
    {
      weight: Weight.Medium,
      view: (
        <CardView className="max-h-fit h-fit" title="Team Follow Up">
          <TeamFollowup />
        </CardView>
      ),
    },
    {
      weight: Weight.High,
      view: (
        <CardView className="max-h-fit h-fit" title="Party Follow Up">
          <PartyFollowup />
        </CardView>
      ),
    },
  ];

  return (
    <div className="w-full">
      <DynGrid views={gridConfig} direction={GridDirection.Row} />
    </div>
  );
};

export default Page;
