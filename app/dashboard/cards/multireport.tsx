"use client";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Icon } from '@mui/material'; // Assuming you're using MUI icons

const MultiReport = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if in mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Detect mobile view
    };

    // Initialize mobile check
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box className="bg-gradient-to-r from-transparent min-h- to-transparent">
      <Box
        ref={containerRef}
        className={`grid grid-cols-2 gap-4 overflow-hidden  md:grid-cols-2 lg:grid-cols-4`}
      >
        {/* Card 1 - Total Value */}
        <Card className="bg-white text-black shadow-2xl border border-gray-300 rounded-2xl transition-transform duration-300 transform hover:scale-105">
          <CardContent>
            <div className="flex items-center">
              <Icon className="mr-2">attach_money</Icon>
              <Typography variant="h6" className="font-semibold">
                Total Value
              </Typography>
            </div>
            <Typography variant="h4" className="font-bold">
              $50,000
            </Typography>
            <Typography variant="body2" className="text-gray-700 mt-1">
              Increased by 10% from last month
            </Typography>
          </CardContent>
        </Card>

        {/* Card 2 - Stock Market */}
        <Card className="bg-white text-black shadow-2xl border border-gray-300 rounded-2xl transition-transform duration-300 transform hover:scale-105">
          <CardContent>
            <div className="flex items-center">
              <Icon className="mr-2">trending_up</Icon>
              <Typography variant="h6" className="font-semibold">
                Stock Market
              </Typography>
            </div>
            <Typography variant="h4" className="font-bold">
              +5.7%
            </Typography>
            <Typography variant="body2" className="text-gray-700 mt-1">
              Market trending upward
            </Typography>
          </CardContent>
        </Card>

        {/* Card 3 - Revenue */}
        <Card className="bg-white text-black shadow-2xl border border-gray-300 rounded-2xl transition-transform duration-300 transform hover:scale-105">
          <CardContent>
            <div className="flex items-center">
              <Icon className="mr-2">monetization_on</Icon>
              <Typography variant="h6" className="font-semibold">
                Revenue
              </Typography>
            </div>
            <Typography variant="h4" className="font-bold">
              $120,000
            </Typography>
            <Typography variant="body2" className="text-gray-700 mt-1">
              Increased by 15% year-over-year
            </Typography>
          </CardContent>
        </Card>

        {/* Card 4 - Expenses */}
        <Card className="bg-white text-black shadow-2xl border border-gray-300 rounded-2xl transition-transform duration-300 transform hover:scale-105">
          <CardContent>
            <div className="flex items-center">
              <Icon className="mr-2">shopping_cart</Icon>
              <Typography variant="h6" className="font-semibold">
                Expenses
              </Typography>
            </div>
            <Typography variant="h4" className="font-bold">
              $45,000
            </Typography>
            <Typography variant="body2" className="text-gray-700 mt-1">
              Maintaining steady expenses
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export { MultiReport };
