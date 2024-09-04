"use client";
import { numericToString } from "@/app/services/Local/helper";
import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import { inspiredPalette } from "@/app/ui/theme";
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FeatureControl } from "@/app/components/featurepermission/permission_helper";
import { SingleChartView } from "@/app/ui/graph_util";
interface AgingData {
  title: string;
  code: string;
  amount: number;
  currency: string;
}

interface AgingCardProps {
  data: AgingData;
  onPress: () => void;
}

const AgingCard: React.FC<AgingCardProps> = ({ data, onPress }) => {
  return (
    <Box
      className="shadow-sm bg-gray-50 mt-1 mb-1 p-2 justify-center items-center"
      sx={{
        minWidth: 180,
        marginRight: 2,
        borderWidth: 2,
        height: 70,
        borderRadius: 2,
      }}
      onClick={() => {
        onPress();
      }}
    >
      <Typography
        component="div"
        className="text-xl font-semibold text-red-500"
      >
        {data.currency} {numericToString(data.amount)}
      </Typography>
      <Typography component="div" className="text-md">
        {data.title}
      </Typography>
    </Box>
  );
};

const AgingView = ({
  billType,
  title,
  companyId,
}: {
  billType: string;
  title: string;
  companyId: string;
}) => {
  const router = useRouter();
  const [data, setData] = useState<AgingData[]>([]);
  const [open, setOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    checkPermissionAndLoadData();
  }, [billType, companyId]);

  const checkPermissionAndLoadData = async () => {
    // const permission = await FeatureControl("AgingOutstandingCard");
    // setHasPermission(permission);
    // if (permission) {
    loadData();
    // }
  };

  const loadData = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/bill/get/aging-overview?groupType=${billType}`;
      let response = await getAsync(url);
      let entries = response.map((entry: any, index: number) => {
        let newEntry: AgingData = {
          title: entry.title,
          code: entry.code,
          amount: entry.amount,
          currency: entry.currency ?? "₹",
        };
        return newEntry;
      });
      let agingDetails = entries.sort((a: any, b: any) => {
        const name1 = a.title.toLowerCase();
        const name2 = b.title.toLowerCase();

        if (name1 < name2) {
          return -1;
        }
        if (name1 > name2) {
          return 1;
        }
        return 0;
      });
      setData(agingDetails);
    } catch {
      setOpen(true);
    }
  };

  // if (hasPermission === false) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-full">
  //       <Typography className="text-2xl font-bold flex items-center justify-center flex-1 pl-2 pr-2">
  //         Get the Premium For this Service Or Contact Admin - 7977662924
  //       </Typography>
  //     </div>
  //   );
  // }

  return (
    <Box className="p-0">
      <SingleChartView
        values={data.map((entry: AgingData) => {
          return {
            label: entry.title,
            value: entry.amount,
          };
        })}
        defaultChart="pie"
        title={title}
      />
    </Box>
  );
};

export { AgingView };
