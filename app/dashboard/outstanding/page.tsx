"use client";

import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import { ListView } from "@/app/ui/list_view";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardMedia, Typography, Box, FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { useRouter } from "next/navigation";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DropDown } from "@/app/ui/drop_down";
import { League_Spartan } from "next/font/google";

const Page = () => {
  const router = useRouter();

  let incomingBillType = "Receivable"; // populate later
  const [types, updateTypes] = useState([
    { id: 1, label: "Receivable", code: "receivable" },
    { id: 2, label: "Payable", code: "payable" },
  ]);

  const [refresh, triggerRefresh] = useState(false);
  const [filters, updateFilters] = useState([
    { id: 1, label: "Daily", value: "daily", isSelected: true },
    { id: 2, label: "Weekly", value: "weekly", isSelected: false },
    { id: 3, label: "Montly", value: "monthly", isSelected: false },
    { id: 4, label: "Quarterly", value: "quarterly", isSelected: false },
    { id: 5, label: "Yearly", value: "yearly", isSelected: false },
  ]);

  let selectedType = useRef(types[incomingBillType === "Payable" ? 1 : 0]);
  let selectedFilter = useRef(filters[0]);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    loadUpcoming();
  }, []);

  const loadUpcoming = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/bill/get/upcoming-overview?groupType=${
        selectedType.current
      }&durationType=daily`;
      let response = await getAsync(url);
      let entries = response.map((entry: any) => {
        return {
          id: entry.id,
          name: entry.title,
          amount: entry.amount,
          billCount: entry.billCount,
          currency: entry.currency ?? "₹",
        };
      });
      setRows(entries);
    } catch {
      alert("Could not load upcoming outstanding");
    }
  };

  const columns: GridColDef<any[number]>[] = [
    {
      field: "name",
      headerName: "Duration Name",
      editable: false,
      sortable: true,
      minWidth: 50,
      maxWidth: 400,
    },
    {
      field: "amount",
      headerName: "Value",
      editable: false,
      sortable: true,
      minWidth: 50,
      maxWidth: 400,
      valueGetter: (value, row) => `${row.currency || ""} ${row.amount || "0"}`,
    },
  ];

  return (
    <div>
      <h3>Outstanding Dashboard</h3>

      <DropDown 
        label="Select Type"
        displayFieldKey={"label"}
        valueFieldKey={"code"}
        selectionValues={types}
        helperText={"Select Outstanding Type"}
        onSelection={(selection) => {
          selectedType.current = selection;
          loadUpcoming();
        }}
      />

      <DataGrid
      columns={columns}
      rows={rows}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 10
          }
        }
      }}
      pageSizeOptions={[5, 10, 25, 50, 75, 100]}
      disableRowSelectionOnClick
      onPaginationModelChange={(value) => {
        alert(`page model:  ${JSON.stringify(value)}`);
      }}
      />

    </div>
  );
};

export default Page;
