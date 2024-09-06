"use client";

import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import { useEffect, useRef, useState } from "react";
import {
  Container,
  Typography,
  IconButton,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { GridColDef } from "@mui/x-data-grid";
import { DropDown } from "@/app/ui/drop_down";
import { ChevronLeftRounded } from "@mui/icons-material";
import { postAsync } from "@/app/services/rest_services";
import {
  CardView,
  GridConfig,
  DynGrid,
  Weight,
} from "@/app/ui/responsive_grid";
import { numericToString } from "@/app/services/Local/helper";
import { DataTable } from "@/app/ui/data_grid";
import { FeatureControl } from "@/app/components/featurepermission/permission_helper";
import {
  ApiProps,
  PeriodicTable,
  TableColumn,
  TableSearchKey,
} from "@/app/ui/periodic_table/period_table";
import Loading from "../loading";

const InventoryOverviewScreen = () => {
  const router = useRouter();

  let movementCycle: string = "";
  const [refresh, setRefresh] = useState(false);

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

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // const selectedMovementType = useRef(movementTypes[0]);
  const selectedMovementType = useRef(
    movementTypes.find((m) => m.code === movementCycle) || movementTypes[0]
  );

  const selectedListType = useRef(listTypes[0]);
  const selectedRateByType = useRef(rateByTypes[0]);

  useEffect(() => {
    FeatureControl("InventoryOverviewScreen").then((permission) => {
      setHasPermission(permission);
      if (permission) {
        fetchDetails();
        fetchInventoryItems({
          limit: 5,
          offset: 0 + 1,
          searchText: "",
        });
      }
      // else {
      //   router.back();
      //   // Toast("Access Denied for Customer Overview");
      // }
    });
  }, []);

  // useEffect(() => {
  //   movementCycle = localStorage.getItem("movementCycle") || "";
  //   // alert(movementCycle)
  //   fetchDetails();
  //   fetchInventoryItems(1, 10);
  // }, []);

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

  const sortKeys: TableSearchKey[] = [
    {
      title: "Name",
      value: "name",
    },
  ];

  const fetchInventoryItems = async (apiProps: ApiProps) => {
    try {
      setIsLoading(true);
      let url = `${getBmrmBaseUrl()}/stock-${
        selectedListType.current.code
      }/get/overview?movementType=${selectedMovementType.current.code}&rateBy=${
        selectedRateByType.current.code
      }`;
      let requestBody = {
        page_number: apiProps.offset + 1,
        page_size: apiProps.limit,
        search_text: apiProps.searchText ?? "",
        sort_by: apiProps.sortKey ?? "",
        sort_order: apiProps.sortOrder ?? "",
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
            amount: `${entry.currency ?? "₹"} ${numericToString(
              entry.closingValue
            )}`,
            quantity: entry.closingBal,
          };
        }
        return {
          id: entry.id || index,
          name: entry.name,
          quantity: entry.closingBal,
          // amount: entry.closingValue,
          amount: `${entry.currency ?? "₹"} ${numericToString(
            entry.closingValue
          )}`,

          rate: entry.rate,
        };
      });
      setRows(entries);
      console.log(entries);
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
      flex: 1,
      minWidth: 300,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 150,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 180,
      valueGetter: (params, row) =>
        `${row.currency} ${numericToString(row.amount)}`,
    },
    {
      field: "rate",
      headerName: "Rate",
      type: "number",
      flex: 1,
      minWidth: 150,
      valueGetter: (params, row) =>
        selectedListType.current.code === "item" ? row.rate : "N/A",
    },
    {
      field: "itemCount",
      headerName: "Item Count",
      type: "number",
      flex: 1,
      minWidth: 150,
      valueGetter: (params, row) =>
        selectedListType.current.code !== "item" ? row.itemCount : "N/A",
    },
  ];

  const gridConfig = [
    {
      weight: Weight.Low,
      view: (
        <CardView
          className="h-fit"
          title="Inventory"
          actions={[
            <IconButton
              key={1}
              onClick={() => {
                router.back();
              }}
            >
              <ChevronLeftRounded />
              <Typography>Go Back</Typography>
            </IconButton>,
          ]}
        >
          <Typography className="mt-4 text-md flex">Total Amount</Typography>
          <Typography className="text-lg md:text-xl mt-2 flex">
            {details?.currency} {numericToString(details?.totalAmount)}
          </Typography>
          <br />
          <Typography className="mt-4 text-md flex">Total Items,</Typography>
          <Typography className="text-lg md:text-xl mt-2 flex">
            {details?.totalItem}
          </Typography>
        </CardView>
      ),
    },
    {
      weight: Weight.Low,
      view: (
        <CardView title="Filters">
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
              setRefresh(!refresh);
            }}
          />
          <div className="mt-4" />
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
                  setRefresh(!refresh);
                }}
              />
              <br />
              <br />
              <div className="mt-4" />
              <DropDown
                label="Select Rate Calculation"
                displayFieldKey={"label"}
                valueFieldKey={null}
                selectionValues={rateByTypes}
                helperText={"Select Rate Type"}
                onSelection={(selection) => {
                  selectedRateByType.current = selection;
                  fetchDetails();
                  setRefresh(!refresh);
                }}
              />
              <br />
            </>
          )}
        </CardView>
      ),
    },
    {
      weight: Weight.High,
      view: (
        <CardView title={selectedListType.current.label}>
          {/* <DataTable
            refresh={refresh}
            columns={columns}
            useSearch={true}
            useServerPagination={false}
            onApi={async (page, pageSize, searchText) => {
              return await fetchInventoryItems(page, pageSize, searchText);
            }}
            onRowClick={(params) => {
              if (selectedListType.current.code === "item") {
                localStorage.setItem("item", JSON.stringify(params.row));
                router.push("/dashboard/Inventory/InventoryItemDetails");
              } else {
                localStorage.setItem("record", JSON.stringify(params.row));
                localStorage.setItem(
                  "viewType",
                  selectedListType.current.code || ""
                );
                router.push("/dashboard/Inventory/InventoryDetails");
              }
            }}
          /> */}
          <PeriodicTable
            useSearch={true}
            columns={columns.map((col: any) => {
              let column: TableColumn = {
                header: col.headerName,
                field: col.field,
                type: "text",
                pinned: false,
                rows: [],
              };
              return column;
            })}
            onApi={fetchInventoryItems}
            sortKeys={sortKeys}
            reload={refresh}
            onRowClick={(rowData) => {
              if (selectedListType.current.code === "item") {
                localStorage.setItem("item", JSON.stringify(rowData));
                router.push("/dashboard/Inventory/InventoryItemDetails");
              } else {
                localStorage.setItem("record", JSON.stringify(rowData));
                localStorage.setItem(
                  "viewType",
                  selectedListType.current.code || ""
                );
                router.push("/dashboard/Inventory/InventoryDetails");
              }
            }}
          />
        </CardView>
      ),
    },
  ];

  return (
    // <Container sx={{ overflowX: "hidden" }}>
    <Box>
      {hasPermission === null ? (
        <Loading />
      ) : hasPermission ? (
        <DynGrid views={gridConfig} />
      ) : (
        <Typography className="text-2xl text-center font-bold flex items-center justify-center flex-1 pl-2 pr-2">
          Check Your Internet Access Or This Feature is not included in your
          Subscription package. Kindly get the Premium package to utilize this
          feature.
        </Typography>
      )}
    </Box>
    // </Container>
  );
};

export default InventoryOverviewScreen;
