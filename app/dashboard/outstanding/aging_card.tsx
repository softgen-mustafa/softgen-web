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
      sx={{ minWidth: 200, marginBottom: 2,
        borderLeftWidth: 10,
        borderLeftColor: inspiredPalette.Pumpkin,
       }}
      onClick={() => {
        onPress();
      }}
    >
      <CardContent>
        <Typography component="div" className="text-xl">
          {data.title}
        </Typography>
        <Typography component="div" className="text-l">
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
    <ResponsiveDiv>
      <Grid
        sx={{ overflowY: "scroll", maxHeight: "250px" }}
        spacing={2}
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
      </Grid>
        <PieChart
          height={300}
          sx={{
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
              innerRadius: 30,
              outerRadius: 100,
              paddingAngle: 5,
              cornerRadius: 5,
              startAngle: 0,
              endAngle: 360,
              // cx: 150,
              // cy: 150,
            },
          ]}
        />
    </ResponsiveDiv>
  );
};

export { AgingView };
