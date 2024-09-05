"use client";

import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import {
  FeatureControl,
  PermissionKeys,
  Permission,
} from "@/app/components/featurepermission/permission_helper";
import { useRef } from "react";

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
  permissionCode?: PermissionKeys;
}

const CardView: React.FC<CardViewProps> = ({
  children,
  className,
  title,
  actions,
  permissionCode = null,
}) => {
  const [hasAccess, setAccess] = useState(false);

  useEffect(() => {
    checkPermission();
  }, [permissionCode]);

  const checkPermission = async () => {
    if (permissionCode === null) {
      setAccess(true);
      return;
    }
    try {
      const hasPermission = await FeatureControl(permissionCode!);
      setAccess(hasPermission);
    } catch {
      setAccess(false);
    }
  };

  return (
    <Card className={`h-full p-3 rounded-lg shadow-lg ${className}`}>
      {title != null && title.length > 0 && (
        <CardHeader title={title} className="" />
      )}
      {!hasAccess && (
        <CardContent className={`flex flex-col `}>
          <Typography>
            Check Your Internet Access Or This Feature is not included in your
            Subscription package. Kindly get the Premium package to utilize this
            feature.
          </Typography>
        </CardContent>
      )}
      {hasAccess && (
        <CardContent className={`flex flex-col `}>{children}</CardContent>
      )}
      {hasAccess && actions != null && actions.length > 0 && (
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

const Weight = {
  High: 3,
  Medium: 2,
  Low: 1,
  None: 0,
};

const GridDirection = {
  Row: "flex-row",
  Column: "flex-col",
};

const DynGrid = ({
  views,
  direction = GridDirection.Row,
}: {
  views: any[];
  direction?: string;
}) => {
  const minWidth = 290;
  return (
    <div>
      <div
        className={`p-2 w-full flex ${direction} flex-wrap gap-5 justify-stretch`}
      >
        {views.map((entry: any, index: number) => {
          let styles: any = {
            minWidth: entry.minWidth ? entry.minWidth : minWidth,
            minHeight: 200,
            maxHeight: 800,
            flexGrow: entry.weight ?? 0,
          };

          if (entry.maxWidth) {
            styles.maxWidth = entry.maxWidth;
          }
          return (
            <div className={"flex-grow"} key={index} style={styles}>
              {entry.view}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { RenderGrid, CardView, Weight, DynGrid, GridDirection };
export type { GridConfig };
