"use client";
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
  getSgBizBaseUrl,
  postAsync,
} from "@/app/services/rest_services";
import { Box, Button, IconButton, Stack, Modal } from "@mui/material";
import { MailOutline, Settings } from "@mui/icons-material";
import { numericToString } from "@/app/services/Local/helper";
import { ApiMultiDropDown } from "@/app/ui/api_multi_select";
import { OsSettingsView } from "./outstanding_setings";
import ResponsiveCardGrid from "@/app/components/ResponsiveCardGrid";
import { useSnackbar } from "@/app/ui/snack_bar_provider";
import GridCardView from "@/app/ui/grid_card";

const isDebitType = [
  {
    name: "Receivable",
    value: true,
  },
  {
    name: "Payable",
    value: false,
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

const locationTypes = [
  {
    name: "Pincode",
    value: "Pincode",
  },
  {
    name: "District",
    value: "District",
  },
  {
    name: "Region",
    value: "Region",
  },
 
];

const Page = () => {
  let selectedGroups = useRef<string[]>([]);
  let selectedParty = useRef<string>("");
  let selectedReportType = useRef<number>(0); //0 - Party Wise, 1 - Bill Wise
  let selectedDueType = useRef<number>(0);
  let selectedisDebitType = useRef<boolean>(true);
  let selectedUser = useRef<string>("");
  let selectedlocationTypes = useRef<string>("");
  let selectedStateType = useRef<string>("");

  const [showSettings, toggleSetting] = useState(false);
  const [refresh, triggerRefresh] = useState(false);
  const [refreshGroups, triggerGroupRefresh] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);

  const snackbar = useSnackbar();

  useEffect(() => {
    loadParties("");
    loadGroups();
    loadStates("");
  }, []);

  const sendMail = async (parties: string[]) => {
    try {
      let url = `${getSgBizBaseUrl()}/os/send-email`;
      let requestBody = {
        Parties: parties && parties.length > 0 ? parties : [],
      };
      await postAsync(url, requestBody);
      snackbar.showSnackbar("Email sent", "success");
    } catch {
      snackbar.showSnackbar("Could not send email", "error");
    }
  };

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
      triggerRefresh(false);
      return values;
    } catch {
      return [];
    }
  };

  const loadGroups = async () => {
    try {
      let url = `${getSgBizBaseUrl()}/os/get/groups?isDebit=${
        selectedisDebitType.current ?? true
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
      triggerRefresh(false);
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
        PendingPercentage: parseFloat(entry.PendingPercentage.toFixed(2)),
        PaidPercentage: parseFloat(entry.PaidPercentage.toFixed(2)),
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
    triggerRefresh(false);
    return values;
  };

  const loadStates = async (searchValue: string) => {
    try {
      let url = `${getSgBizBaseUrl()}/dsp/get/states?searchKey=${searchValue}`;
      let response = await getAsync(url);
      if (response == null || response.Data == null) {
        return [];
      }
      let values = response.Data.map((entry: any) => {
        return {
          name: entry,
        };
      });
      triggerRefresh(false);
      return values;
    } catch {
      return [];
    }
  };

  const loadMapsData = async (apiProps: ApiProps) => {
    let url = `${getSgBizBaseUrl()}/os/location/report?isDebit=${
      selectedisDebitType.current
    }`;
    console.log("load DAta", url);
    let requestBody = {
      State: selectedStateType.current ?? "",
      LocationType: selectedlocationTypes.current ?? "",
    };
    console.log(requestBody);
    let res = await postAsync(url, requestBody);
    if (!res || !res.Data) {
      return [];
    }

    let values = res.Data.map((entry: any, index: number) => {
      return {
        id: index + 1,
        LocationName: entry.LocationName,
        OpeningAmount: entry.OpeningAmount,
        ClosingAmount: entry.ClosingAmount,
        OpeningAmountstr: `\u20B9 ${numericToString(entry.OpeningAmount)}`,
        ClosingAmountstr: `\u20B9 ${numericToString(entry.ClosingAmount)}`,
        // ...entry,
      };
    });
    console.log("this is maps ", values);
    triggerRefresh(false);
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
      headerName: "No Due",
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
    {
      field: "OpeningAmount",
      headerName: "Opening Amount",
      editable: false,
      sortable: true,
      type: "number",
      flex: 1,
      minWidth: 150,
      hideable: false,
    },
    {
      field: "ClosingAmount",
      headerName: "Closing Amount",
      editable: false,
      sortable: true,
      type: "number",
      flex: 1,
      minWidth: 150,
      hideable: false,
    },
    {
      field: "PendingPercentage",
      headerName: "Pending Percentage",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
      hideable: selectedReportType.current === 1,
    },
    {
      field: "PaidPercentage",
      headerName: "Paid Percentage",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
      hideable: selectedReportType.current === 1,
    },
  ];

  const columnsMap: any[] = [
    {
      field: "LocationName",
      headerName: "Location Type",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
      hideable: false,
      mobileFullView: true,
    },
    {
      field: "OpeningAmount",
      headerName: "Opening Amount",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
      hideable: true,
    },
    {
      field: "ClosingAmountstr",
      headerName: "Closing Amount",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
      hideable: false,
    },
    {
      field: "OpeningAmountstr",
      headerName: "Opening Amount",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
      hideable: false,
    },
    {
      field: "ClosingAmount",
      headerName: "Closing Amount",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
      hideable: true,
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
              loadGroups();
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
              loadParties("");
              triggerRefresh(!refresh);
            }}
          />
          {/* <ApiAutoComplete
                displayFieldKey={"name"}
                label="Select User"
                onApi={loadParties}
                onSelection={(selection) => {
                    selectedUser.current = selection;
                }}
                /> */}
        </Stack>
        <div className="mt-4" />
      </div>
    );
  };

  const renderFilterViewMaps = () => {
    return (
      <div>
        <Stack flexDirection={"column"} gap={2}>
          <ApiDropDown
            label="States"
            displayFieldKey={"name"}
            valueFieldKey={null}
            onApi={loadStates}
            helperText={""}
            onSelection={(selection) => {
              selectedStateType.current = selection.name;
              loadParties("");
              triggerRefresh(!refresh);
            }}
          />
          <DropDown
            label="Location Type"
            displayFieldKey={"name"}
            valueFieldKey={null}
            selectionValues={locationTypes}
            helperText={""}
            onSelection={(selection) => {
              selectedlocationTypes.current = selection.value;
              triggerRefresh(!refresh);
            }}
          />
        </Stack>
        <div className="mt-4" />
      </div>
    );
  };

  const initialCard = [
    {
      id: 1,
      weight: 1,
      content: (
        <GridCardView
          title="Outstanding Report"
          permissionCode="OutstandingReport"
        >
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
                });
              }}
            />
          </Stack>
          <div className="mt-4" />

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
                  let partyField =
                    row.find((entry: any) => entry.field === "LedgerName") ??
                    null;
                  if (partyField !== null) {
                    let party = partyField.value;
                    alert(party);
                    sendMail([party]);
                  }
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
                type: col.type,
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
                  {values !== null && values.length > 0 && (
                    <Button
                      variant="contained"
                      className="h-full"
                      onClick={() => {
                        let parties: string[] = [];
                        values.map((row: any[]) => {
                          let party = row.find(
                            (entry: any) => entry.field == "LedgerName"
                          );
                          if (party) {
                            parties.push(party.value);
                          }
                        });
                        sendMail(parties);
                      }}
                    >
                      Send Email
                    </Button>
                  )}
                </div>
              );
            }}
          />

          <IconButton> </IconButton>
        </GridCardView>
      ),
    },
    {
      id: 2,
      weight: 1,
      content: (
        <GridCardView
          title="Location Wise Report"
          permissionCode="LocationWiseReport"
        >
          <PeriodicTable
            chartKeyFields={[
              {
                label: "Location Name",
                value: "LocationName",
              },
            ]}
            chartValueFields={[
              {
                label: "Opening Amount",
                value: "OpeningAmount",
              },
              {
                label: "Closing Amount",
                value: "ClosingAmount",
              },
            ]}
            refreshFilterView={refresh}
            RenderAdditionalView={renderFilterViewMaps()}
            useSearch={false}
            // searchKeys={osSearchKeys}
            reload={refresh}
            columns={columnsMap.map((col: any) => {
              let columnsMap: TableColumn = {
                header: col.headerName,
                field: col.field,
                type: col.type,
                pinned: false,
                hideable: col.hideable,
                rows: [],
              };
              return columnsMap;
            })}
            onApi={loadMapsData}
            onRowClick={(row: any) => {}}
            checkBoxSelection={false}
          />
        </GridCardView>
      ),
    },
  ];

  return (
    <Box>
      <Box
        width={50}
        height={50}
        borderRadius={2}
        border={2}
        borderColor="#000000"
        className="flex items-center shadow-lg justify-center fixed mr-3 mb-2 bg-white"
        sx={{
          bottom: 0,
          right: 0,
        }}
        onClick={() => {
          toggleSetting(!showSettings);
        }}
      >
        <Settings sx={{ color: "#000000" }} />
      </Box>
      <ResponsiveCardGrid
        screenName="outstanding_dashboard"
        initialCards={initialCard}
      />
      <Modal open={showSettings} onClose={() => toggleSetting(false)}>
        <OsSettingsView onClose={() => toggleSetting(false)} />
      </Modal>
    </Box>
  );
};

export default Page;
