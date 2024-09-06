"use client";
import { PieChart, BarChart } from "@mui/x-charts";
import { useState } from "react";
import { DropDown } from "./drop_down";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import MenuIcon from "@mui/icons-material/MoreVertOutlined";
import CircleIcon from "@mui/icons-material/Circle";

const graphColors: string[] = [
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
  "#a6cee3",
  "#1f78b4",
  "#b2df8a",
  "#33a02c",
  "#fb9a99",
  "#e31a1c",
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

const Legends = ({ data }: { data: any[] }) => {
  return (
    <Stack
      mt={3}
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      flexWrap={"wrap"}
      gap={2}
    >
      {data.map((item, index) => (
        <Stack
          key={index}
          flexDirection={"row"}
          alignItems={"center"}
          gap={0.3}
        >
          <CircleIcon sx={{ color: graphColors[index % graphColors.length] }} />
          <Typography>{item.label}</Typography>
        </Stack>
      ))}
    </Stack>
  );
};

const Pie = (values: any[], title: string) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <PieChart
        width={360}
        height={300}
        margin={{ top: 0, left: 100, bottom: 0, right: 100 }}
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
            direction: "row",
            position: {
              vertical: "bottom",
              horizontal: "middle",
            },
          },
        }}
        series={[
          {
            data: values.map((item, index) => ({
              ...item,
              color: graphColors[index % graphColors.length],
            })),
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
      <Divider orientation="horizontal" sx={{ width: "100%" }} />
      <Legends data={values} />
    </Box>
  );
};

const Bar = (values: any[], title: string) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <BarChart
        borderRadius={10}
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
      <Divider orientation="horizontal" sx={{ width: "100%" }} />
      <Legends data={values} />
    </Box>
  );
};

const HorizontalBar = (values: any[], title: string) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
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
        borderRadius={10}
      />
      <Divider orientation="horizontal" sx={{ width: "100%" }} />
      <Legends data={values} />
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
    <Box className="overflow-x-auto">
      <Stack flexDirection={"row"} justifyContent={"flex-end"}>
        <IconButton
          id="menu-item"
          aria-controls={open ? "demo-customized-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
        >
          <MenuIcon />
        </IconButton>
        <Menu
          id="menu"
          anchorEl={anchorEl}
          MenuListProps={{
            "aria-labelledby": "menu-item",
          }}
          open={open}
          onClose={handleClose}
        >
          {charts.map((_chart) => (
            <MenuItem
              key={_chart.id}
              onClick={() => {
                setChartType(_chart.type);
                handleClose();
              }}
            >
              {_chart.label}
            </MenuItem>
          ))}
        </Menu>
      </Stack>
      <Box my={0}>{renderChart()}</Box>
    </Box>
  );
};

export { SingleChartView };
