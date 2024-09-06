"use client";
import {
  CardView,
  DynGrid,
  Weight,
  GridDirection,
} from "@/app/ui/responsive_grid";
import { GridColDef } from "@mui/x-data-grid";
import { DropDown } from "@/app/ui/drop_down";
import { ApiDropDown } from "@/app/ui/api_drop_down";
import { useEffect, useState, useRef } from "react";
import {
  PeriodicTable,
  TableColumn,
  TableSearchKey,
  ApiProps,
} from "@/app/ui/periodic_table/period_table";
import {
  getAsync,
  getBmrmBaseUrl,
  getSgBizBaseUrl,
  postAsync,
} from "@/app/services/rest_services";
import { Box, Button, IconButton, Modal, Stack } from "@mui/material";
import { Settings, MailOutline, Send } from "@mui/icons-material";
import { numericToString } from "@/app/services/Local/helper";
import { OsSettingsView } from "@/app/dashboard/outstanding/report/outstanding_setings";
import { ApiMultiDropDown } from "@/app/ui/api_multi_select";
const isDebitType = [
  {
    name: "Payable",
    value: false,
  },
  {
    name: "Receivable",
    value: true,
  },
];

const reportTypes = [
  {
    name: "Party Wise",
    value: 0,
  },
  {
    name: "Bill Wise",
    value: 1,
  },
];

const dueTypes = [
  {
    name: "All",
    value: 0,
  },
  {
    name: "Pending Due",
    value: 1,
  },
  {
    name: "Due",
    value: 2,
  },
  {
    name: "Overdue",
    value: 3,
  },
];

