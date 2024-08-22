"use client";
import { PieChart, BarChart } from "@mui/x-charts";
import { useState } from "react";
import { DropDown } from "./drop_down";
import { Box, Chip, Stack, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";

const graphColors: string[] = [
  "#a6cee3",
  "#1f78b4",
  "#b2df8a",
  "#33a02c",
  "#fb9a99",
  "#e31a1c",
  "#fdbf6f",
  "#ff7f00",
  "#cab2d6",
  "#6a3d9a",
  "#ffff99",
  "#b15928",
  "#fbb4ae",
  "#b3cde3",
  "#ccebc5",
  "#decbe4",
  "#fed9a6",
  "#ffffcc",
  "#e5d8bd",
  "#fddaec",
  "#f2f2f2",
  "#b3e2cd",
  "#fdcdac",
  "#cbd5e8",
  "#f4cae4",
  "#e6f5c9",
  "#fff2ae",
  "#f1e2cc",
  "#cccccc",
  "#e41a1c",
  "#377eb8",
  "#4daf4a",
  "#984ea3",
  "#ff7f00",
  "#ffff33",
  "#a65628",
  "#f781bf",
  "#999999",
];

const Pie = (values: any[], title: string) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <PieChart
        width={360}
        height={300}
        margin={{ top: 100, left: 100, bottom: 100, right: 100 }}
        sx={{
          flex: 1,
          // borderWidth: 2,
          borderRadius: 2,
          marginBottom: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
        slotProps={{
          legend: {
            hidden: true,
            position: {
              horizontal: "right",
              vertical: "bottom",
            },
          },
        }}
        series={[
          {
            data: values,
            innerRadius: 30,
            outerRadius: 120,
            paddingAngle: 1,
            cornerRadius: 3,
            startAngle: 0,
            endAngle: 360,
            // cx: 150,
            // cy: 150,
          },
        ]}
      />
    </Box>
  );
};

const Bar = (values: any[], title: string) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <BarChart
        borderRadius={20}
        dataset={values}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "label",
            colorMap: {
              type: "ordinal",
              colors: graphColors,
            },
          },
        ]}
        series={[{ dataKey: "value" }]}
        width={360}
        height={350}
      />
    </Box>
  );
};

const HorizontalBar = (values: any[], title: string) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <BarChart
        dataset={values}
        yAxis={[
          {
            scaleType: "band",
            dataKey: "label",
            colorMap: {
              type: "ordinal",
              colors: graphColors,
            },
          },
        ]}
        series={[{ dataKey: "value" }]}
        layout="horizontal"
        grid={{ vertical: true }}
        width={360}
        height={350}
        borderRadius={15}
      />
    </Box>
  );
};

const SingleChartView = ({
  values,
  defaultChart,
  title,
}: {
  values: any[];
  defaultChart: string;
  title: string;
}) => {
  const [chartType, setChartType] = useState(defaultChart);
  const [charts, setCharts] = useState([
    { id: 1, type: "pie", label: "Pie" },
    { id: 2, type: "bar", label: "Bar" },
    { id: 3, type: "hbar", label: "HBar" },
  ]);

  const renderChart = () => {
    if (chartType == "bar") {
      return Bar(values, title);
    }
    if (chartType == "hbar") {
      return HorizontalBar(values, title);
    }
    return Pie(values, title);
  };

  const chartIndex = (data: any) => {
    return data.type === defaultChart;
  };

  return (
    <div className="overflow-x-auto">
      <Box my={2}>
        {renderChart()}
        <Typography className="font-medium text-sm text-center mb-1">
          Select Chart
        </Typography>
        <Stack flexDirection="row" justifyContent={"center"} gap={1}>
          {charts.map((_chart) => (
            <Chip
              key={_chart.id}
              size="medium"
              label={_chart.label}
              variant={chartType === _chart.type ? "filled" : "outlined"}
              color={chartType === _chart.type ? "primary" : "default"}
              onClick={() => setChartType(_chart.type)}
              sx={{ px: 2 }}
            />
          ))}
        </Stack>
      </Box>
    </div>
  );
};

export { SingleChartView };
