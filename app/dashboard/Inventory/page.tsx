"use client";

import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  Container,
  Typography,
  Box,
  IconButton,
  Grid,
  Icon,
  Button,
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
import { postAsync } from "@/app/services/rest_services";
import { ResponsiveDiv, ResponsiveGrid } from "@/app/ui/custom_div";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { numericToString } from "@/app/services/Local/helper";
import { DataTable } from "@/app/ui/data_grid";

const InventoryOverviewScreen = () => {
  const router = useRouter();

  const [movementTypes, setmovementTypes] = useState([
    { id: 1, label: "All", code: "all" },
    { id: 2, label: "Fast Moving Stock", code: "fast" },
    { id: 3, label: "Slow Moving Stock", code: "slow" },
    { id: 4, label: "Dead Stock", code: "dead" },
  ]);

  const [listTypes, setlistTypes] = useState([
    { id: 1, label: "Stock Item Wise", code: "item" },
    { id: 2, label: "Stock Group Wise", code: "group" },
    { id: 3, label: "Stock Category Wise", code: "category" },
    { id: 4, label: "Godown/Warehouse Wise", code: "godown" },
  ]);

  const [rateByTypes, setrateByTypes] = useState([
    { id: 1, label: "Average Rate", code: "average" },
    { id: 2, label: "Latest Rate", code: "latest" },
  ]);
  const [details, setDetails] = useState({
    totalAmount: 0,
    totalItem: 0,
    totalItemsStock: 0,
    currency: "₹",
  });

  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  let searchText = useRef("");
  const selectedMovementType = useRef(movementTypes[0]);
  const selectedListType = useRef(listTypes[0]);
  const selectedRateByType = useRef(rateByTypes[0]);

  useEffect(() => {
    fetchDetails();
    fetchInventoryItems(1, 10);
  }, []);

  const fetchDetails = async () => {
    try {
      setIsLoading(true);
      let url = `${getBmrmBaseUrl()}/inventory/overview`;
      let response = await getAsync(url);
      setDetails({
        totalAmount: response.total_amount,
        totalItem: response.total_items,
        totalItemsStock: response.total_items_restock,
        currency: response.currency ?? "₹",
      });
    } catch (error) {
      console.error("Could not load details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInventoryItems = async (page: number, pageSize: number) => {
    try {
      setIsLoading(true);
      let url = `${getBmrmBaseUrl()}/stock-${
        selectedListType.current.code
      }/get/overview?movementType=${selectedMovementType.current.code}&rateBy=${
        selectedRateByType.current.code
      }`;
      let requestBody = {
        page_number: page,
        page_size: pageSize,
        search_text: searchText.current,
        sort_by: "name",
        sort_order: "asc",
      };
      let response = await postAsync(url, requestBody);
      let entries = response.map((entry: any, index: number) => {
        if (selectedListType.current.code !== "item") {
          return {
            id:
              entry[
                selectedListType.current.code === "godown"
                  ? "godownId"
                  : selectedListType.current.code === "category"
                  ? "categoryId"
                  : "groupId"
              ] || index,
            name: entry[
              selectedListType.current.code === "godown"
                ? "godownName"
                : selectedListType.current.code === "category"
                ? "categoryName"
                : "name"
            ],
            itemCount: entry.totalItems,
            amount: entry.closingValue,
            quantity: entry.closingBal,
            currency: entry.currency ?? "₹",
          };
        }
        return {
          id: entry.id || index,
          name: entry.name,
          quantity: entry.closingBal,
          amount: entry.closingValue,
          rate: entry.rate,
          currency: entry.currency ?? "₹",
        };
      });
      setRows(entries);
      return entries;
    } catch (error) {
      console.error("Could not load inventory items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const columns: GridColDef<any[number]>[] = [
    {
      field: "name",
      headerName: "Name",
      editable: false,
      sortable: true,
      minWidth: 300,
      maxWidth: 400,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      editable: false,
      sortable: true,
      minWidth: 300,
      maxWidth: 400,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      editable: false,
      sortable: true,
      minWidth: 300,
      maxWidth: 400,
      valueGetter: (params, row) =>
        `${row.currency} ${numericToString(row.amount)}`,
    },
    {
      field: "rate",
      headerName: "Rate",
      type: "number",
      width: 110,
      valueGetter: (params, row) =>
        selectedListType.current.code === "item" ? row.rate : "N/A",
    },
    {
      field: "itemCount",
      headerName: "Item Count",
      type: "number",
      width: 110,
      valueGetter: (params, row) =>
        selectedListType.current.code !== "item" ? row.itemCount : "N/A",
    },
  ];

  const gridConfig: GridConfig[] = [
    {
      type: "item",
      view: (
        <CardView className="">
          <div className="flex flex-row items-center">
            <IconButton
              onClick={() => {
                router.back();
              }}
            >
              <ChevronLeftRounded />
            </IconButton>
            <Typography>Go Back</Typography>
          </div>

          <br />
          <Typography className="text-xl flex">Total Amount</Typography>
          <Typography className="text-2xl md:text-3xl mt-2 flex">
          {details?.currency} {numericToString(details?.totalAmount)}
          </Typography>
          <br />
          <br />
          <Typography className="text-xl flex">Total Items,</Typography>
          <Typography className="text-2xl md:text-3xl mt-2 flex">
            {details?.totalItem}
          </Typography>
        </CardView>
      ),
      className: "",
      children: [],
    },
    {
      type: "container",
      view: null,
      className: "",
      children: [
        {
          type: "item",
          view: (
            <CardView className="">
              <br />
              <DropDown
                label="Select Master"
                displayFieldKey={"label"}
                valueFieldKey={null}
                selectionValues={listTypes}
                helperText={"Select  Type"}
                onSelection={(selection) => {
                  selectedListType.current = selection;
                  fetchDetails();
                  fetchInventoryItems(1, 10);
                }}
              />
              <br />
              {selectedListType.current.code === "item" && (
                <>
                  <br />
                  <DropDown
                    label="Select Item Movement"
                    displayFieldKey={"label"}
                    valueFieldKey={null}
                    selectionValues={movementTypes}
                    helperText={"Select  Type"}
                    onSelection={(selection) => {
                      selectedMovementType.current = selection;
                      fetchDetails();
                      fetchInventoryItems(1, 10);
                    }}
                  />
                  <br />
                  <br />
                  <DropDown
                    label="Select Rate Calculation"
                    displayFieldKey={"label"}
                    valueFieldKey={null}
                    selectionValues={rateByTypes}
                    helperText={"Select Rate Type"}
                    onSelection={(selection) => {
                      selectedRateByType.current = selection;
                      fetchDetails();
                      fetchInventoryItems(1, 10);
                    }}
                  />
                  <br />
                </>
              )}
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
          <DataTable
            columns={columns}
            onApi={async (page, pageSize) => {
              return await fetchInventoryItems(page, pageSize);
            }}
            onRowClick={(params) => {
              if (selectedListType.current.code ==="item") {
                localStorage.setItem("item", JSON.stringify(params.row));
                router.push("/dashboard/Inventory/InventoryItemDetails");
              }
              else{
                localStorage.setItem("record", JSON.stringify(params.row));
                localStorage.setItem("viewType", selectedListType.current.code || "");
                router.push("/dashboard/Inventory/InventoryDetails");

              }
            }}
          />
        </CardView>
      ),
      className: "",
      children: [],
    },
  ];

  return (
    <Container sx={{ overflowX: "hidden" }}>
      <Grid
        container
        className=""
        sx={{
          flexGrow: 1,
          height: "100vh",
        }}
      >
        {RenderGrid(gridConfig)}
      </Grid>
    </Container>
  );
};

export default InventoryOverviewScreen;
