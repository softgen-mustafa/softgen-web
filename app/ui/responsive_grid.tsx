"use client";

import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import { ReactNode } from "react";
import { types } from "util";
import { DropDown } from "./drop_down";

interface GridConfig {
  type: string;
  view?: JSX.Element | null;
  children: GridConfig[];
  className?: string;
}

interface CardViewProps {
  children: ReactNode;
  className?: string;
  title?: string;
  actions?: JSX.Element[];
}

const CardView: React.FC<CardViewProps> = ({
  children,
  className,
  title,
  actions,
}) => {
  return (
    <Card className={`h-full shadow-2xl p-3 rounded-3xl ${className}`}>
      {title != null && title.length > 0 && (
        <CardHeader title={title} className="" />
      )}
      <CardContent className={`flex flex-col `}>{children}</CardContent>
      {actions != null && actions.length > 0 && (
        <CardActions className="flex flex-row justify-between items-center">
          {actions.map((entry: any, index: number) => {
            return entry;
          })}
        </CardActions>
      )}
    </Card>
  );
};

const RenderGrid = (gridItems: GridConfig[]) => {
  if (gridItems.length < 1) {
    return <div></div>;
  }

  return gridItems.map((item: GridConfig, index: number) => {
    let style = "";
    if (item.className != null) {
      style += item.className;
    }
    if (item.type == "item") {
      style += "h-auto p-2";
    }

    let lastItemScale =
      gridItems.length % 2 != 0 && index == gridItems.length - 1 ? 12 : 6;

    return (
      <Grid
        key={index}
        className={style}
        xs={12}
        sm={lastItemScale}
        md={lastItemScale}
        lg={lastItemScale}
        xl={lastItemScale}
        container={item.type == "container"}
        item={item.type == "item"}
      >
        {item.view != null && item.view}
        {item.children.length > 0 && RenderGrid(item.children)}
      </Grid>
    );
  });
};

export { RenderGrid, CardView };
export type { GridConfig };
