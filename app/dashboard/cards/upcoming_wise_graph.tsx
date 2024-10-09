"use client";
import { useState, useRef } from "react";
import { getSgBizBaseUrl, postAsync } from "@/app/services/rest_services";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { convertToDate, numericToString } from "@/app/services/Local/helper";
import { useSnackbar } from "@/app/ui/snack_bar_provider";
import { inspiredPalette } from "@/app/ui/theme";
import { SingleChartView } from "@/app/ui/graph_util";

interface PartyReportOverview {
  PartyName: string;
  BillNumber: string;
  TotalBills: number;
  TotalOpening: number;
  TotalClosing: number;
}

const UpcomingGraphOverview = () => {
  const [filters, updateFilters] = useState([
    { id: 1, label: "Daily", value: "Daily", isSelected: true },
    { id: 2, label: "Weekly", value: "Weekly", isSelected: false },
    { id: 3, label: "Montly", value: "Monthly", isSelected: false },
    { id: 4, label: "Quarterly", value: "Quarterly", isSelected: false },
    { id: 5, label: "Yearly", value: "Yearly", isSelected: false },
  ]);
  let selectedFilter = useRef(filters[0]);

  const theme = useTheme();

  let selectedisDebitType = useRef<boolean>(true);

  const [refresh, triggerRefresh] = useState(false);
  const [data, setData] = useState<PartyReportOverview[] | null>(null);

  const snackbar = useSnackbar();

  const loadUpcoming = async () => {
    let url = `${getSgBizBaseUrl()}/upcoming/overview?durationType=${
      selectedFilter.current.value
    }`;

    console.log("load Data", url);

    let requestBody = {
      Filter: {
        Batch: {
          Limit: 5,
          Offset: 0,
          Apply: true,
        },
        SortKey: "Name",
        SortOrder: "asc",
      },
      IsDebit: selectedisDebitType.current,
    };

    console.log(JSON.stringify(requestBody));

    let res = await postAsync(url, requestBody);
    if (!res || !res.Data) {
      return [];
    }
    console.log(JSON.stringify(res));

    let values = res.Data.map((entry: any, index: number) => {
      let parties: any[] = [];
      if (entry.parties != null && entry.parties.length > 0) {
        parties = entry.parties.map((party: any, idx: number) => {
          let bills: any[] = [];
          if (party["bills"] != null && party["bills"].length > 0) {
            bills = party["bills"].map((bill: any) => {
              return {
                BillNumber: bill.BillNumber,
                BillDate: convertToDate(bill.BillDate),
                DueDate: convertToDate(bill.DueDate),
                Opening: numericToString(
                  bill.OpeningBalance == null ? 0 : bill.OpeningBalance.Value
                ),
                Closing: numericToString(
                  bill.ClosingBalance == null ? 0 : bill.ClosingBalance.Value
                ),
              };
            });
          }
          return {
            Party: party.party_name,
            Amount: numericToString(party.total_amount),
            Bills: bills,
          };
        });
      }

      return {
        id: index + 1,
        Duration: entry.duration_key,
        Amount: numericToString(entry.total_amount),
        Parties: parties,
      };
    });

    triggerRefresh(false);
    return values;
  };

  return (
    <>
      <Stack flexDirection="row" gap={1} pb={2} sx={{ overflowX: "scroll" }}>
        {filters.map((card, index) => (
          <Box
            key={index}
            className="ml-2 mt-2 rounded-3xl shadow-lg transition-transform duration-200 ease-in-out transform hover:scale-105"
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
              border: card.isSelected
                ? `1px solid ${theme.palette.primary.contrastText}`
                : "none", // Optional: Add border for selected state
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

        {data && data.length > 0 ? (
          <SingleChartView
            values={data.map((item) => ({
              label: item.PartyName,
              value: item["selectedField" as keyof PartyReportOverview],
            }))}
            defaultChart="pie"
            title={""}
          />
        ) : (
          <div>No data available</div>
        )}
      </Stack>
    </>
  );
};

export { UpcomingGraphOverview };
