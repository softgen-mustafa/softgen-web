"use client";

import {
  PeriodicTable,
  TableColumn,
} from "@/app/ui/periodic_table/period_table";
import { GridColDef } from "@mui/x-data-grid";
import React, { useState } from "react";

const TeamFollowup = () => {
  const data = [
    {
      PartyInCharge: "Alice Smith",
      TotalParties: 5,
      TotalFollowups: 15,
      FollowUpPendings: 3,
      FollowUpSchedule: "2024-09-15",
      FollowUpDone: 12,
    },
    {
      PartyInCharge: "Bob Johnson",
      TotalParties: 8,
      TotalFollowups: 20,
      FollowUpPendings: 5,
      FollowUpSchedule: "2024-09-18",
      FollowUpDone: 15,
    },
    {
      PartyInCharge: "Carol White",
      TotalParties: 10,
      TotalFollowups: 30,
      FollowUpPendings: 8,
      FollowUpSchedule: "2024-09-20",
      FollowUpDone: 22,
    },
    {
      PartyInCharge: "David Brown",
      TotalParties: 7,
      TotalFollowups: 18,
      FollowUpPendings: 2,
      FollowUpSchedule: "2024-09-14",
      FollowUpDone: 16,
    },
    {
      PartyInCharge: "Eve Davis",
      TotalParties: 6,
      TotalFollowups: 12,
      FollowUpPendings: 1,
      FollowUpSchedule: "2024-09-17",
      FollowUpDone: 11,
    },
  ];

  const [refresh, triggerrefresh] = useState(false);

  const columns: GridColDef<any>[] = [
    {
      field: "PartyInCharge",
      headerName: "Party in Charge",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "TotalParties",
      headerName: "Total Parties",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "TotalFollowups",
      headerName: "Total Follow Up",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "FollowUpPendings",
      headerName: "Pending Follow Up",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "FollowUpSchedule",
      headerName: "Schedule Follow Up",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "FollowUpDone",
      headerName: "Follow Up Done",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
  ];

  return (
    <div>
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
        rows={data}
      />
    </div>
  );
};

export default TeamFollowup;
