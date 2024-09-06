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

const Page = () => {
  const [refresh, setRefresh] = useState(false);
  const [groups, setGroups] = useState<any>([]);

  let selectedGroup = useRef<any>(null);

  useEffect(() => {
    loadGroups().then((_) => setRefresh(!refresh));
  }, []);

  const loadGroups = async () => {
    let url = `${getBmrmBaseUrl()}/stock-group/get/names`;
    let response = await getAsync(url);
    let values = [{ id: "none", title: "All" }];
    response.map((entry: any) => {
      values.push(entry);
    });
    setGroups(values);
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
      StockGroups: selectedGroup.current != null ? [selectedGroup.current] : [],
    };
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

  const gridConfig = [
    {
      weight: Weight.High,
      view: (
        <CardView title="Items">
          <PeriodicTable
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
