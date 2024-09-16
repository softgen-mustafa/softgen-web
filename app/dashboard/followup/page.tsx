"use client";

import React from "react";
import ResponsiveCardGrid from "@/app/components/ResponsiveCardGrid"
import {DateWiseFollowup }from "./datewisefollowup";
import {TeamFollowup} from "./teamfollowup";
import {PartyFollowup} from "./partyfollowup";
import { Typography } from "@mui/material"

const Page = () => {
    const gridConfig: any[] = [
        {
            id: 1,
            weight: 1,
            content: (
                <div>
                <Typography className="text-xl mb-2">
                Day-Wise Follow-Up Summary
                </Typography>
                <DateWiseFollowup />
                </div>
            )
        },
        {
            id: 2,
            weight: 1,
            content: (
                <div>
                <Typography className="text-xl mb-2">
                Team Follow-Up Summary
                </Typography>
                <TeamFollowup />
                </div>
            ),
        },
        {
            id: 3,
            weight: 1,
            content: (
                <div>
                <Typography className="text-xl mb-2">
                Party Follow-Up Summary
                </Typography>
                <PartyFollowup />
                </div>
            ),
        },
    ];

    return (
        <div className="w-full ">
        <ResponsiveCardGrid screenName="FollowUpDashboard" initialCards={gridConfig}/>
        </div>
    );
};

export default Page;
