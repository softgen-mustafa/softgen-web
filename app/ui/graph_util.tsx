"use client";
import { PieChart, BarChart } from "@mui/x-charts";
import { useState } from "react";
import { DropDown } from "./drop_down";
import { Box, Chip, Stack, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";

const Pie = (values: any[], title: string) => {
  return (
    <Box position="relative">
      <PieChart
        width={300}
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
            innerRadius: 120,
            outerRadius: 100,
            paddingAngle: 1,
            cornerRadius: 1,
            startAngle: 0,
            endAngle: 360,
            // cx: 150,
            // cy: 150,
          },
        ]}
      />
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <Typography className="text-md font-semibold">{title}</Typography>
      </Box>
    </Box>
  );
};

const Bar = (values: any[], title: string) => {
  return (
    <Box component="div" className={`flex w-full`}>
      <Typography className="text-md font-semibold text-center">
        {title}
      </Typography>
      <BarChart
        dataset={values}
        xAxis={[{ scaleType: "band", dataKey: "label" }]}
        series={[{ dataKey: "value" }]}
        width={300}
        height={350}
      />
    </Box>
  );
};

const HorizontalBar = (values: any[], title: string) => {
  return (
    <Box>
      <Typography className="text-md font-semibold text-center">
        {title}
      </Typography>
      <BarChart
        dataset={values}
        yAxis={[{ scaleType: "band", dataKey: "label" }]}
        series={[{ dataKey: "value" }]}
        layout="horizontal"
        grid={{ vertical: true }}
        width={300}
        height={350}
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
    /*{ id: 1, type: "pie", label: "Pie" },*/
    { id: 2, type: "bar", label: "Bar" },
    { id: 3, type: "hbar", label: "HBar" },
  ]);

  const renderChart = () => {
    if (chartType == "hbar") {
      return HorizontalBar(values, title);
    }
    return Bar(values, title);
    //return Pie(values, title);
  };

  const chartIndex = (data: any) => {
    return data.type === defaultChart;
  };

  return (
    <div className="overflow-x-auto">
      <Box my={2}>
        {/* <DropDown
          label="Select Chart"
          displayFieldKey="label"
          valueFieldKey={null}
          defaultSelectionIndex={charts.findIndex(chartIndex)}
          selectionValues={charts}
          helperText={""}
          onSelection={(_selection) => {
            setChartType(_selection.type);
          }}
        /> */}
        <Typography className="font-medium text-lg mb-1">
          Select Chart
        </Typography>
        <Stack flexDirection="row" gap={1}>
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
      {renderChart()}
    </div>
  );
};

export { SingleChartView };
