"use client";

import {
  PeriodicTable,
  TableColumn,
} from "@/app/ui/periodic_table/period_table";
import { GridColDef } from "@mui/x-data-grid";
import React, { useState } from "react";
import { ApiProps } from "@/app/ui/periodic_table/period_table";
import { getSgBizBaseUrl , getAsync} from "@/app/services/rest_services";


const PartyFollowup = () => {
  const [refresh, triggerRefresh] = useState(false);

  const columns: GridColDef<any[number]>[] = [
    {
      field: "Name",
      headerName: "Party Name",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "TotalCount",
      headerName: "Total FollowUps",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "PendingCount",
      headerName: "Total Pending",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "ScheduledCount",
      headerName: "Scheduled Count",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "CompleteCount",
      headerName: "Completed Count",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
  ];

  const onApi = async (props: ApiProps) => {
      try {
          let url = `${getSgBizBaseUrl()}/os/followup/get/party-wise`
          let response = await getAsync(url)
          return response.Data;

      } catch {
          return []
      }
  }

  return (
      <PeriodicTable
        useSearch={false}
        reload={refresh}
        columns={columns.map((col: any) => {
          let column: TableColumn = {
            header: col.headerName,
            field: col.field,
            type: "text",
            pinned: false,
            hideable: col.hideable,
            rows: [],
          };
          return column;
        })}
        onApi={onApi}
      />
  );
};

export { PartyFollowup };
