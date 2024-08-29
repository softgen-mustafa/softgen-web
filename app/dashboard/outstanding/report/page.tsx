"use client";

import { DropDown } from "@/app/ui/drop_down";
import { DataTable } from "@/app/ui/data_grid";
import {
  CardView,
  DynGrid,
  Weight,
  GridDirection,
} from "@/app/ui/responsive_grid";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import {
  PeriodicTable,
  TableColumn,
  TableSearchKey,
  TableSortKey,
  ApiProps,
} from "@/app/ui/periodic_table/period_table";
import {
  getAsync,
  getBmrmBaseUrl,
  getSgBizBaseUrl,
  postAsync,
} from "@/app/services/rest_services";
import { numericToString } from "@/app/services/Local/helper";

const Page = () => {
  const [refresh, setRefresh] = useState(false);
  const [groups, setGroups] = useState([]);
  const [parties, setParties] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([]);

  let searchedParty = useRef("");
  let selectedGroups = useRef<string[]>([]);
  let selectedParty = useRef<string>("");
  let selectedSearchKey = useRef("Party");

  useEffect(() => {
    loadParties().then((_) => loadGroups());
  }, []);

  const loadParties = async () => {
    try {
      let searchedValue =
        searchedParty.current != null && searchedParty.current.length > 0
          ? `?searchKey=${searchedParty.current}`
          : "";
      let url = `http://118.139.167.125:45700/os/search/ledgers${searchedValue}`;
      //let url = `http://localhost:35001/os/search/ledgers${searchedValue}`;
      let appHeaders = {
        "Content-Type": "application/json; charset=utf-8",
        CompanyId: Cookies.get("companyId") ?? 1,
      };
      let res = await axios.get(url, { headers: appHeaders });
      let values: any[] = [{ Name: "None" }];
      if (res.data !== null) {
        res.data.Data.map((entry: any) => {
          values.push(entry);
        });
      }
      setParties(values);
    } catch {
    } finally {
      setRefresh(!refresh);
    }
  };

  const loadGroups = async () => {
    try {
      let url = "http://localhost:35001/os/get/groups?isDebit=true";
      // let url = "http://118.139.167.125:45700/os/get/groups?isDebit=true";
      let appHeaders = {
        "Content-Type": "application/json; charset=utf-8",
        CompanyId: Cookies.get("companyId") ?? 1,
      };
      let res = await axios.post(url, {}, { headers: appHeaders });
      let values = res.data.map((entry: string) => {
        return {
          name: entry,
          value: entry,
        };
      });
      setGroups(values);
    } catch {
    } finally {
      setRefresh(!refresh);
    }
  };

  const loadData = async (apiProps: ApiProps) => {
    //let url = "http://localhost:35001/os/get/report?isDebit=true";
    //let url = "http://118.139.167.125:45700/os/get/report?isDebit=true";
    let url = `${getSgBizBaseUrl()}/os/get/report?isDebit=true`;
    let requestBody = {
      Limit: apiProps.limit,
      Offset: apiProps.offset,
      PartyName: selectedParty.current === "None" ? "" : selectedParty.current,
      SearchText: apiProps.searchText,
      Groups: selectedGroups.current ?? [],
      DueDays: 30,
      OverDueDays: 90,
      SearchKey: apiProps.searchKey, //;selectedSearchKey.current ?? "Party"
      SortKey: apiProps.sortKey,
      SortOrder: apiProps.sortOrder,
    };
    /*
    let appHeaders = {
      "Content-Type": "application/json; charset=utf-8",
      CompanyId: Cookies.get("companyId") ?? 1,
    };
    let res = await axios.post(url, requestBody, { headers: appHeaders });
    if (res.data == null || res.data.Data == null) {
      return [];
    }
    */
    let res = await postAsync(url, requestBody);
    if (res === null) {
      return [];
    }
    let values = res.Data.map((entry: any, index: number) => {
      return {
        id: index + 1,
        ...entry,
        BillDate: entry.BillDate.substring(0, 10),
        DueDate: entry.DueDate.substring(0, 10),
        Amount: `${entry.currency ?? "₹"} ${numericToString(entry.Amount)}`,
        DueAmount: `${entry.currency ?? "₹"} ${numericToString(
          entry.DueAmount
        )}`,
        OverDueAmount: `${entry.currency ?? "₹"} ${numericToString(
          entry.OverDueAmount
        )}`,
        currency: entry.currency ?? "₹",
      };
    });
    // console.log(values);
    setRows(values);
    return values;
  };

  const columns: GridColDef<any[number]>[] = [
    {
      field: "LedgerName",
      headerName: "Party",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
    },
    {
      field: "BillName",
      headerName: "Bill No",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
    },
    {
      field: "LedgerGroupName",
      headerName: "Parent",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
    },
    {
      field: "BillDate",
      headerName: "Bill Date",
      editable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: "DueDate",
      headerName: "Due Date",
      editable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: "DelayDays",
      headerName: "Delay",
      editable: false,
      sortable: true,
      type: "number",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "Amount",
      headerName: "Pending Amount",
      editable: false,
      sortable: true,
      type: "number",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "DueAmount",
      headerName: "Due Amount",
      editable: false,
      sortable: true,
      type: "number",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "OverDueAmount",
      headerName: "OverDue Amount",
      editable: false,
      sortable: true,
      type: "number",
      flex: 1,
      minWidth: 150,
    },
  ];

  const osSearchKeys: TableSearchKey[] = [
    {
      title: "Party Name",
      value: "Party",
    },
    {
      title: "Ledger Group",
      value: "Group",
    },
    {
      title: "Bill Number",
      value: "Bill",
    },
  ];

  const osSortKeys: TableSearchKey[] = [
    {
      title: "Party Name",
      value: "Party",
    },
    {
      title: "Ledger Group",
      value: "Group",
    },
    {
      title: "Bill Number",
      value: "Bill",
    },
  ];

  const gridConfig = [
    /*
    {
      weight: Weight.Low,
      view: (
        <CardView title="Outstanding Overview">
          <DropDown
            label="Select Party"
            useSearch={true}
            displayFieldKey={"Name"}
            valueFieldKey={null}
            selectionValues={parties}
            helperText={""}
            onSearchUpdate={(search: string) => {
              searchedParty.current = search;
              loadParties();
            }}
            onSelection={(selection: any) => {
              selectedParty.current = selection.Name;
              setRefresh(!refresh);
            }}
          />
          <div className="mt-4" />
          <DropDown
            label="Select Group"
            displayFieldKey={"name"}
            valueFieldKey={null}
            selectionValues={groups}
            helperText={""}
            onSelection={(selection: any) => {
              selectedGroups.current = [selection.name];
              setRefresh(!refresh);
            }}
          />
        </CardView>
      ),
    },
    */
    {
      weight: Weight.High,
      view: (
        <CardView title="Party Outstandings">
          <PeriodicTable
            useSearch={true}
            searchKeys={osSearchKeys}
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
            sortKeys={osSortKeys}
          />
        </CardView>
      ),
    },
  ];

  return (
    <div className="">
      <DynGrid views={gridConfig} direction={GridDirection.Column} />
    </div>
  );
};

export default Page;
