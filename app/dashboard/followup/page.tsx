"use client";

import React from "react";
import ResponsiveCardGrid from "@/app/components/ResponsiveCardGrid"
import {DateWiseFollowup }from "./datewisefollowup";
import {TeamFollowup} from "./teamfollowup";
import {PartyFollowup} from "./partyfollowup";

const Page = () => {
    const gridConfig: any[] = [
        {
            id: 1,
            weight: 1,
            content: (
                <DateWiseFollowup />
            )
        },
        {
            id: 2,
            weight: 1,
            content: (
                <div>
                <TeamFollowup />
                </div>
            ),
        },
        {
            id: 3,
            weight: 1,
            content: (
                <div>
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
