"use client";
import { useState, useRef } from "react";
import { getSgBizBaseUrl, postAsync } from "@/app/services/rest_services";
import {
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useSnackbar } from "@/app/ui/snack_bar_provider";
import { inspiredPalette } from "@/app/ui/theme";
import { SingleChartView } from "@/app/ui/graph_util";
import { Sync } from "@mui/icons-material";

interface PartyReportOverview {
  duration_key: any;
  total_amount: any;
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

  const [refresh, triggerRefresh] = useState(false);
  const [data, setData] = useState<PartyReportOverview[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState<number>(5);

  const loadUpcoming = async () => {
    setIsLoading(true);
    try {
      let url = `${getSgBizBaseUrl()}/upcoming/overview?durationType=${
        selectedFilter.current.value
      }`;

      console.log("load Data", url);

      let requestBody = {
        Filter: {
          Batch: {
            Limit: limit,
            Offset: 0,
            Apply: true,
          },
          SortKey: "Name",
          SortOrder: "asc",
        },
      };

      console.log(JSON.stringify(requestBody));

      let res = await postAsync(url, requestBody);
      if (!res || !res.Data) {
        return [];
      }
      console.log(JSON.stringify(res));

      let response = await postAsync(url, requestBody);
      if (response && response.Data) {
        setData(response.Data);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching party report overview:", error);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRefresh = () => {
    loadUpcoming();
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = Math.min(Math.max(parseInt(event.target.value)), 20);
    setLimit(newLimit);
  };

  return (
    <div>
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
        <div className="flex items-center  p-4">
          <TextField
            label="Limit"
            type="number"
            value={limit}
            onChange={handleLimitChange}
            className="mr-4"
          />
          <IconButton onClick={handleRefresh} aria-label="refresh">
            <Sync />
          </IconButton>
        </div>

        {data && data.length > 0 ? (
          <SingleChartView
            values={data.map((item) => ({
              label: item.duration_key,
              value: item.total_amount,
            }))}
            defaultChart="pie"
            title={""}
          />
        ) : (
          <div>No data available</div>
        )}
      </Stack>
    </div>
  );
};

export { UpcomingGraphOverview };
