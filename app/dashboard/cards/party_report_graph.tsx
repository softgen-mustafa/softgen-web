"use client";

import React, { useEffect, useState } from "react";
import { getSgBizBaseUrl, postAsync } from "@/app/services/rest_services";
import { useRouter } from "next/navigation";
import { CircularProgress, CardContent, Box } from "@mui/material"; // Assuming you're using MUI
import { SingleChartView } from "@/app/ui/graph_util";
import { DropDown } from "@/app/ui/drop_down";

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
  const router = useRouter();
  const [data, setData] = useState<PartyReportOverview[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedField, setSelectedField] = useState<string>("TotalOpening");
  const [refresh, triggerRefresh] = useState(false);

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
          Limit: 5,
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

  return (
    <div>
      {isLoading ? (
        <CardContent className="flex justify-center items-center h-40">
          <CircularProgress />
        </CardContent>
      ) : (
        <Box className="p-0">
          <DropDown
            label="Select Field"
            displayFieldKey={"name"}
            valueFieldKey={null}
            selectionValues={fieldOptions}
            helperText="Choose a field to display"
            onSelection={(selection) => {
              setSelectedField(selection.value);
              triggerRefresh(!refresh);
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
