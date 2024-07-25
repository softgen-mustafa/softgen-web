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
  Icon,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { DropDown } from "@/app/ui/drop_down";
import { inspiredPalette } from "@/app/ui/theme";
import {
  ChevronLeft,
  ChevronLeftRounded,
  ChevronRight,
  PendingActions,
} from "@mui/icons-material";
import { AgingView } from "./aging_card";
import { ResponsiveDiv, ResponsiveGrid } from "@/app/ui/custom_div";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { numericToString } from "@/app/services/Local/helper";

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

  const [totalAmount, setAmount] = useState("0");

  const [rows, setRows] = useState([]);

  useEffect(() => {
    loadAmount();
    loadUpcoming();
  }, []);

  const loadAmount = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/bill/get/outstanding-amount?groupType=${
        selectedType.current.code
      }`;
      let response = await getAsync(url);
      let amount = `${"₹"} ${numericToString(response)}`;
      setAmount(amount);
    } catch {
      alert("Coult not load amount");
    }
  };

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
      minWidth: 300,
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

  const gridConfig: GridConfig[] = [
    {
      type: "container",
      view: null,
      className: "",
      children: [
        {
          type: "item",
          view: (
            <CardView>
              <div className="flex flex-row items-center">
                <IconButton onClick={() => {
                  router.back();
                }}>
                  <ChevronLeftRounded />
                </IconButton>
                <Typography>Go Back</Typography>
              </div>
              <br />
              <DropDown
                label="Select Type"
                displayFieldKey={"label"}
                valueFieldKey={null}
                selectionValues={types}
                helperText={"Select Outstanding Type"}
                onSelection={(selection) => {
                  selectedType.current = selection;
                  loadAmount();
                  loadUpcoming();
                }}
              />
            </CardView>
          ),
          className: "",
          children: [],
        },
        {
          type: "item",
          view: (
            <CardView className="">
              <br/>
              <div>
                <PendingActions
                  fontSize="large"
                  style={{
                    flex: 1,
                    fontSize: 80,
                  }}
                />
              </div>
              <br/>
              <Typography className="text-xl flex">
                Total Pending
              </Typography>
              <Typography className="text-2xl md:text-3xl mt-2 flex">{totalAmount}</Typography>
            </CardView>
          ),
          className: "",
          children: [],
        },
        {
          type: "item",
          view: (
            <CardView>
              <Container>
                <Box
                  sx={{ display: "flex", overflowX: "auto", }}
                >
                  {filters.map((card, index) => (
                    <Card
                      key={index}
                      className="shadow-xl mr-4 rounded-xl"
                      sx={{
                        minWidth: 100,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 60,
                        background: card.isSelected
                          ? inspiredPalette.darkPurple
                          : inspiredPalette.lightTextGrey,
                        color: card.isSelected ? "white" : inspiredPalette.dark, 
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
                        <Typography
                          component="div"
                          className="flex justify-center items-center"
                        >
                          {card.label}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Container>
            </CardView>
          ),
          className: "",
          children: [],
        },
      ],
    },
    {
      type: "item",
      view: (
        <CardView>
          <AgingView billType={selectedType.current.code} />
        </CardView>
      ),
      className: "",
      children: [],
    },
    {
      type: "item",
      view: (
        <CardView>
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
        </CardView>
      ),
      className: "",
      children: [],
    },
  ];

  return (
    <Container sx={{overflowX: 'hidden'}}>
      <Grid
        container
        className="bg-gray-200"
        sx={{
          flexGrow: 1,
          height: "100vh",
        }}
      >
        {RenderGrid(gridConfig)}
      </Grid>

    </Container>
    // <div
    //   className="overflow-x-hidden"
    //   style={{
    //     width: "100%",
    //   }}
    // >
    // </div>
  );
};

export default Page;
