"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
  CircularProgress,
  Box,
} from "@mui/material";
import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import {
  numericToString,
  getPreviousMonths,
} from "@/app/services/Local/helper";

interface Target {
  currency: string;
  targetAmount: number;
  achievedAmount: number;
  pc_accomplished: number;
}

const SalesReportCard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [months, setMonths] = useState<
    { month: string; isSelected: boolean }[]
  >([]);
  const selectedMonth = useRef("");
  const [targets, setTargets] = useState<Target>({
    currency: "₹",
    targetAmount: 0,
    achievedAmount: 0,
    pc_accomplished: 0,
  });

  useEffect(() => {
    salesReportDashboardApi();

    const pastMonths = getPreviousMonths(18).map((month, index) => ({
      month,
      isSelected: index === 0,
    }));
    setMonths(pastMonths);
    selectedMonth.current = pastMonths[0].month;
  }, []);


  const salesReportDashboardApi = async () => {
    try {
      setIsLoading(true);
      
      setTargets({
        currency: "₹",
        targetAmount: 0,
        achievedAmount: 0,
        pc_accomplished: 0,
      });
      
      const url = `${getBmrmBaseUrl()}/executive-target/performance/month/${
        selectedMonth.current
      }`;
      const response = await getAsync(url);
  
      if (response && Object.keys(response).length > 0) {
        setTargets({
          currency: response.currency ?? "₹",
          targetAmount: response.target ?? 0,
          achievedAmount: response.sales ?? 0,
          pc_accomplished: isNaN(response.pc_accomplished)
            ? 0
            : response.pc_accomplished,
        });
      } else {
       
        setTargets({
          currency: "₹",
          targetAmount: 0,
          achievedAmount: 0,
          pc_accomplished: 0,
        });
      }
    } catch (error) {
      console.error("Could not load Targets", error);
      setTargets({
        currency: "₹",
        targetAmount: 0,
        achievedAmount: 0,
        pc_accomplished: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

 
  return (
    <Card className="bg-white shadow-md rounded-2xl">
      <CardContent className="p-4">
        {isLoading ? (
          <Box className="flex justify-center items-center h-40">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="h6" className="font-semibold mb-3">
              {"Target's Info"}
            </Typography>
            <Box className="bg-gray-100 rounded-lg p-2 mb-4 overflow-x-auto flex">
              {months.map((entry, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    const newMonths = months.map((m) => ({
                      ...m,
                      isSelected: m.month === entry.month,
                    }));
                    setMonths(newMonths);
                    selectedMonth.current = entry.month;
                    salesReportDashboardApi();
                  }}
                  className={`mr-2 ${
                    entry.isSelected ? "bg-green-200" : "bg-gray-200"
                  }`}
                  variant={entry.isSelected ? "contained" : "outlined"}
                >
                  {entry.month}
                </Button>
              ))}
            </Box>
            <Card className="border border-gray-200 rounded-lg">
              <CardContent>
                <Typography variant="subtitle1" className="text-center mb-2">
                  Month - {selectedMonth.current}
                </Typography>
                <Box className="flex justify-between mb-2">
                  <Typography variant="body1">Target</Typography>
                  <Typography
                    variant="body1"
                    className="font-bold text-red-600"
                  >
                    ₹ {numericToString(targets.targetAmount)}
                  </Typography>
                </Box>
                <Box className="flex justify-between mb-4">
                  <Typography variant="body1">Achieved</Typography>
                  <Typography
                    variant="body1"
                    className="font-bold text-green-600"
                  >
                    ₹ {numericToString(targets.achievedAmount)}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={targets.pc_accomplished}
                  className="mb-2 h-2"
                />
                <Typography variant="body2" className="text-right">
                  {numericToString(targets.pc_accomplished)}% Achieved
                </Typography>
              </CardContent>
            </Card>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export { SalesReportCard };
