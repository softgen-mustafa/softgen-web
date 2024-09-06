"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  IconButton,
  Box,
  Stack,
} from "@mui/material";
import { ChevronRight, Dashboard } from "@mui/icons-material";
import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import { useRouter } from "next/navigation";
import { FeatureControl } from "@/app/components/featurepermission/permission_helper";
import GroupIcon from "@mui/icons-material/Group";

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
    <Box display={"flex"} flexDirection={"column"} justifyContent={"center"}>
      {isLoading ? (
        // <CardContent className="flex justify-center items-center h-40">
        <Box display={"flex"} justifyContent={"center"}>
          <CircularProgress sx={{ color: "#F8F9FA" }} />
        </Box>
      ) : (
        // </CardContent>
        <Stack flexDirection={"column"} justifyContent={"center"} gap={2}>
          <Box
            width={50}
            height={50}
            borderRadius={2}
            bgcolor={"#ef7a7a80"}
            className="flex items-center justify-center"
          >
            <GroupIcon sx={{ color: "#FFFFFF" }} />
          </Box>
          <Box
            onClick={handleCardClick}
            className="flex flex-row items-center justify-between"
            sx={{
              cursor: "pointer",
              // borderWidth: 2,
              // borderRadius: 1,
              // padding: 2,
              // marginTop: 3,
            }}
          >
            <Box>
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
            </Box>
            <Box>
              <IconButton size="medium" onClick={handleCardClick}>
                <ChevronRight sx={{ color: "#FFFFFF", fontSize: 30 }} />
              </IconButton>
            </Box>
          </Box>
        </Stack>
      )}
    </Box>
  );
  // );
};

export { CustomerDetailsCard };
