"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getAsync, getBmrmBaseUrl } from "../services/rest_services";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";


const Page = () => {
  const [details, setDetails] = useState<{
    payableTitle: string;
    receivableTitle: string;
    payableAmount: number;
    receivableAmount: number;
    currency: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const hasReloaded = false;
  const selectedCompany = "df89b80e-9048-49f1-9c5e-0c88fe9886f0";

  useEffect(() => {
    outstandingDashboardApi();
  }, [selectedCompany, hasReloaded]);

  const outstandingDashboardApi = async () => {
    setLoading(true);
    try {
      const url = `${getBmrmBaseUrl()}/bill/get/outstanding-overview`;
      let response = await getAsync(url);
      console.log(response);
      if (response === null || response.length < 1) {
        response = [
          {
            name: "Payable",
            billDate: "0001-01-01T00:00:00",
            dueDate: null,
            closingBal: 0,
            isOutstanding: false,
          },
          {
            name: "Receivable",
            billDate: "0001-01-01T00:00:00",
            dueDate: null,
            closingBal: 0,
            isOutstanding: false,
          },
        ];
      }

      setDetails({
        payableTitle: response[0].name || "Payable",
        receivableTitle: response[1].name || "Receivable",
        payableAmount: response[0].closingBal,
        receivableAmount: response[1].closingBal,
        currency: response.currency ?? "₹",
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-light underline mb-6">Dashboard Title</h1>
      {loading ? (
        <CircularProgress />
      ) : (
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white shadow-md">
            <CardContent>
              <Typography variant="h6" className="mb-2">
                {details?.payableTitle}
              </Typography>
              <Typography variant="h4" className="font-bold">
                {details?.currency}
                {details?.payableAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-md">
            <CardContent>
              <Typography variant="h6" className="mb-2">
                {details?.receivableTitle}
              </Typography>
              <Typography variant="h4" className="font-bold">
                {details?.currency}
                {details?.receivableAmount.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </div>
  );
};

export default Page;
