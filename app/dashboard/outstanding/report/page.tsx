"use client";
import {
  CardView,
  DynGrid,
  Weight,
  GridDirection,
} from "@/app/ui/responsive_grid";
import { GridColDef } from "@mui/x-data-grid";
import { DropDown } from "@/app/ui/drop_down";
import { useEffect, useState, useRef } from "react";
import {
  PeriodicTable,
  TableColumn,
  TableSearchKey,
  ApiProps,
} from "@/app/ui/periodic_table/period_table";
import { getSgBizBaseUrl, postAsync } from "@/app/services/rest_services";
import { IconButton, Modal } from "@mui/material";
import { Settings } from "@mui/icons-material";
import { numericToString } from "@/app/services/Local/helper";
import { OsSettingsView } from "@/app/dashboard/outstanding/report/outstanding_setings";

const reportTypes = [
    {
        "name": "Party Wise",
        "value": 0,
    },
    {
        "name": "Bill Wise",
        "value": 1,
    },
];


const Page = () => {
  let selectedGroups = useRef<string[]>([]);
  let selectedParty = useRef<string>("");
  let selectedReportType = useRef<number>(0);

  const [showSettings, toggleSetting] = useState(false);
  const [refresh, triggerRefresh] = useState(false);

  useEffect(() => {}, []);

  const loadData = async (apiProps: ApiProps) => {
    let url = `${getSgBizBaseUrl()}/os/get/report?isDebit=true`;
    let requestBody = {
      Limit: apiProps.limit,
      Offset: apiProps.offset,
      PartyName: selectedParty.current === "None" ? "" : selectedParty.current,
      SearchText: apiProps.searchText ?? "",
      Groups: selectedGroups.current ?? [],
      DueDays: 30,
      OverDueDays: 90,
      SearchKey: apiProps.searchKey, //;selectedSearchKey.current ?? "Party"
      SortKey: apiProps.sortKey,
      SortOrder: apiProps.sortOrder,
      ReportOnType: selectedReportType.current ?? 0,
    };
    let res = await postAsync(url, requestBody);
    if (!res || !res.Data) {
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
      {
          weight: Weight.High,
          view: (
              <CardView title="Filters">
              <DropDown
              label="View Report By"
              displayFieldKey={"name"}
              valueFieldKey={null}
              selectionValues={reportTypes}
              helperText={""}
              onSelection={(selection) => {
                  selectedReportType.current = selection.value;
                  triggerRefresh(!refresh);
              }}
              />
              <div className="mt-4"/>
              </CardView>
          )
      },
      {
          weight: Weight.High,
          view: (
              <CardView title="Party Outstandings"
              actions={[
              ]}
              >
              <PeriodicTable
              useSearch={true}
              searchKeys={osSearchKeys}
              reload={refresh}
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
