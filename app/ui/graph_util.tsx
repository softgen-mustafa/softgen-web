"use client";
import { LineChart, PieChart, BarChart } from "@mui/x-charts";
import { Button, Menu} from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import { useRef, useState } from "react";

const Pie = (values: any[]) => {
    return (
        <PieChart
        width={300}
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
}

const Bar = (values: any[]) => {
    return (
        <BarChart
        series={[{ data: values }]}
        width={500}
        height={300}
        />
    );
}

const Line = (values: any[]) => {
    return (
        <LineChart
        series={[
            {
                data: values,
            },
        ]}
        width={500}
        height={300}
        />
    );
}

const SingleChartView = ({values}: {values: any[]}) => {
    const [isMenuOpen, toggleMenu] = useState(false);
    let chartType = useRef("pie");

    const onMenuSelect = (chart: string) => {
        chartType.current = chart; 
        toggleMenu(false);
    }
    const renderChart = () => {
        if (chartType.current == "bar") {
            return Bar(values);
        } 
        if (chartType.current == "line") {
            return Line(values);
        }
        return Pie(values);
    }
    return (
        <div>
        <div className={`flex-row`}>
        <label>Current Chart</label>
        <Button onClick={() => {
            toggleMenu(!isMenuOpen)}}>
            Change Chart
        </Button>
          <Menu
        open={isMenuOpen}
        onClose={() => { toggleMenu(false)}}
      >
        <MenuItem onClick={() => onMenuSelect("pie")}>Pie</MenuItem>
        <MenuItem onClick={() => onMenuSelect("bar")}>Bar</MenuItem>
        <MenuItem onClick={() => onMenuSelect("line")}>Line</MenuItem>
      </Menu>

        </div>
        {
            renderChart()
        }
        </div>
    );
}

export { SingleChartView };
