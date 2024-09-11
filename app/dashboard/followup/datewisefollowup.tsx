"use client";

import React, { useState } from "react";
import {
  PeriodicTable,
  TableColumn,
} from "@/app/ui/periodic_table/period_table";
import { GridColDef } from "@mui/x-data-grid";

const DateWiseFollowup = () => {
  const data = [
    {
      PartyName: "John Doe",
      Bill: 250.75,
      Notes: "Urgent payment required",
      PersonInCharge: "Alice Smith",
    },
    {
      PartyName: "Jane Smith",
      Bill: 180.5,
      Notes: "Follow up next week",
      PersonInCharge: "Bob Johnson",
    },
    {
      PartyName: "Acme Corp",
      Bill: 3200.0,
      Notes: "Invoice sent, waiting for approval",
      PersonInCharge: "Carol White",
    },
    {
      PartyName: "Global Inc.",
      Bill: 1125.25,
      Notes: "Partial payment received",
      PersonInCharge: "David Brown",
    },
    {
      PartyName: "Tech Solutions",
      Bill: 750.0,
      Notes: "No issues reported",
      PersonInCharge: "Eve Davis",
    },
  ];

  const [refresh, triggerRefresh] = useState(false);

  const columns: GridColDef<any[number]>[] = [
    {
      field: "PartyName",
      headerName: "Party Name",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "Bill",
      headerName: "Bill",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "Notes",
      headerName: "Notes",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "PersonInCharge",
      headerName: "Person in Charge",
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

export default DateWiseFollowup;
