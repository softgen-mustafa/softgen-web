"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
  Box,
} from "@mui/material";
import { Inventory2TwoTone as Icon } from "@mui/icons-material";
import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import { convertToDecimal } from "@/app/services/Local/helper";
import { useRouter } from "next/navigation";
interface InventoryDetails {
  fastMoving?: { name: string; value: number; amount: number };
  slowMoving?: { name: string; value: number; amount: number };
  deadStock?: { name: string; value: number; amount: number };
  totalAmount: number;
}

interface MovementEntry {
  movementType: string;
  totalItems: number;
  totalAmount: number;
}

interface OverviewResponse {
  total_amount: number;
  total_items_restock: number;
  total_items: number;
}

const InventoryCard = ({}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState<InventoryDetails>({ totalAmount: 0 });
  const router = useRouter();
  useEffect(() => {
    inventoryDashboardApi();
  }, []);

  const inventoryDashboardApi = async () => {
    try {
      setIsLoading(true);
      const url = `${getBmrmBaseUrl()}/stock-item/get/movement-overview`;
      const response: MovementEntry[] = await getAsync(url);

      if (!response || response.length < 1) {
        throw new Error("Invalid response");
      }

      const totalStockCount = response.reduce(
        (acc, cur) => acc + cur.totalItems,
        0,
      );
      const unitValue = totalStockCount / 10;

      const movementValues = response.map((entry: MovementEntry) => ({
        name: entry.movementType,
        value: (entry.totalItems / unitValue) * 10,
        amount: entry.totalItems,
      }));

      const overviewUrl = `${getBmrmBaseUrl()}/inventory/overview`;
      const overviewResponse: OverviewResponse = await getAsync(overviewUrl);

      setDetails({
        fastMoving: movementValues.find((entry) => entry.name === "Fast"),
        slowMoving: movementValues.find((entry) => entry.name === "Slow"),
        deadStock: movementValues.find((entry) => entry.name === "Dead"),
        totalAmount: overviewResponse?.total_amount || 0,
      });
    } catch (error) {
      console.error("Could not load details", error);
    } finally {
      setIsLoading(false);
    }
  };
  const navigateToInventoryOverview = (movementCycle: string) => {
    router.push("/dashboard/Inventory");
    console.log(`Navigating to ${movementCycle} inventory overview`);
  };

  return (
    <Box>
      <div>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="h6" className="font-semibold mb-3">
              {"Inventory"}
            </Typography>
            <Grid container spacing={2}>
              {[
                {
                  type: "fast",
                  label: "Fast Moving",
                  icon: <Icon />,
                  value: details.fastMoving?.value,
                },
                {
                  type: "slow",
                  label: "Slow Moving",
                  icon: <Icon />,
                  value: details.slowMoving?.value,
                },
                {
                  type: "dead",
                  label: "Dead-Stock",
                  icon: <Icon />,
                  value: details.deadStock?.value,
                },
                {
                  type: "all",
                  label: "Total Value",
                  icon: <Icon />,
                  value: details.totalAmount,
                },
              ].map((item) => (
                <Grid item xs={12} key={item.type}>
                  <Card
                    className="bg-green-800 text-white rounded-lg cursor-pointer"
                    onClick={() => navigateToInventoryOverview(item.type)}
                  >
                    <CardContent>
                      <Typography
                        variant="subtitle2"
                        className="font-bold text-center mb-2"
                      >
                        {item.label}
                      </Typography>
                      <div className="flex justify-center items-center">
                        <IconButton size="small" className="text-white mr-1">
                          {item.icon}
                        </IconButton>
                        <Typography variant="h6" className="font-bold">
                          {convertToDecimal(item.value || 0)}
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </div>
    </Box>
  );
};

export { InventoryCard };
