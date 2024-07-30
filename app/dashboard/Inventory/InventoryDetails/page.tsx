"use client";

import { getBmrmBaseUrl } from "@/app/services/rest_services";
import { useEffect, useRef, useState } from "react";
import { Container, Typography, IconButton, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { GridColDef } from "@mui/x-data-grid";
import { ChevronLeftRounded } from "@mui/icons-material";
import { postAsync } from "@/app/services/rest_services";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { numericToString } from "@/app/services/Local/helper";
import { DataTable } from "@/app/ui/data_grid";

const InventoryDetailScreen = () => {
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [details, setDetails] = useState({
    totalAmount: 0,
    totalItem: 0,
    totalItemsStock: 0,
    currency: "₹",
  });
  const [rows, setRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewType, setViewType] = useState<string>("");
  const searchText = useRef("");

  useEffect(() => {
    const itemString = localStorage.getItem("record") || "{}";
    const parsedItem = JSON.parse(itemString);
    setItem(parsedItem);

    setDetails({
      totalAmount: parsedItem.amount || 0,
      totalItem: parsedItem.itemCount || 1,
      totalItemsStock: parsedItem.quantity || 0,
      currency: parsedItem.currency || "₹",
    });

    const storedViewType = localStorage.getItem("viewType") || "";
    setViewType(storedViewType);

    onApi(1, 10);
  }, []);

  const onApi = async (page: number, pageSize: number) => {
    if (!viewType || !item) return;

    try {
      setIsLoading(true);

      const url = `${getBmrmBaseUrl()}/stock-${viewType}/get/items?id=${
        item.id
      }`;
      const requestBody = {
        page_number: page,
        page_size: pageSize,
        search_text: searchText.current,
        sort_by: "name",
        sort_order: "asc",
      };

      const response = await postAsync(url, requestBody);
      const entries = response.map((entry: any) => {
        return {
          id: entry.id,
          name: entry.name,
          quantity: entry.closingBal,
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

  const columns: GridColDef[] = [
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
      valueGetter: (params, row) => row.quantity,
    },

    {
      field: "rate",
      headerName: "Rate",
      type: "number",
      width: 110,
      valueGetter: (params, row) => row.rate ?? "N/A",
    },
  ];

  const gridConfig: GridConfig[] = [
    {
      type: "item",
      view: (
        <CardView>
          <div className="flex flex-row items-center">
            <IconButton onClick={() => router.back()}>
              <ChevronLeftRounded />
            </IconButton>
            <Typography>Go Back</Typography>
          </div>
          <br />
          <Typography className="text-xl">{viewType?.toUpperCase()}</Typography>
          <Typography className="text-2xl md:text-3xl mt-2">
            {item?.name}
          </Typography>
          <br />
          <Typography className="text-xl">Total Items</Typography>
          <Typography className="text-2xl md:text-3xl mt-2">
            {numericToString(item?.itemCount)}
          </Typography>

          <br />
          <Typography className="text-xl">Closing Value</Typography>
          <Typography className="text-2xl md:text-3xl mt-2">
            {item?.currency} {numericToString(item?.amount)}
          </Typography>
        </CardView>
      ),
      className: "",
      children: [],
    },

    {
      type: "item",
      view: (
        <CardView>
          <DataTable
            columns={columns}
            onApi={async (page, pageSize) => await onApi(page, pageSize)}
            onRowClick={(params) => {
              if (viewType === "item") {
                localStorage.setItem("item", JSON.stringify(params.row));
                router.push("/dashboard/Inventory/InventoryItemDetails");
              } else {
                localStorage.setItem("record", JSON.stringify(params.row));
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
      <Grid container sx={{ flexGrow: 1, height: "100vh" }}>
        {RenderGrid(gridConfig)}
      </Grid>
    </Container>
  );
};

export default InventoryDetailScreen;