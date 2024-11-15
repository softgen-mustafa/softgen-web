"use client";
import { numericToString } from "@/app/services/Local/helper";
import {
  getAsync,
  getBmrmBaseUrl,
  postAsync,
} from "@/app/services/rest_services";
import { Weight } from "@/app/ui/responsive_grid";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DropDown } from "@/app/ui/drop_down";
import {
  ApiProps,
  PeriodicTable,
  TableColumn,
  TableSearchKey,
} from "@/app/ui/periodic_table/period_table";
import GridCardView from "@/app/ui/grid_card";
import ResponsiveCardGrid from "@/app/components/ResponsiveCardGrid";

const Page = () => {
  const router = useRouter();

  const [types, updateTypes] = useState([
    { id: 1, label: "Receivable", code: "receivable" },
    { id: 2, label: "Payable", code: "payable" },
  ]);
  const [agingData, setAgingData] = useState([]);
  let selectedAging = useRef("all");
  let selectedGroup = useRef(types[0].code);

  const [refresh, triggerRefresh] = useState(false);
  const [rows, setRows] = useState([]);

  const loadAgingData = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/aging-settings`;
      let response = await getAsync(url);

      if (response && response.length > 0) {
        let values: any = [{ title: "All", code: "all" }];
        response.map((_data: any) => {
          values.push({
            title: _data.title,
            code: _data.agingCode,
          });
        });
        setAgingData(values);
      }
    } catch (error) {
      console.log("Something went wrong...");
    }
  };

  useEffect(() => {
    loadAgingData();
  }, []);

  const sortKeys: TableSearchKey[] = [
    {
      title: "Name",
      value: "name",
    },
  ];

  const onApi = async (apiProps: ApiProps) => {
    let groupType = selectedGroup.current;
    let agingType = selectedAging.current;

    let agingUrl = `${getBmrmBaseUrl()}/bill/get/aging-bills?agingCode=${agingType}&groupType=${groupType}`;
    let totalOutstandingUrl = `${getBmrmBaseUrl()}/bill/get/all-party-bills?groupType=${groupType}`;

    let url = totalOutstandingUrl;
    if (agingType !== null && agingType !== "all") {
      url = agingUrl;
    }

    let requestBody = {
      page_number: apiProps.offset + 1,
      page_size: apiProps.limit,
      search_text: apiProps.searchText ?? "",
      sort_by: apiProps.sortKey ?? "",
      sort_order: apiProps.sortOrder ?? "",
    };

    try {
      let response = await postAsync(url, requestBody);
      let entries = response.map((entry: any, index: number) => {
        return {
          id: index + 1,
          partyName: entry.name,
          amount: entry.totalAmount,
          amountstr: `${entry.currency ?? "₹"} ${numericToString(
            entry.totalAmount
          )}`,
          billCount: entry.billCount,
          currency: entry.currency ?? "₹",
        };
      });
      setRows(entries);

      return entries;
    } catch {
    } finally {
      triggerRefresh(false);
    }
  };
  const columns: GridColDef<any[number]>[] = [
    {
      field: "partyName",
      headerName: "Name",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
    },
    {
      field: "amount",
      headerName: "Value",
      editable: false,
      sortable: true,
      type: "number",
      flex: 1,
      minWidth: 150,
      hideable: true,
    },
    {
      field: "amountstr",
      headerName: "Value",
      editable: false,
      sortable: true,
      type: "number",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "billCount",
      headerName: "Total Bills",
      editable: false,
      flex: 1,
      minWidth: 180,
      type: "number",
      sortable: true,
    },
  ];

  const view = [
    {
      id: 1,
      weight: Weight.High,
      content: (
        <div title=" Outstanding Overview">
          <DropDown
            label="Select Type"
            displayFieldKey={"label"}
            valueFieldKey={null}
            selectionValues={types}
            helperText={""}
            onSelection={(selection) => {
              selectedGroup.current = selection.code;
              triggerRefresh(!refresh);
            }}
          />
          <div className="mt-4" />
          <DropDown
            label={"Aging Code"}
            displayFieldKey={"title"}
            valueFieldKey={null}
            selectionValues={agingData}
            helperText={""}
            onSelection={(_data) => {
              selectedAging.current = _data?.code;
              triggerRefresh(!refresh);
            }}
          />
          <div className="mt-4" />
          {/* <DataTable
            columns={columns}
            refresh={refresh}
            useSearch={true}
            onApi={async (page, pageSize, searchText) => {
              return await onApi(page, pageSize, searchText);
            }}
            onRowClick={(params) => {
              localStorage.setItem("os_partyName", params.row.partyName);
              localStorage.setItem("os_amount", params.row.amount);
              localStorage.setItem("os_groupType", selectedGroup.current);
              localStorage.setItem("os_agingCode", selectedAging.current);
              router.push("/dashboard/outstanding/bill-detail");
            }}
          /> */}

          <GridCardView
            title="Outstanding Aging Overview"
            permissionCode="OutstandingOverview"
          >
            <PeriodicTable
              chartKeyFields={[
                {
                  label: "Party Name",
                  value: "partyName",
                },
              ]}
              chartValueFields={[
                {
                  label: "Amount",
                  value: "amount",
                },
                {
                  label: "Bill Count",
                  value: "billCount",
                },
              ]}
              useSearch={true}
              columns={columns.map((col: any) => {
                let column: TableColumn = {
                  header: col.headerName,
                  field: col.field,
                  type: "text",
                  pinned: false,
                  rows: [],
                  hideable: col.hideable,
                };
                return column;
              })}
              onApi={onApi}
              sortKeys={sortKeys}
              reload={refresh}
            />
          </GridCardView>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full" style={{}}>
      <ResponsiveCardGrid screenName="aging_outstanding" initialCards={view} />
    </div>
  );
};

export default Page;
