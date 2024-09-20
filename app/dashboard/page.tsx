"use client";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { OutstandingCard } from "./cards/outstanding_card";
import { OutstandingTask } from "./cards/outstanding_task_card";
import { Weight } from "../ui/responsive_grid";
import {
  getAsync,
  getBmrmBaseUrl,
  getSgBizBaseUrl,
  postAsync,
} from "../services/rest_services";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { inspiredPalette } from "../ui/theme";
import { GridColDef } from "@mui/x-data-grid";
import { numericToString } from "../services/Local/helper";
import { useRouter } from "next/navigation";
import RankedPartyOutstandingCard from "./cards/ranked_party";
import { AgingView } from "./cards/aging_card";
import {
  ApiProps,
  PeriodicTable,
  TableColumn,
} from "../ui/periodic_table/period_table";
import ResponsiveCardGrid from "@/app/components/ResponsiveCardGrid";
import { CollectionPrompts } from "./cards/collection_prompts";

const DashboardPage = () => {
  const [filters, updateFilters] = useState([
    { id: 1, label: "Daily", value: "daily", isSelected: true },
    { id: 2, label: "Weekly", value: "weekly", isSelected: false },
    { id: 3, label: "Montly", value: "monthly", isSelected: false },
    { id: 4, label: "Quarterly", value: "quarterly", isSelected: false },
    { id: 5, label: "Yearly", value: "yearly", isSelected: false },
  ]);

  let incomingBillType = "Receivable"; // populate later
  const [types, updateTypes] = useState([
    { id: 1, label: "Receivable", code: "receivable" },
    { id: 2, label: "Payable", code: "payable" },
  ]);

  let selectedType = useRef(types[incomingBillType === "Payable" ? 1 : 0]);
  let selectedFilter = useRef(filters[0]);

  const [rows, setRows] = useState([]);

  const [refresh, triggerRefresh] = useState(false);

  const theme = useTheme();
  const router = useRouter();

  const [userType, setUserType] = useState("");

  useEffect(() => {
    setUserType(Cookies.get("userType") ?? "");
    checkPermission();
  }, []);

  const checkPermission = async () => {
    loadUpcoming().then((_) => triggerRefresh(!refresh));
  };

  const loadUpcoming = async () => {
    try {
      triggerRefresh(!refresh);
      let url = `${getBmrmBaseUrl()}/bill/get/upcoming-overview?groupType=${
        selectedType.current.code
      }&durationType=${selectedFilter.current.value}`;
      let response = await getAsync(url);
      let entries = response.map((entry: any) => {
        return {
          id: entry.id,
          name: entry.title,
          amount: entry.amount,
          amountstr: `${entry.currency ?? "₹"} ${numericToString(
            entry.amount
          )}`,
          billCount: entry.billCount,
          currency: entry.currency ?? "₹",
        };
      });
      setRows(entries);
      return entries;
    } catch {
      alert("Could not load upcoming outstanding");
    } finally {
      triggerRefresh(false);
    }
  };

  const columns: GridColDef<any[number]>[] = [
    {
      field: "name",
      headerName: "Duration Name",
      editable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: "amountstr",
      headerName: "Value",
      editable: false,
      sortable: true,
      flex: 1,
      type: "number",
      valueGetter: (value, row) => row.amount || "0",
    },
    {
      field: "amount",
      headerName: "Value",
      editable: false,
      sortable: true,
      flex: 1,
      type: "number",
      hideable: true,
    },
  ];

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
      id: 1,
      weight: Weight.Medium,
      content: (
        <div>
          <Typography className="text-xl mb-2">
            Payable vs Receivable
          </Typography>
          <OutstandingCard
            companyId={Cookies.get("companyId") ?? ""}
            title="Outstanding Overview"
          />
        </div>
      ),
    },
    {
      id: 2,
      weight: Weight.Medium,
      content: (
        <div>
          <Typography className="text-xl mb-2">
            Outstanding Aging Overview
          </Typography>
          <AgingView
            billType={selectedType.current.code}
            companyId={Cookies.get("companyId") ?? ""}
            title="Aging-Wise O/S"
          />
        </div>
      ),
    },
    {
      id: 3,
      weight: Weight.High,
      content: (
        <div>
          <Typography className="text-xl mb-2">Party Overview</Typography>
          <PeriodicTable
            reload={true}
            useSearch={true}
            columns={[
              {
                header: "Party Name",
                field: "PartyName",
                type: "text",
                pinned: false,
                hideable: false,
                rows: [],
              },
              {
                header: "Total Bills",
                field: "TotalBills",
                type: "number",
                pinned: false,
                hideable: false,
                rows: [],
              },
              {
                header: "Opening Amount",
                field: "TotalOpening",
                type: "number",
                pinned: false,
                hideable: false,
                rows: [],
              },
              {
                header: "Closing Amount",
                field: "TotalClosing",
                type: "number",
                pinned: false,
                hideable: false,
                rows: [],
              },
            ]}
            onApi={async (api: ApiProps) => {
              try {
                let url = `${getSgBizBaseUrl()}/os/get/party-overview`;
                let requestBody = {
                  SearchText: api.searchText ?? "",
                  Batch: {
                    Apply: true,
                    Limit: api.limit,
                    Offset: api.offset,
                  },
                };

                let response = await postAsync(url, requestBody);
                // console.log("party Overview",JSON.stringify(response))
                if (response != null && response.Data != null) {
                  return response.Data;
                }
                return [];
              } catch {
                return [];
              }
            }}
          />
        </div>
      ),
      children: [],
    },
    {
      id: 4,
      weight: Weight.High,
      content: (
        <div className="overflow-scroll">
          <Typography className="text-xl mb-2">Todays Outstanding</Typography>
          <OutstandingTask companyId={Cookies.get("companyId") ?? ""} />
        </div>
      ),
    },
    {
      id: 5,
      weight: Weight.High,
      content: (
        <div title="Ranked Parties" className="overflow-scroll">
          <Typography className="text-xl mb-2">Ranked Parties</Typography>
          <RankedPartyOutstandingCard
            companyId={Cookies.get("companyId") ?? ""}
            billType={selectedType.current.code}
          />
        </div>
      ),
    },
    {
      id: 6,
      weight: Weight.High,
      content: (
        <div title="Upcoming Collections" className="overflow-scroll">
          <Typography className="text-xl mb-2">Upcoming Collections</Typography>
          <Stack
            flexDirection="row"
            gap={1}
            pb={1}
            sx={{ overflowX: "scroll" }}
          >
            {filters.map((card, index) => (
              <Box
                key={index}
                className="rounded-3xl"
                sx={{
                  minWidth: 100,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 40,
                  background: card.isSelected
                    ? theme.palette.primary.main
                    : inspiredPalette.lightTextGrey,
                  color: card.isSelected
                    ? theme.palette.primary.contrastText
                    : inspiredPalette.dark,
                  cursor: "pointer",
                }}
                onClick={(event) => {
                  let values: any[] = filters;
                  values = values.map((entry: any) => {
                    let isSelected = card.value === entry.value;
                    entry.isSelected = isSelected;
                    return entry;
                  });
                  updateFilters(values);
                  selectedFilter.current = card;
                  loadUpcoming();
                  triggerRefresh(!refresh);
                }}
              >
                <Typography
                  component="div"
                  className="flex h-full w-full flex-row justify-center items-center"
                >
                  {card.label}
                </Typography>
              </Box>
            ))}
          </Stack>
          <br />
          <PeriodicTable
            chartKeyFields={[
              {
                label: "Duration",
                value: "name",
              },
            ]}
            chartValueFields={[
              {
                label: "Amount",
                value: "amount",
              },
            ]}
            useSearch={false}
            columns={columns.map((col: any) => {
              let column: TableColumn = {
                header: col.headerName,
                field: col.field,
                type: "text",
                pinned: false,
                rows: [],
                hideable: col.hideable,
              };
              return column;
            })}
            // onApi={loadUpcoming}
            rows={rows}
            reload={refresh}
          />
        </div>
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
