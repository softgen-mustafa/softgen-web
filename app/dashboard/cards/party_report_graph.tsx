"use client";
import React, { useEffect, useState } from "react";
import { getSgBizBaseUrl, postAsync } from "@/app/services/rest_services";
import {
  CircularProgress,
  CardContent,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import { SingleChartView } from "@/app/ui/graph_util";
import { DropDown } from "@/app/ui/drop_down";
import { Sync } from "@mui/icons-material";

interface PartyReportOverview {
  PartyName: string;
  BillNumber: string;
  TotalBills: number;
  TotalOpening: number;
  TotalClosing: number;
}

interface OutstandingCardProps {
  companyId: string | null;
}

const PartyReportGraph: React.FC<OutstandingCardProps> = ({ companyId }) => {
  const [data, setData] = useState<PartyReportOverview[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedField, setSelectedField] = useState<string>("TotalOpening");
  const [limit, setLimit] = useState<number>(5);

  const fieldOptions = [
    { name: "Total Opening", value: "TotalOpening" },
    { name: "Total Closing", value: "TotalClosing" },
    { name: "Total Bills", value: "TotalBills" },
  ];

  useEffect(() => {
    if (companyId) {
      fetchPartyReportOverview(companyId);
    }
  }, [companyId]);

  const fetchPartyReportOverview = async (companyId: string) => {
    setIsLoading(true);
    try {
      let url = `${getSgBizBaseUrl()}/os/get/party-overview`;
      let requestBody = {
        Batch: {
          Apply: true,
          Limit: limit,
          Offset: 0,
        },
      };
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
    if (companyId) {
      fetchPartyReportOverview(companyId);
    }
  };

  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = Math.min(Math.max(parseInt(event.target.value)), 20);
    setLimit(newLimit);
  };

  return (
    <div>
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

      {isLoading ? (
        <CardContent className="flex justify-center items-center h-40">
          <CircularProgress />
        </CardContent>
      ) : (
        <Box className="p-4">
          <DropDown
            label="Select Field"
            displayFieldKey={"name"}
            valueFieldKey={null}
            selectionValues={fieldOptions}
            helperText="Choose a field to display"
            onSelection={(selection) => {
              setSelectedField(selection.value);
            }}
            defaultSelectionIndex={fieldOptions.findIndex(
              (item) => item.value === selectedField
            )}
            useSearch={false}
          />
          {data && data.length > 0 ? (
            <SingleChartView
              values={data.map((item) => ({
                label: item.PartyName,
                value: item[selectedField as keyof PartyReportOverview],
              }))}
              defaultChart="pie"
              title={""}
            />
          ) : (
            <div>No data available</div>
          )}
        </Box>
      )}
    </div>
  );
};

export { PartyReportGraph };