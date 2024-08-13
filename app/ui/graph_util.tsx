"use client";
import { PieChart, BarChart } from "@mui/x-charts";
import { useState } from "react";
import { DropDown } from "./drop_down";

const Pie = (values: any[]) => {
  return (
    <PieChart
      width={500}
      height={300}
      margin={{ top: 100, left: 100, bottom: 100, right: 100 }}
      sx={{
        flex: 1,
        borderWidth: 2,
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
  );
};

const Bar = (values: any[]) => {
  return (
    <BarChart
      dataset={values}
      xAxis={[{ scaleType: "band", dataKey: "label" }]}
      series={[{ dataKey: "value" }]}
      width={500}
      height={350}
    />
  );
};

const HorizontalBar = (values: any[]) => {
  return (
    <BarChart
      dataset={values}
      yAxis={[{ scaleType: "band", dataKey: "label" }]}
      series={[{ dataKey: "value" }]}
      layout="horizontal"
      grid={{ vertical: true }}
      width={500}
      height={350}
    />
  );
};

const SingleChartView = ({ values }: { values: any[] }) => {
  const [chartType, setChartType] = useState("pie");
  const [charts, setCharts] = useState([
    { id: 1, type: "pie", label: "Pie" },
    { id: 2, type: "bar", label: "Bar" },
    { id: 3, type: "hbar", label: "HBar" },
  ]);

  const renderChart = () => {
    if (chartType == "bar") {
      return Bar(values);
    } else if (chartType == "hbar") {
      return HorizontalBar(values);
    }
    return Pie(values);
  };
  return (
    <div>
      <DropDown
        label="Select Chart"
        displayFieldKey="label"
        valueFieldKey={null}
        selectionValues={charts}
        helperText={""}
        onSelection={(_selection) => {
          setChartType(_selection.type);
        }}
      />
      {renderChart()}
    </div>
  );
};

export { SingleChartView };
