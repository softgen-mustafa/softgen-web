"use client";

import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import { ReactNode, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  Container,
  Typography,
  Box,
  IconButton,
  Grid,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DropDown } from "@/app/ui/drop_down";
import { inspiredPalette } from "@/app/ui/theme";
import { ChevronRight } from "@mui/icons-material";
import { AgingView } from "./aging_card";
import { ResponsiveDiv, ResponsiveGrid } from "@/app/ui/custom_div";

const Page = () => {
  const router = useRouter();

  let incomingBillType = "Receivable"; // populate later
  const [types, updateTypes] = useState([
    { id: 1, label: "Receivable", code: "receivable" },
    { id: 2, label: "Payable", code: "payable" },
  ]);

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
        selectedType.current.code
      }&durationType=${selectedFilter.current.value}`;
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
    <div className="w-[96vw]">
      <Grid container className="w-full justify-start flex" columnGap={4}>
        <Grid item xs={12} sm={6} md={4} >
          <Card className="shadow-lg p-2 rounded-xl">
            <CardContent>
              <DropDown
                label="Select Type"
                displayFieldKey={"label"}
                valueFieldKey={null}
                selectionValues={types}
                helperText={"Select Outstanding Type"}
                onSelection={(selection) => {
                  selectedType.current = selection;
                  loadUpcoming();
                }}
              />
            </CardContent>
          </Card>
          <Card className="shadow-xl mt-8 p-2 rounded-xl">
            <AgingView billType={selectedType.current.code} />
          </Card>
          <Card className="shadow-xl mt-8 p-2 rounded-xl">
            <Container>
              <Box
                sx={{ display: "flex", overflowX: "auto", padding: "16px 0" }}
              >
                {filters.map((card, index) => (
                  <Card
                    key={index}
                    sx={{
                      minWidth: 100,
                      margin: "0 8px",
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 60,
                      background: card.isSelected
                        ? inspiredPalette.Pumpkin
                        : "white",
                      color: card.isSelected ? "white" : "black",
                    }}
                    onClick={(event) => {
                      let values: any[] = filters;
                      values = values.map((entry: any) => {
                        let isSelected = card.value === entry.value;
                        entry.isSelected = isSelected;
                        return entry;
                      });
                      updateFilters(values);
                      selectedFilter.current = card;
                      loadUpcoming();
                    }}
                  >
                    <CardContent>
                      <Typography component="div" className="flex justify-center items-center">
                        {card.label}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Container>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card className="shadow-xl p-2 rounded-xl mt-4 md:mt-0" sx={{}}>
            <CardContent>
              <DataGrid
                columns={columns}
                rows={rows}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                    },
                  },
                }}
                onRowClick={(params) => {
                  localStorage.setItem("party_filter_value", params.row.id);
                  localStorage.setItem("party_view_type", "upcoming");
                  localStorage.setItem(
                    "party_bill_type",
                    selectedType.current.code
                  );
                  localStorage.setItem(
                    "party_filter_type",
                    selectedFilter.current.value
                  );
                  router.push("/dashboard/outstanding/party-search");
                }}
                pageSizeOptions={[5, 10, 25, 50, 75, 100]}
                disableRowSelectionOnClick
                onPaginationModelChange={(value) => {
                  alert(`page model:  ${JSON.stringify(value)}`);
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Page;
