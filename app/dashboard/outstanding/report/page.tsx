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
  ApiProps
} from "@/app/ui/periodic_table/period_table";
import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";

const searchKeys = [
  {
    name: "Party Name",
    code: "Party",
  },
  {
    name: "Ledger Group",
    code: "Group",
  },
  {
    name: "Bill Number",
    code: "Bill",
  },
];

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
      //let url = "http://localhost:35001/os/get/groups?isDebit=true"
      let url = "http://118.139.167.125:45700/os/get/groups?isDebit=true";
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
    let url = "http://118.139.167.125:45700/os/get/report?isDebit=true";
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
    let appHeaders = {
      "Content-Type": "application/json; charset=utf-8",
      CompanyId: Cookies.get("companyId") ?? 1,
    };
    let res = await axios.post(url, requestBody, { headers: appHeaders });
    if (res.data == null || res.data.Data == null) {
      return [];
    }
    let values = res.data.Data.map((entry: any, index: number) => {
      return {
        id: index + 1,
        ...entry,
      };
    });
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

  const gridConfig = [
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
              /*let exists = selectedGroups.current.indexOf(selection.name);
                if (exists === -1) {
                    selectedGroups.current.push(selection.name)
                }*/
              selectedGroups.current = [selection.name];
              setRefresh(!refresh);
            }}
          />
          <div className="mt-4" />
          <DropDown
            label="Search By "
            displayFieldKey={"name"}
            valueFieldKey={null}
            selectionValues={searchKeys}
            helperText={""}
            onSelection={(selection: any) => {
              selectedSearchKey.current = selection.code;
              setRefresh(!refresh);
            }}
          />
        </CardView>
      ),
    },
    {
      weight: Weight.High,
      view: (
        <CardView title="Parties">
          <DataTable
            columns={columns}
            refresh={refresh}
            useSearch={true}
            onApi={async (page, pageSize, searchText) => {
              return await loadData(page, pageSize, searchText);
            }}
            onRowClick={(params) => {}}
          />
        </CardView>
      ),
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

  return (
    <div className="">
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
      {/*<DynGrid views={gridConfig} direction={GridDirection.Column}/>*/}
    </div>
  );
};

export default Page;
