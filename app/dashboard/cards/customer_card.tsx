"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  IconButton,
  Box,
} from "@mui/material";
import { ChevronRight, Dashboard } from "@mui/icons-material";
import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import { useRouter } from "next/navigation";

const CustomerDetailsCard = () => {
  const router = useRouter();
  const [data, setData] = useState<{ totalCount: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    CustomerCardApi();
  }, []);

  const CustomerCardApi = async () => {
    try {
      setIsLoading(true);
      let url = `${getBmrmBaseUrl()}/ledger/total-count`;
      const response = await getAsync(url);
      setData({
        totalCount: response.total_count,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = () => {
    router.push("/dashboard/customerDetails");

  };

  return (
    <Card className="bg-white shadow-md" sx={{ borderRadius: 6 }}>
      {isLoading ? (
        <CardContent className="flex justify-center items-center h-40">
          <CircularProgress />
        </CardContent>
      ) : (
        <Box onClick={handleCardClick} sx={{ cursor: "pointer" }}>
          <CardContent className="p-6">
            <Typography variant="h6" className="text-gray-800 mb-4">
              Total Customers
            </Typography>
            <Typography variant="h4" className="font-bold mb-4">
              {data?.totalCount.toLocaleString() || "0"}
            </Typography>
            <div className="flex justify-end">
              <IconButton size="small">
                <ChevronRight />
              </IconButton>
            </div>
          </CardContent>
        </Box>
      )}
    </Card>
  );
};

export { CustomerDetailsCard };
