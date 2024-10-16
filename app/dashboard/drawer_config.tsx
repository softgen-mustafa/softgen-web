"use client";
import {
  Home,
  PendingActions,
  Receipt,
  Settings,
  Inventory,
} from "@mui/icons-material";

const customReportPaths: any[] = [
  /*{
        title: "Broker Sales",
        destination: "/dashboard/broker/sales",
        icon: <Receipt />,
        selected: false,
    },*/
];
const memberReportPaths: any[] = [
  /*
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
    */
];

const adminReportPaths: any[] = [
  {
    title: "Home",
    destination: "/dashboard",
    icon: <Home />,
    selected: true,
  },
  {
    title: "Outstanding Report",
    destination: "/dashboard/outstanding/report",
    icon: <PendingActions />,
    selected: false,
  },
  {
    title: "Follow Up",
    destination: "/dashboard/followup",
    icon: <Receipt />,
    selected: false,
  },
  {
    title: "Stock Items",
    destination: "/dashboard/Inventory/stock-items",
    icon: <Inventory />,
    selected: false,
  },
  {
    title: "Transactions",
    destination: "/dashboard/vouchers",
    icon: <Receipt />,
    selected: false,
  },
  // {
  //     title: "All Inventory",
  //     destination: "/dashboard/Inventory",
  //     icon: <Inventory />,
  //     selected: false,
  // },
  // {
  //     title: "Aging Outstanding",
  //     destination: "/dashboard/outstanding",
  //     icon: <PendingActions />,
  //     selected: false,
  // },
  {
    title: "Settings",
    destination: "/dashboard/settings",
    icon: <Settings />,
    selected: false,
  },
];

export { customReportPaths, memberReportPaths, adminReportPaths };
