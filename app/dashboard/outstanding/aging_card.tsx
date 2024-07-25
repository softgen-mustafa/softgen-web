"use client";
import { numericToString } from "@/app/services/Local/helper";
import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import { ResponsiveDiv } from "@/app/ui/custom_div";
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

interface AgingData {
  title: string;
  code: string;
  amount: number;
}

interface AgingCardProps {
  data: AgingData;
  onPress: () => void;
}

const AgingCard: React.FC<AgingCardProps> = ({ data, onPress }) => {
  return (
    <Card
      className="shadow-md bg-gray-50 mt-1 mb-1"
      sx={{
        minWidth: 200,
        marginRight: 2,
        borderLeftWidth: 8,
        borderLeftColor: inspiredPalette.Pumpkin,
        height: 80,
      }}
      onClick={() => {
        onPress();
      }}
    >
      <CardContent>
        <Typography component="div" className="text-lg">
          {data.title}
        </Typography>
        <Typography component="div" className="text-sm">
          {numericToString(data.amount)}
        </Typography>
      </CardContent>
    </Card>
  );
};

const AgingView = ({ billType }: { billType: string }) => {
  const router = useRouter();
  const [data, setData] = useState<AgingData[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [billType]);

  const loadData = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/bill/get/aging-overview?groupType=${billType}`;
      let response = await getAsync(url);
      let entries = response.map((entry: any, index: number) => {
        let newEntry: AgingData = {
          title: entry.title,
          code: entry.code,
          amount: entry.amount,
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

  return (
    <div className="flex flex-col">
      <PieChart
        height={300}
        width={300}
        margin={{ top: 100, left: 100, bottom: 100, right: 100 }}
        sx={{
          borderWidth: 2,
          borderRadius: 4,
          marginBottom: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
        slotProps={{
          legend: {
            hidden: true,
          },
        }}
        series={[
          {
            data: data.map((entry: AgingData) => {
              return {
                label: entry.title,
                value: entry.amount,
              };
            }),
            innerRadius: 20,
            outerRadius: 100,
            paddingAngle: 2,
            cornerRadius: 8,
            startAngle: 0,
            endAngle: 360,
            // cx: 150,
            // cy: 150,
          },
        ]}
      />
      <div
        style={{ overflowX: "scroll", maxHeight: "250px" }}
        className="flex flex-row"
      >
        {data.map((entry, index) => {
          return (
            <AgingCard
              key={index}
              data={entry}
              onPress={() => {
                localStorage.setItem("party_filter_value", entry.code);
                localStorage.setItem("party_view_type", "aging");
                localStorage.setItem("party_bill_type", billType);
                router.push("/dashboard/outstanding/party-search");
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export { AgingView };