const Page = () => {
  let selectedGroups = useRef<string[]>([]);
  let selectedParty = useRef<string>("");
  let selectedReportType = useRef<number>(0); //0 - Party Wise, 1 - Bill Wise
  let selectedDueType = useRef<number>(0);
  let selectedisDebitType = useRef<boolean>(false);

  const [showSettings, toggleSetting] = useState(false);
  const [refresh, triggerRefresh] = useState(false);
  const [refreshGroups, triggerGroupRefresh] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);

  useEffect(() => {
    loadParties("");
    loadGroups();
  }, []);

  const loadParties = async (searchValue: string) => {
    let values = [{ name: "None" }];
    try {
      let url = `${getSgBizBaseUrl()}/os/search/ledgers?searchKey=${searchValue}`;
      let response = await getAsync(url);
      if (response == null || response.Data == null) {
        return [];
      }
      response.Data.map((entry: any) => {
        values.push({
          name: entry.Name,
        });
      });
      return values;
    } catch {
      return [];
    }
  };

  const loadGroups = async () => {
    try {
      let url = `${getSgBizBaseUrl()}/os/get/groups?isDebit=${
        selectedisDebitType.current
      }`;
      let response = await getAsync(url);
      if (response == null || response.Data == null) {
        return [];
      }
      let values = response.Data.map((entry: any) => {
        return {
          name: entry,
        };
      });
      alert(JSON.stringify(values));
      return values;
    } catch {
      return [];
    }
  };

  const loadData = async (apiProps: ApiProps) => {
    let url = `${getSgBizBaseUrl()}/os/get/report?isDebit=${
      selectedisDebitType.current
    }`;
    console.log("load DAta", url);
    let groupNames = selectedGroups.current.map((entry: any) => {
      return entry.name;
    });
    let requestBody = {
      Limit: apiProps.limit,
      Offset: apiProps.offset,
      PartyName: selectedParty.current === "None" ? "" : selectedParty.current,
      SearchText: apiProps.searchText ?? "",
      Groups: groupNames ?? [],
      DueDays: 30,
      OverDueDays: 90,
      SearchKey: apiProps.searchKey, //;selectedSearchKey.current ?? "Party"
      SortKey: apiProps.sortKey,
      SortOrder: apiProps.sortOrder,
      ReportOnType: selectedReportType.current ?? 0,
      DueFilter: selectedDueType.current ?? 0,
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
        //Amount: `${entry.currency ?? "₹"} ${numericToString(entry.Amount)}`,
        Amount: entry.Amount,
        DueAmount: entry.DueAmount,
        OverDueAmount: entry.OverDueAmount,
        //DueAmount: `${entry.currency ?? "₹"} ${numericToString(
        //entry.DueAmount
        //)}`,
        //OverDueAmount: `${entry.currency ?? "₹"} ${numericToString(
        // entry.OverDueAmount
        //)}`,
        currency: entry.currency ?? "₹",
      };
    });
    // console.log(values);

    return values;
  };

  const columns: any[] = [
    {
      field: "LedgerName",
      headerName: "Party",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
      hideable: false,
      mobileFullView: true,
    },
    {
      field: "BillName",
      headerName: "Bill No",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
      hideable: selectedReportType.current === 0,
    },
    {
      field: "LedgerGroupName",
      headerName: "Parent",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
      hideable: false,
    },
    {
      field: "BillDate",
      headerName: "Bill Date",
      editable: false,
      sortable: true,
      flex: 1,
      hideable: selectedReportType.current === 0,
    },
    {
      field: "DueDate",
      headerName: "Due Date",
      editable: false,
      sortable: true,
      flex: 1,
      hideable: selectedReportType.current === 0,
    },
    {
      field: "DelayDays",
      headerName: "Delay",
      editable: false,
      sortable: true,
      type: "number",
      flex: 1,
      minWidth: 150,
      hideable: selectedReportType.current === 0,
    },
    {
      field: "Amount",
      headerName: "Pending Amount",
      editable: false,
      sortable: true,
      type: "number",
      flex: 1,
      minWidth: 150,
      hideable: !(
        selectedDueType.current === 0 || selectedDueType.current === 1
      ),
    },
    {
      field: "DueAmount",
      headerName: "Due Amount",
      editable: false,
      sortable: true,
      type: "number",
      flex: 1,
      minWidth: 150,
      hideable: !(
        selectedDueType.current === 0 || selectedDueType.current === 2
      ),
    },
    {
      field: "OverDueAmount",
      headerName: "OverDue Amount",
      editable: false,
      sortable: true,
      type: "number",
      flex: 1,
      minWidth: 150,
      hideable: !(
        selectedDueType.current === 0 || selectedDueType.current === 3
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

  const renderFilterView = () => {
    return (
      <div>
        <Stack flexDirection={"column"} gap={2}>
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
          <DropDown
            label="Due Type"
            displayFieldKey={"name"}
            valueFieldKey={null}
            selectionValues={dueTypes}
            helperText={""}
            onSelection={(selection) => {
              selectedDueType.current = selection.value;
              triggerRefresh(!refresh);
            }}
          />
          <ApiMultiDropDown
            reload={refreshGroups}
            label="Ledger Group"
            displayFieldKey={"name"}
            defaultSelections={selectedGroups.current}
            valueFieldKey={null}
            onApi={loadGroups}
            helperText={""}
            onSelection={(selection) => {
              selectedGroups.current = selection;
              triggerRefresh(!refresh);
            }}
          />
          <ApiDropDown
            label="Party"
            displayFieldKey={"name"}
            valueFieldKey={null}
            onApi={loadParties}
            helperText={""}
            onSelection={(selection) => {
              selectedParty.current = selection.name;
              triggerRefresh(!refresh);
            }}
          />
        </Stack>
        <div className="mt-4" />
      </div>
    );
  };

  const gridConfig = [
    {
      weight: Weight.Low,
      view: (
        <CardView title="Filters">
          <Stack flexDirection={"column"} gap={2}>
            <DropDown
              label="View"
              displayFieldKey={"name"}
              valueFieldKey={null}
              selectionValues={isDebitType}
              helperText={""}
              onSelection={(selection) => {
                selectedisDebitType.current = selection.value;
                loadGroups().then((_) => {
                  triggerRefresh(!refresh);
                  triggerGroupRefresh(!refreshGroups);
                });
              }}
            />
          </Stack>
          <div className="mt-4" />
        </CardView>
      ),
    },
    {
      weight: Weight.High,
      view: (
        <CardView title="Party Outstandings" actions={[]}>
          <PeriodicTable
            chartKeyFields={[
              {
                label: "Party",
                value: "LedgerName",
              },
              {
                label: "Ledger Group",
                value: "LedgerGroupName",
              },
            ]}
            chartValueFields={[
              {
                label: "Pending Amount",
                value: "Amount",
              },
              {
                label: "Due Amount",
                value: "DueAmount",
              },
              {
                label: "OverDue Amount",
                value: "OverDueAmount",
              },
            ]}
            iconActions={[
              {
                label: "Send Reminder",
                icon: <MailOutline />,
                onPress: (row: any) => {
                  alert(JSON.stringify(row));
                },
              },
            ]}
            refreshFilterView={refresh}
            RenderAdditionalView={renderFilterView()}
            useSearch={true}
            searchKeys={osSearchKeys}
            reload={refresh}
            columns={columns.map((col: any) => {
              let column: TableColumn = {
                header: col.headerName,
                field: col.field,
                type: "text",
                pinned: false,
                hideable: col.hideable,
                rows: [],
              };
              return column;
            })}
            onApi={loadData}
            sortKeys={osSortKeys}
            onRowClick={() => {
              // (row)
            }}
            checkBoxSelection={true}
            renderCheckedView={(values: any) => {
              return (
                <div>
                  {values.map((entry: any, index: number) => {
                    return <div key={index}>{entry[0].value}</div>;
                  })}
                </div>
              );
            }}
          />

          <IconButton> </IconButton>
        </CardView>
      ),
    },
  ];

  return (
    <Box>
      <DynGrid
        views={gridConfig}
        direction={GridDirection.Column}
        width="100%"
      />
    </Box>
  );
};

export default Page;
