"use client";

import React, { useEffect, useState } from "react";
import {
  PeriodicTable,
  TableColumn,
} from "@/app/ui/periodic_table/period_table";
import { ApiProps } from "@/app/ui/periodic_table/period_table";
import { getSgBizBaseUrl , postAsync} from "@/app/services/rest_services";
import { convertToDate } from "@/app/services/Local/helper"

const DateWiseFollowup = () => {
  const [refresh, triggerRefresh] = useState(false);


  const columns: any[] = [
    {
      field: "Created",
      headerName: "Creation Date",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "LastUpdated",
      headerName: "Last Update Date",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "PartyName",
      headerName: "Party Name",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "Description",
      headerName: "Notes",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
  ];

  const onApi = async (props: ApiProps) => {
      try {
          let url = `${getSgBizBaseUrl()}/os/followup/get/day-wise`
          let requestBody = {
              "StartDateStr": "01-01-2024",
              "EndDateStr": "01-01-2025",
          }
          let response = await postAsync(url, requestBody)
          //alert(JSON.stringify(response))
          let values =  response.Data.map((entry: any) => {
              return {
                  ...entry,
                  Created: convertToDate(entry.Created),
                  LastUpdated: convertToDate(entry.LastUpdated),
              }
          });
          return values;

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

export { DateWiseFollowup };
