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
import { FeatureControl } from "@/app/components/featurepermission/permission_helper";

interface CustomerDetailsCardProps {
  companyId: string | null;
}

const CustomerDetailsCard: React.FC<CustomerDetailsCardProps> = ({
  companyId,
}) => {
  const router = useRouter();
  const [data, setData] = useState<{ totalCount: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  // useEffect(() => {
  //   CustomerCardApi();
  // }, []);

  useEffect(() => {
    // FeatureControl("CustomerCard").then((permission) => {
    //   setHasPermission(permission);
    if (companyId) {
      CustomerCardApi(companyId);
      // } else if (!permission) {
      //   router.back();
      //   // Toast("Access Denied for Customer Overview");
      // }
    }
  }, [companyId]);

  const CustomerCardApi = async (companyId: string) => {
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
    router.push("/dashboard/customer");
  };

  return (
    // hasPermission && (
    <Box>
      {isLoading ? (
        // <CardContent className="flex justify-center items-center h-40">
        <Box display={"flex"} justifyContent={"center"}>
          <CircularProgress sx={{ color: "#F8F9FA" }} />
        </Box>
      ) : (
        // </CardContent>
        <Box
          onClick={handleCardClick}
          className="flex flex-row justify-between"
          sx={{
            cursor: "pointer",
            // borderWidth: 2,
            // borderRadius: 1,
            // padding: 2,
            // marginTop: 3,
          }}
        >
          <div className="flex flex-col">
            <Typography
              sx={{
                color: "white",
                letterSpacing: 1,
                mb: 1,
                fontWeight: "500",
                fontSize: 20,
              }}
            >
              Total Customers
            </Typography>
            <Typography
              sx={{ color: "#FFFFFF", fontWeight: "400", fontSize: 28 }}
            >
              {data?.totalCount.toLocaleString() || "0"}
            </Typography>
          </div>
          <div className="flex justify-end">
            <IconButton size="small">
              <ChevronRight sx={{ color: "#FFFFFF" }} />
            </IconButton>
          </div>
        </Box>
      )}
    </Box>
  );
  // );
};

export { CustomerDetailsCard };
