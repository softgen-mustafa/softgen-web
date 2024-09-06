"use client";

import { numericToString } from "@/app/services/Local/helper";
import { DataTable } from "@/app/ui/data_grid";
import {
  CardView,
  DynGrid,
  Weight,
  GridDirection,
} from "@/app/ui/responsive_grid";
import { GridColDef, GridSortDirection } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {
  getAsync,
  getBmrmBaseUrl,
  getSgBizBaseUrl,
  postAsync,
} from "@/app/services/rest_services";
import { DropDown } from "@/app/ui/drop_down";
import {
  PeriodicTable,
  TableColumn,
  TableSearchKey,
  TableSortKey,
  ApiProps,
} from "@/app/ui/periodic_table/period_table";
import { ApiMultiDropDown } from "@/app/ui/api_multi_select";
import { Stack } from "@mui/material";
const Page = () => {
  const [refresh, setRefresh] = useState(false);
  const [groups, setGroups] = useState<any>([]);
  const [refreshGroups, triggerGroupRefresh] = useState(false);

  let selectedGroups = useRef<any>(null);

  // useEffect(() => {
  //   loadGroups().then((_) => setRefresh(!refresh));
  // }, []);

  const loadGroups = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/stock-group/get/names`;
      console.log("URL:", url);

      let response = await getAsync(url);
      console.log("API Response:", response);

      // Check if response is valid and contains the necessary data
      if (!response || !Array.isArray(response)) {
        console.error("Invalid response format or no data.");
        return [];
      }

      let values = response.map((entry: any) => ({
        id: entry.id,
        name: entry.title,
      }));
      return values;
    } catch (error) {
      console.error("Error loading groups:", error);
      return [];
    }
  };

  const loadData = async (apiParams: ApiProps) => {
    //let url = "http://118.139.167.125:45700/stock-items/get/report";
    //let url = "http://localhost:35001/stock-items/get/report";
    let url = `${getSgBizBaseUrl()}/stock-items/get/report`;
    let requestBody = {
      Limit: apiParams.limit,
      Offset: apiParams.offset,
      SearchText: apiParams.searchText,
      SearchKey: apiParams.searchKey ?? "",
      SortKey: apiParams.sortKey ?? "",
      SortOrder: apiParams.sortOrder ?? "",
      StockGroups:
        selectedGroups.current != null ? [selectedGroups.current] : [],
    };
    // alert(JSON.stringify(requestBody));
    /*let appHeaders = {
            "Content-Type": "application/json; charset=utf-8",
            "CompanyId": Cookies.get("companyId") ?? 1,
        };
        let res = await axios.post(url, requestBody, { headers: appHeaders })
        if (res.data == null || res.data.Data ==null) {
            return [];
        }
        */
    let res = await postAsync(url, requestBody);
    if (res === null || res.Data === null) {
      return [];
    }
    let values = res.Data.map((entry: any, index: number) => {
      return {
        id: index + 1,
        Quantity: entry.ClosingBal != null ? entry.ClosingBal.Number : 0,
        Amount: entry.ClosingValue != null ? entry.ClosingValue.Amount : 0,
        Rate: entry.ClosingRate != null ? entry.ClosingRate.RatePerUnit : 0,
        ...entry,
      };
    });
    // alert(JSON.stringify(values));
    return values;
  };

  const columns: GridColDef<any[number]>[] = [
    {
      field: "Name",
      headerName: "Item",
      editable: false,
      sortable: false,
      flex: 1,
      minWidth: 200,
    },
    {
      field: "StockGroup",
      headerName: "Parent",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
    },
    {
      field: "BaseUnit",
      headerName: "Base Unit",
      editable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: "Quantity",
      headerName: "Quantity",
      editable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: "Amount",
      headerName: "Value",
      editable: false,
      sortable: true,
      type: "number",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "Rate",
      headerName: "Rate",
      editable: false,
      sortable: true,
      type: "number",
      flex: 1,
      minWidth: 150,
    },
  ];
  const searchKeys: TableSearchKey[] = [
    {
      title: "Item Name",
      value: "Item",
    },
    {
      title: "Stock Group",
      value: "Group",
    },
  ];

  const sortKeys: TableSearchKey[] = [
    {
      title: "Item Name",
      value: "Item",
    },
    {
      title: "Stock Group",
      value: "Group",
    },
    {
      title: "Item Rate",
      value: "Rate",
    },
    {
      title: "Item Quantity",
      value: "Quantity",
    },
    {
      title: "Item Value",
      value: "Amount",
    },
  ];

  const handleRowClick = (rowData: any) => {
    console.log("Clicked on row:", rowData);
    // Your code here to handle row click event.
  };

  const renderFilterView = () => {
    return (
      <div>
        <Stack flexDirection={"column"} gap={2}>
          <ApiMultiDropDown
            reload={refreshGroups}
            label="Stock Group"
            displayFieldKey={"name"}
            defaultSelections={selectedGroups.current}
            valueFieldKey={null}
            onApi={loadGroups}
            helperText={""}
            onSelection={(selection) => {
              selectedGroups.current = selection;
              setRefresh(!refresh);
            }}
          />
        </Stack>
        <div className="mt-4" />
      </div>
    );
  };

  const gridConfig = [
    {
      weight: Weight.High,
      view: (
        <CardView title="Items">
          <PeriodicTable
            chartKeyFields={[
              {
                label: "Item",
                value: "Name",
              },
              {
                label: "Parent",
                value: "StockGroup",
              },
            ]}
            chartValueFields={[
              {
                label: "Quantity",
                value: "Quantity",
              },
              {
                label: "Item Value",
                value: "Amount",
              },
              {
                label: "Rate",
                value: "Rate",
              },
            ]}
            refreshFilterView={refresh}
            RenderAdditionalView={renderFilterView()}
            useSearch={true}
            searchKeys={searchKeys}
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
            onApi={loadData}
            sortKeys={sortKeys}
            onRowClick={handleRowClick}
          />
        </CardView>
      ),
    },
  ];

  return (
    <div className="w-full">
      <DynGrid
        views={gridConfig}
        direction={GridDirection.Column}
        width="100%"
      />
    </div>
  );
};

export default Page;
