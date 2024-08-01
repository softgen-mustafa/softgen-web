"use client";

import { getBmrmBaseUrl } from "@/app/services/rest_services";
import { useEffect, useRef, useState } from "react";
import { Container, Typography, IconButton, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { GridColDef } from "@mui/x-data-grid";
import { DropDown } from "@/app/ui/drop_down";
import { inspiredPalette } from "@/app/ui/theme";
import { ChevronLeftRounded } from "@mui/icons-material";
import { postAsync } from "@/app/services/rest_services";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { numericToString } from "@/app/services/Local/helper";
import { DataTable } from "@/app/ui/data_grid";

const ItemDetailScreen = () => {
  const router = useRouter();

  const [listTypes, setlistTypes] = useState([
    { id: 1, label: "Batches Wise", code: "batches" },
    { id: 2, label: "Godown Wise", code: "godowns" },
  ]);

  const [item, setItem] = useState<any>(null);
  const [refresh, triggerRefresh] = useState(false);


  const [details, setDetails] = useState({
    totalAmount: 0,
    totalItem: 0,
    totalItemsStock: 0,
    currency: "₹",
  });

  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  let selectedListType = useRef(listTypes[0]);

  useEffect(() => {
    const itemString = localStorage.getItem("item") || "{}";
    const parsedItem = JSON.parse(itemString);

    setItem(parsedItem);

    setDetails({
      totalAmount: parsedItem.amount || 0,
      totalItem: 1,
      totalItemsStock: parsedItem.quantity || 0,
      currency: parsedItem.currency || "₹",
    });

    onApi(1, 10);
  }, []);

  const onApi = async (page: number, pageSize: number,    searchValue?: string,
  ) => {
    if (!item) return;

    let nameField = "name";
    let idField = "id";
    let quantityField = "quantity";

    switch (selectedListType.current.code) {
      case "batches":
        idField = "godownName";
        quantityField = "closingBal";
        break;
      case "godowns":
        nameField = "godown_name";
        idField = "godown_id";
        quantityField = "item_quantity";
        break;
    }

    try {
      setIsLoading(true);

      let url = `${getBmrmBaseUrl()}/stock-item/get/${
        selectedListType.current.code
      }?id=${item.id}`;

      let requestBody = {
        page_number: page,
        page_size: pageSize,
        search_text: searchValue ?? "",
        sort_by: "name",
        sort_order: "asc",
      };

      let response = await postAsync(url, requestBody);
      let entries = response.map((entry: any, index: number) => {
        if (selectedListType.current.code !== "batches") {
          return {
            id: entry[idField],
            name: entry[nameField],
            quantity: entry[quantityField],
          };
        }

        return {
          id: entry[idField],
          name: entry[nameField],
          godownName: entry.godownName,
          date: entry.date ? new Date(entry.date) : null,
          quantity: entry[quantityField],
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
      field: "godownName",
      headerName: "Godown Name",
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
      field: "rate",
      headerName: "Rate",
      type: "number",
      width: 110,
      valueGetter: (params, row) =>
        selectedListType.current.code === "item" ? row.rate : "N/A",
    },
    {
      field: "date",
      headerName: "Date",
      type: "date",
      width: 150,
      valueGetter: (params, row) => {
        const date = row.date;
        return date ? new Date(date) : null;
      },
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
          <Typography className="text-xl flex">Item Name</Typography>
          <Typography className="text-2xl md:text-3xl mt-2 flex">
            {item?.name}
          </Typography>
          <br />
          <Typography className="text-xl flex">Item Rate</Typography>
          <Typography className="text-2xl md:text-3xl mt-2 flex">
            {item?.currency} {numericToString(item?.rate)}
          </Typography>
          <br />
          <Typography className="text-xl flex">Total Quantity</Typography>
          <Typography className="text-2xl md:text-3xl mt-2 flex">
            {item?.quantity}
          </Typography>
          <br />
          <Typography className="text-xl flex">Closing Value</Typography>
          <Typography className="text-2xl md:text-3xl mt-2 flex">
          {item?.currency}  {numericToString(item?.amount)}
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
                label="Select Basis"
                displayFieldKey={"label"}
                valueFieldKey={null}
                selectionValues={listTypes}
                helperText={"Select  Type"}
                onSelection={(selection) => {
                  selectedListType.current = selection;
                  triggerRefresh(!refresh);


                  onApi(1, 10);
                }}
              />
              <br />
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
            refresh={refresh}
            useSearch={true}
            onApi={async (page, pageSize,searchText ) => {
              return await onApi(page, pageSize,searchText);
            }}
            onRowClick={(params) => {}}
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

export default ItemDetailScreen;
