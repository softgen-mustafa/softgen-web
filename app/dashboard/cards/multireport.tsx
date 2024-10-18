"use client";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const MultiReport = () => {
  const router = useRouter();
  const [data, setData] = useState<[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollContainer = containerRef.current;

    if (scrollContainer) {
      const scrollStep = 1;
      const intervalId = setInterval(() => {
        scrollContainer.scrollLeft += scrollStep;

        if (
          scrollContainer.scrollLeft >=
          scrollContainer.scrollWidth - scrollContainer.clientWidth
        ) {
          scrollContainer.scrollLeft = 0;
        }
      }, 15);

      return () => clearInterval(intervalId);
    }
  }, []);
  return (
    <Box className="p-4 overflow-visible bg-gradient-to-r bg-transparent">
      <Box
        ref={containerRef}
        className="flex flex-row gap-4 overflow-x-auto hide-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Card 1 - Total Value */}
        <Card className="bg-white text-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg min-w-[250px] flex-shrink-0">
          <CardContent>
            <Typography variant="h6" className="mb-2 font-semibold">
              Total Value
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              $50,000
            </Typography>
            <Typography variant="body2" className="text-gray-500 mt-1">
              Increased by 10% from last month
            </Typography>
          </CardContent>
        </Card>

        {/* Card 2 - Stock Market */}
        <Card className="bg-white text-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg min-w-[250px] flex-shrink-0">
          <CardContent>
            <Typography variant="h6" className="mb-2 font-semibold">
              Stock Market
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              +5.7% Today
            </Typography>
            <Typography variant="body2" className="text-gray-500 mt-1">
              Market trending upward
            </Typography>
          </CardContent>
        </Card>

        {/* Card 3 - Revenue */}
        <Card className="bg-white text-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg min-w-[250px] flex-shrink-0">
          <CardContent>
            <Typography variant="h6" className="mb-2 font-semibold">
              Revenue
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              $120,000
            </Typography>
            <Typography variant="body2" className="text-gray-500 mt-1">
              Increased by 15% year-over-year
            </Typography>
          </CardContent>
        </Card>

        {/* Card 4 - Expenses */}
        <Card className="bg-white text-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg min-w-[250px] flex-shrink-0">
          <CardContent>
            <Typography variant="h6" className="mb-2 font-semibold">
              Expenses
            </Typography>
            <Typography variant="body1" className="text-gray-600">
              $45,000
            </Typography>
            <Typography variant="body2" className="text-gray-500 mt-1">
              Maintaining steady expenses
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export { MultiReport };
