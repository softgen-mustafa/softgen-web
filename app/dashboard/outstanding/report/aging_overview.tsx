"use client";
import { DropDown } from "@/app/ui/drop_down";
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
import { IconButton, Stack, Switch, useTheme } from "@mui/material";
import { convertToDate } from "@/app/services/Local/helper";
import { ApiMultiDropDown } from "@/app/ui/api_multi_select";
import { useSnackbar } from "@/app/ui/snack_bar_provider";

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

const AgingOverview = () => {
  const theme = useTheme();
  const [selectedReportType, setSelectedReportType] = useState<number>(0); // 0 - Party Wise, 1 - Bill Wise
  const [selectedDueType, setSelectedDueType] = useState<number>(0);
  const [deductAdvancePayment, setDeductAdvancePayment] =
    useState<boolean>(false); // Default false

  const [applyRangeFilter, setApplyRangeFilter] = useState<boolean>(true); // Default true

  let selectedGroups = useRef<string[]>([]);
  let selectedParty = useRef<string[]>([]);

  let selectedisDebitType = useRef<boolean>(true);

  const [refresh, triggerRefresh] = useState(false);
  const [refreshGroups, triggerGroupRefresh] = useState(false);
  const [refreshParties, triggerRefrehParties] = useState(false);

  const snackbar = useSnackbar();

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
      console.log(JSON.stringify(response));
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
    let url = `${getSgBizBaseUrl()}/aging/overview?applyRange=${applyRangeFilter}`;

    console.log("load Data", url);
    let groupNames = selectedGroups.current.map((entry: any) => entry.name);
    let partyNames = selectedParty.current.map((entry: any) => entry.name);
    let requestBody = {
      Filter: {
        Batch: {
          Limit: apiProps.limit,
          Offset: apiProps.offset,
          Apply: true,
        },
        SearchKey: apiProps.searchKey,
        SearchText: apiProps.searchText ?? "",
        SortKey: apiProps.sortKey,
        SortOrder: apiProps.sortOrder,
      },
      DeductAdvancePayment: deductAdvancePayment,
      IsDebit: selectedisDebitType.current,
      Groups: groupNames ?? [],
      Parties: partyNames ?? [],
    };

    console.log(JSON.stringify(requestBody));

    let res = await postAsync(url, requestBody);
    if (!res || !res.Data) {
      return [];
    }
    console.log(JSON.stringify(res));

    let values = res.Data.map((entry: any, index: number) => {
      let bills: any[] = [];
      if (entry.Bills !== null) {
        bills = entry.Bills.map((bill: any) => {
          return {
            BillNumber: bill.BillNumber,
            BillDate: convertToDate(bill.BillDate),
            DueDate: convertToDate(bill.DueDate),
            DelayDays: bill.DelayDays,
            OpeningAmount: bill.OpeningAmount,
            ClosingAmount: bill.ClosingAmount,
            Above30: bill.Above30,
            Above60: bill.Above60,
            Above90: bill.Above90,
            Above120: bill.Above120,
          };
        });
      }

      return {
        id: index + 1,
        PartyName: entry.PartyName,
        LedgerGroup: entry.LedgerGroup,
        CreditLimit: entry.CreditLimit,
        CreditDays: entry.CreditDays,
        TotalBills: entry.TotalBills,
        BillNumber: entry.BillNumber,
        BillDate: convertToDate(entry.BillDate),
        DueDate: convertToDate(entry.DueDate),
        DelayDays: entry.DelayDays,
        OpeningAmount: entry.OpeningAmount,
        ClosingAmount: entry.ClosingAmount,
        Above30: entry.Above30,
        Above60: entry.Above60,
        Above90: entry.Above90,
        Above120: entry.Above120,
        IsAdvance: entry.IsAdvance,
        Bills: bills,
      };
    });

    triggerRefresh(false);
    return values;
  };

  const columns: any[] = [
    {
      field: "Bills",
      headerName: "Bills",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
      hideable: true,
      mobileFullView: true,
    },
    {
      field: "PartyName",
      headerName: "Party",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
      hideable: false,
      mobileFullView: true,
    },
    {
      field: "CreditLimit",
      headerName: "Credit Limit",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
    },
    {
      field: "CreditDays",
      headerName: "Credit Days",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
    },
    {
      field: "BillNumber",
      headerName: "Bill No",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
      hideable: selectedReportType === 0,
    },
    {
      field: "TotalBills",
      headerName: "Total Bills",
      editable: false,
      sortable: true,
      type: "number",
      flex: 1,
      minWidth: 150,
      hideable: selectedReportType === 1,
    },
    {
      field: "LedgerGroup",
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
      hideable: selectedReportType === 0,
    },
    {
      field: "DueDate",
      headerName: "Due Date",
      editable: false,
      sortable: true,
      flex: 1,
      hideable: selectedReportType === 0,
    },
    {
      field: "DelayDays",
      headerName: "Delay",
      editable: false,
      sortable: true,
      type: "number",
      flex: 1,
      minWidth: 150,
      hideable: selectedReportType === 0,
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
      showSummation: true,
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
      showSummation: true,
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

  // Common sort keys for both Party Wise and Bill Wise
  const osCommonSortKeys: TableSearchKey[] = [
    { title: "Party Name", value: "party-wise" },
    { title: "Ledger Group", value: "group-wise" },
    { title: "Credit Limit", value: "credit-limit-wise" },
    { title: "Credit Period", value: "credit-period-wise" },
    { title: "Opening Amount", value: "opening-wise" },
    { title: "Closing Amount", value: "closing-wise" },
    { title: "Total Bills", value: "bill-count-wise" },
    { title: "Above 30 Days", value: "above-30-wise" },
    { title: "Above 60 Days", value: "above-60-wise" },
    { title: "Above 90 Days", value: "above-90-wise" },
    { title: "Above 120 Days", value: "above-120-wise" },
  ];

  const renderFilterView = () => {
    return (
      <div>
        <Stack flexDirection={"column"} gap={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <span>Deduct Advance Payment</span>
            <Switch
              checked={deductAdvancePayment}
              onChange={(event) => {
                setDeductAdvancePayment(event.target.checked);
                triggerRefresh(!refresh);
              }}
              style={{
                color: theme.palette.primary.dark,
              }}
            />
            <span>Apply Range</span>
            <Switch
              checked={applyRangeFilter}
              onChange={(event) => {
                setApplyRangeFilter(event.target.checked);
                triggerRefresh(!refresh);
              }}
              style={{
                color: theme.palette.primary.dark,
              }}
            />
          </Stack>

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

          <ApiMultiDropDown
            reload={refreshParties}
            label="Parties"
            displayFieldKey={"name"}
            defaultSelections={selectedParty.current}
            valueFieldKey={null}
            onApi={loadParties}
            helperText={""}
            onSelection={(selection) => {
              selectedParty.current = selection;
              loadParties("");
              triggerRefresh(!refresh);
            }}
          />
        </Stack>
        <div className="mt-4" />
      </div>
    );
  };

  return (
    <>
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
        pivotKey={"Bills"}
        usePivot={true}
        showSummationRow={true}
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
            showSummation: col.showSummation,
            rows: [],
          };
          return column;
        })}
        onApi={loadData}
        sortKeys={osCommonSortKeys}
        onRowClick={() => {
          // (row)
        }}
        checkBoxSelection={false}
      />
      <IconButton> </IconButton>
    </>
  );
};

export { AgingOverview };
