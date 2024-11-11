"use client";
import { PieChart, BarChart, LineChart } from "@mui/x-charts";
import { useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/MoreVertOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import { appThemes } from "../theme";
import Cookies from "js-cookie";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

const Legends = ({ data }: { data: any[] }) => {
  let currentTheme =
    appThemes.find((th: any) => th.code == Cookies.get("theme")) ??
    appThemes[0];

  return (
    <Stack
      mt={3}
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      flexWrap={"wrap"}
      gap={3}
    >
      {data.map((item, index) => (
        <Stack
          key={index}
          flexDirection={"row"}
          alignItems={"center"}
          gap={1}
          className="transition-all transform hover:scale-105"
        >
          <CircleIcon
            sx={{
              color: currentTheme.colors[index % currentTheme.colors.length],
              fontSize: 20,
              marginTop: -2.5,
            }}
          />
          <Typography className="text-sm font-medium text-gray-700 -mt-5">
            {item.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};

const Pie = (values: any[], title: string) => {
  let currentTheme =
    appThemes.find((th: any) => th.code == Cookies.get("theme")) ??
    appThemes[0];

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <PieChart
        width={460}
        height={400}
        sx={{
          flex: 1,
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
              color: currentTheme.colors[index % currentTheme.colors.length],
            })),
            innerRadius: 0,
            outerRadius: 120,
            paddingAngle: 1,
            cornerRadius: 1,
            startAngle: 0,
            endAngle: 360,
          },
        ]}
      />
      <Divider orientation="horizontal" sx={{ width: "100%", my: 2 }} />
      <Legends data={values} />
    </Box>
  );
};

const Bar = (values: any[], title: string) => {
  let currentTheme =
    appThemes.find((th: any) => th.code == Cookies.get("theme")) ??
    appThemes[0];

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
              colors: currentTheme.colors,
            },
          },
        ]}
        series={[{ dataKey: "value" }]}
        width={600}
        height={450}
        grid={{ vertical: true, horizontal: true }}
        margin={{ left: 60, right: 20, top: 20, bottom: 50 }}
        sx={{
          "& .MuiBar-root": {
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              opacity: 0.8,
            },
          },
        }}
      />
      <Divider orientation="horizontal" sx={{ width: "100%", my: 2 }} />
      <Legends data={values} />
    </Box>
  );
};

const HorizontalBar = (values: any[], title: string) => {
  let currentTheme =
    appThemes.find((th: any) => th.code == Cookies.get("theme")) ??
    appThemes[0];

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
              colors: currentTheme.colors,
            },
          },
        ]}
        series={[{ dataKey: "value" }]}
        layout="horizontal"
        width={600}
        height={350}
        borderRadius={10}
        grid={{ vertical: true, horizontal: true }}
        margin={{ left: 100, right: 20, top: 20, bottom: 50 }}
        sx={{
          "& .MuiBar-root": {
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              opacity: 0.8,
            },
          },
        }}
      />
      <Divider orientation="horizontal" sx={{ width: "100%", my: 2 }} />
      <Legends data={values} />
    </Box>
  );
};

const Line = (values: any[], title: string) => {
  let currentTheme =
    appThemes.find((th: any) => th.code == Cookies.get("theme")) ??
    appThemes[0];

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <LineChart
        series={[
          {
            data: values.map((item) => item.value),
          },
        ]}
        xAxis={[
          {
            scaleType: "band",
            data: values.map((item) => item.label),
          },
        ]}
        width={600}
        height={400}
        margin={{ left: 100, right: 20, top: 20, bottom: 50 }}
        colors={currentTheme.colors}
        grid={{ vertical: true, horizontal: true }}
        sx={{
          "& .MuiLine-root": {
            strokeWidth: 2.5,
          },
        }}
      />
      <Divider
        orientation="horizontal"
        sx={{
          width: "100%",
        }}
      />
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

  const exportAsCSV = (data: any[], title: string) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["label,value"]
        .concat(data.map((item) => `${item.label},${item.value}`).join("\n"))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [charts, setCharts] = useState([
    { id: 1, type: "pie", label: "Pie" },
    { id: 2, type: "bar", label: "Bar" },
    { id: 3, type: "hbar", label: "HBar" },
    { id: 4, type: "line", label: "Line" },
  ]);

  const renderChart = () => {
    if (chartType === "bar") {
      return Bar(values, title);
    }
    if (chartType === "hbar") {
      return HorizontalBar(values, title);
    }
    if (chartType === "line") {
      return Line(values, title);
    }
    return Pie(values, title);
  };

  const chartIndex = (data: any) => {
    return data.type === defaultChart;
  };

  return (
    <Box
      sx={{
        minWidth: "600px",
        maxWidth: "100%",
        overflowX: "auto",
      }}
    >
      <Stack flexDirection={"row"} justifyContent={"flex-end"}>
        <IconButton
          id="menu-item"
          aria-controls={open ? "demo-customized-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          className="transition-transform transform hover:rotate-90 duration-500"
        >
          <MenuIcon />
        </IconButton>
        <IconButton
          aria-label="Export as CSV"
          onClick={() => exportAsCSV(values, title)}
          className="transition-transform transform hover:translate-y-1 duration-300"
        >
          <FileDownloadOutlinedIcon />
        </IconButton>
        <Menu
          id="menu"
          anchorEl={anchorEl}
          MenuListProps={{
            "aria-labelledby": "menu-item",
          }}
          open={open}
          onClose={handleClose}
          sx={{
            "& .MuiPaper-root": {
              borderRadius: "10px",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.05)",
            },
          }}
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
      <Box>{renderChart()}</Box>
    </Box>
  );
};

export { SingleChartView };
