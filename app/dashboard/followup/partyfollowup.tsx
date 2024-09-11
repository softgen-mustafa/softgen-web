"use client";

import {
  PeriodicTable,
  TableColumn,
} from "@/app/ui/periodic_table/period_table";
import { GridColDef } from "@mui/x-data-grid";
import React, { useState } from "react";

const PartyFollowup = () => {
  const data = [
    {
      Party: "John Doe",
      TotalBills: 12,
      TotalFollowUpCount: 3,
      LastPersonInCharge: "Alice Smith",
      Amount: 1500.75,
    },
    {
      Party: "Jane Smith",
      TotalBills: 8,
      TotalFollowUpCount: 2,
      LastPersonInCharge: "Bob Johnson",
      Amount: 980.5,
    },
    {
      Party: "Acme Corp",
      TotalBills: 20,
      TotalFollowUpCount: 5,
      LastPersonInCharge: "Carol White",
      Amount: 3020.1,
    },
    {
      Party: "Global Inc.",
      TotalBills: 15,
      TotalFollowUpCount: 4,
      LastPersonInCharge: "David Brown",
      Amount: 2125.25,
    },
    {
      Party: "Tech Solutions",
      TotalBills: 9,
      TotalFollowUpCount: 1,
      LastPersonInCharge: "Eve Davis",
      Amount: 1250.0,
    },
  ];

  const [refresh, triggerRefresh] = useState(false);

  const columns: GridColDef<any[number]>[] = [
    {
      field: "Party",
      headerName: "Party",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "TotalBills",
      headerName: "Total Bills",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "TotalFollowUpCount",
      headerName: "Followup Count",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "LastPersonInCharge",
      headerName: "Last Person in Charge",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "Amount",
      headerName: "Amount",
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

export default PartyFollowup;
