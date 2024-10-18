"use client";
import { CardContent, CardHeader, Typography } from "@mui/material";
import {
  FeatureControl,
  PermissionKeys,
} from "../components/featurepermission/permission_helper";
import React, { useEffect, useState } from "react";
import { ReactNode } from "react";

interface CardViewProps {
  children: ReactNode;
  title?: string;
  permissionCode?: PermissionKeys;
}

const GridCardView: React.FC<CardViewProps> = ({
  children,
  title,
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
    <div>
      {title != null && title.length > 0 && (
        <CardHeader
          title={title}
          titleTypographyProps={{
            className: "text-xl mb-2 ",
            variant: "h5",
          }}
        />
      )}
      {!hasAccess && (
        <Typography>
          Check Your Internet Access Or This Feature is not included in your
          Subscription package. Kindly get the Premium package to utilize this
          feature.
        </Typography>
      )}

      {hasAccess && (
        <CardContent className={`flex flex-col `}>{children}</CardContent>
      )}
    </div>
  );
};

export default GridCardView;
