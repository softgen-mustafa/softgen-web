"use client";
import React, { useState, useEffect } from "react";
import { getSgBizBaseUrl, postAsync } from "@/app/services/rest_services";
import {
  Box,
  TextField,
  IconButton,
  CardContent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { SingleChartView } from "@/app/ui/graph_util";
import { Sync } from "@mui/icons-material";
import { DropDown } from "@/app/ui/drop_down";

const AgingReportGraph = () => {
  const [data, setData] = useState<any>({
    Above30: [],
    Above60: [],
    Above90: [],
    Above120: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState<number>(5);
  const [selectedGroup, setSelectedGroup] = useState<string>("Above30");

  const loadData = async () => {
    setIsLoading(true);
    let above30 = await onApi("above-30-wise", "Above30");
    let above60 = await onApi("above-60-wise", "Above60");
    let above90 = await onApi("above-90-wise", "Above90");
    let above120 = await onApi("above-120-wise", "Above120");

    setData({
      Above30: above30.values,
      Above60: above60.values,
      Above90: above90.values,
      Above120: above120.values,
    });

    setIsLoading(false);
  };

  const onApi = async (SortKey: string, Field: string) => {
    let url = `${getSgBizBaseUrl()}/aging/overview?applyRange=${true}`;

    let requestBody = {
      Filter: {
        Batch: {
          Limit: limit,
          Offset: 0,
          Apply: true,
        },
        SearchKey: "",
        SearchText: "",
        SortKey: SortKey,
        SortOrder: "desc",
      },
    };

    let res = await postAsync(url, requestBody);
    if (!res || !res.Data) {
      return { values: [], sum: 0 };
    }

    let sum = 0;
    let values = res.Data.map((entry: any) => {
      sum += entry.ClosingAmount;
      return {
        label: entry.PartyName,
        value: entry[Field],
      };
    });

    return {
      values,
      sum,
    };
  };

  const handleRefresh = () => {
    loadData();
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = Math.min(Math.max(parseInt(event.target.value)), 20);
    setLimit(newLimit);
  };

  const handleGroupChange = (selectedGroup: string) => {
    setSelectedGroup(selectedGroup);
  };

  useEffect(() => {
    loadData();
  }, []);
  const selectedData = data[selectedGroup];

  return (
    <div>
      <div className="flex items-center p-4">
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

      {/* First Graph: Overview */}
      {isLoading ? (
        <CardContent className="flex justify-center items-center h-40">
          <CircularProgress />
        </CardContent>
      ) : (
        <>
          <Typography className="text-xl mb-2">Total Aging</Typography>
          <Box className="p-4">
            <SingleChartView
              values={[
                {
                  label: "Above 30",
                  value: data.Above30.length
                    ? data.Above30.reduce((a: any, b: any) => a + b.value, 0)
                    : 0,
                },
                {
                  label: "Above 60",
                  value: data.Above60.length
                    ? data.Above60.reduce((a: any, b: any) => a + b.value, 0)
                    : 0,
                },
                {
                  label: "Above 90",
                  value: data.Above90.length
                    ? data.Above90.reduce((a: any, b: any) => a + b.value, 0)
                    : 0,
                },
                {
                  label: "Above 120",
                  value: data.Above120.length
                    ? data.Above120.reduce((a: any, b: any) => a + b.value, 0)
                    : 0,
                },
              ]}
              defaultChart="pie"
              title=""
            />
          </Box>
        </>
      )}

      {/* Second Graph: Details based on selected group */}

      {isLoading ? (
        <CardContent className="flex justify-center items-center h-40">
          <CircularProgress />
        </CardContent>
      ) : (
        <>
          <Typography className="text-xl mb-2">Aging wise Graph</Typography>
          <Box className="p-4">
            <DropDown
              label="Select Aging"
              displayFieldKey="label"
              valueFieldKey="value"
              selectionValues={[
                { label: "Above 30", value: "Above30" },
                { label: "Above 60", value: "Above60" },
                { label: "Above 90", value: "Above90" },
                { label: "Above 120", value: "Above120" },
              ]}
              helperText=""
              onSelection={handleGroupChange}
              defaultSelectionIndex={0}
            />

            {selectedData && selectedData.length > 0 ? (
              <SingleChartView
                values={selectedData.map((item: any) => ({
                  label: item.label,
                  value: item.value,
                }))}
                defaultChart="pie"
                title=""
              />
            ) : (
              <div>No data available</div>
            )}
          </Box>
        </>
      )}
    </div>
  );
};

export { AgingReportGraph };
