"use client";
import {
    Home,
    PendingActions,
    Receipt,
    Settings,
    Inventory,
} from "@mui/icons-material";

const customReportPaths = [
    /*{
        title: "Broker Sales",
        destination: "/dashboard/broker/sales",
        icon: <Receipt />,
        selected: false,
    },*/
];
const memberReportPaths = [
    {
        title: "Broker Sales",
        destination: "/dashboard/broker/sales",
        icon: <Receipt />,
        selected: false,
    },
    {
        title: "Broker Outstanding",
        destination: "/dashboard/broker/outstanding",
        icon: <Receipt />,
        selected: false,
    },
];

const adminReportPaths = [
    {
        title: "Home",
        destination: "/dashboard",
        icon: <Home />,
        selected: true,
    },
    {
        title: "Outstanding",
        destination: "/dashboard/outstanding",
        icon: <PendingActions />,
        selected: false,
    },
    {
        title: "Transactions",
        destination: "/dashboard/vouchers",
        icon: <Receipt />,
        selected: false,
    },
    {
        title: "Inventory",
        destination: "/dashboard/Inventory",
        icon: <Inventory />,
        selected: false,
    },
    {
        title: "Settings",
        destination: "/dashboard/settings",
        icon: <Settings />,
        selected: false,
    },
];

export {
    customReportPaths,
    memberReportPaths,
    adminReportPaths
}
