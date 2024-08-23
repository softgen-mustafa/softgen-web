"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  IconButton,
  Grid,
  Box,
  Container,
} from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import { useRouter } from "next/navigation";
import { PieChart } from "@mui/x-charts";
import { numericToString } from "@/app/services/Local/helper";
import { FeatureControl } from "@/app/components/featurepermission/permission_helper";
import { SingleChartView } from "@/app/ui/graph_util";
import MenuIcon from "@mui/icons-material/MoreVertOutlined";

interface OutstandingData {
  payableTitle: string;
  receivableTitle: string;
  payableAmount: number;
  receivableAmount: number;
  currency: string;
}

interface OutstandingCardProps {
  companyId: string | null;
  title: string;
}

const OutstandingCard: React.FC<OutstandingCardProps> = ({
  companyId,
  title,
}) => {
  const router = useRouter();

  const [data, setData] = useState<OutstandingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // FeatureControl("OutstandingCard").then((permission) => {
    // setHasPermission(permission);
    if (companyId) {
      fetchOutstandingData(companyId);
    }
  }, [companyId]);

  // useEffect(() => {
  //   fetchOutstandingData();
  // }, []);

  const fetchOutstandingData = async (companyId: string) => {
    try {
      setIsLoading(true);
      let url = `${getBmrmBaseUrl()}/bill/get/outstanding-overview`;
      const response = await getAsync(url);

      if (response === null || response.length < 2) {
        throw new Error("Invalid response data");
      }

      setData({
        payableTitle: response[0].name || "Payable",
        receivableTitle: response[1].name || "Receivable",
        payableAmount: response[0].closingBal,
        receivableAmount: response[1].closingBal,
        currency: response.currency || "₹",
      });
    } catch (error) {
      console.error("Error fetching outstanding data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const AmountDisplay = ({
    title,
    amount,
  }: {
    title: string;
    amount: number;
  }) => (
    <div>
      <Typography variant="subtitle2" className="text-gray-600">
        Total {title}
      </Typography>
      <Typography variant="h6" className="font-bold text-red-400">
        {data?.currency}
        {numericToString(amount)}
      </Typography>
    </div>
  );

  const handleCardClick = () => {
    router.push("/dashboard/outstanding");
  };

  const chartData = [
    {
      label: "Payable",
      value: data?.payableAmount || 0,
      color: "#FF9800",
    },
    {
      label: "Receivable",
      value: data?.receivableAmount || 0,
      color: "#F44336",
    },
  ];

  return (
    // hasPermission && (
    <div>
      {isLoading ? (
        <CardContent className="flex justify-center items-center h-40">
          <CircularProgress />
        </CardContent>
      ) : (
        // <Box onClick={handleCardClick} sx={{ cursor: "pointer" }}>
        //   <div className="p-0">
        //     {/* <Grid container spacing={2} className="mb-1">
        //       <Grid item xs={12}>
        //         <AmountDisplay
        //           title={data?.payableTitle || "Payable"}
        //           amount={data?.payableAmount || 0}
        //         />
        //       </Grid>
        //       <Grid item xs={12}>
        //         <AmountDisplay
        //           title={data?.receivableTitle || "Receivable"}
        //           amount={data?.receivableAmount || 0}
        //         />
        //       </Grid>
        //     </Grid>
        //     <br /> */}
        //     <Container className="overflow-x-auto flex">
        //       <PieChart
        //         width={300}
        //         height={300}
        //         margin={{ top: 100, left: 100, bottom: 100, right: 100 }}
        //         sx={{
        //           flex: 1,
        //           borderWidth: 2,
        //           borderRadius: 2,
        //           marginBottom: 2,
        //           justifyContent: "center",
        //           alignItems: "center",
        //         }}
        //         slotProps={{
        //           legend: {
        //             hidden: true,
        //             position: {
        //               horizontal: "right",
        //               vertical: "bottom",
        //             },
        //           },
        //         }}
        //         series={[
        //           {
        //             data: [
        //               {
        //                 label: "Payable",
        //                 value: data?.payableAmount || 0,
        //                 color: "#FF9800",
        //               },
        //               {
        //                 label: "Receivable",
        //                 value: data?.receivableAmount || 0,
        //                 color: "#F44336",
        //               },
        //             ],
        //             innerRadius: 120,
        //             outerRadius: 100,
        //             paddingAngle: 1,
        //             cornerRadius: 1,
        //             startAngle: 0,
        //             endAngle: 360,
        //             // cx: 150,
        //             // cy: 150,
        //           },
        //         ]}
        //       />
        //     </Container>
        //   </div>
        // </Box>
        <Box className="p-0">
          <SingleChartView
            values={chartData}
            defaultChart="pie"
            title={title}
          />
        </Box>
      )}
    </div>
  );
  // );
};

export { OutstandingCard };
