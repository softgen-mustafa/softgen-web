"use client";
import { numericToString } from "@/app/services/Local/helper";
import { getAsync, getBmrmBaseUrl, postAsync } from "@/app/services/rest_services";
import { DataTable } from "@/app/ui/data_grid";
import { CardView, GridConfig, DynGrid, Weight, GridDirection } from "@/app/ui/responsive_grid";
import { SearchInput } from "@/app/ui/text_inputs";
import { ChevronLeftRounded } from "@mui/icons-material";
import {
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FeatureControl } from "@/app/components/featurepermission/permission_helper";
import { DropDown } from "@/app/ui/drop_down";

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


  const onApi = async (
    page: number,
    pageSize: number,
    searchValue?: string
  ) => {
    let groupType = selectedGroup.current;
    let agingType = selectedAging.current;

    let agingUrl = `${getBmrmBaseUrl()}/bill/get/aging-bills?agingCode=${agingType}&groupType=${groupType}`;
    let totalOutstandingUrl = `${getBmrmBaseUrl()}/bill/get/all-party-bills?groupType=${groupType}`;

    let url = totalOutstandingUrl;
    if (agingType !== null && agingType !== "all") {
      url = agingUrl;
    }

    let requestBody = {
      page_number: page,
      page_size: pageSize,
      search_text: searchValue ?? "",
      sort_by: "name",
      sort_order: "asc",
    };
    try {
      let response = await postAsync(url, requestBody);
      let entries = response.map((entry: any, index: number) => {
        return {
          id: index + 1,
          partyName: entry.name,
          amount: entry.totalAmount,
          billCount: entry.billCount,
          currency: entry.currency ?? "₹",
        };
      });
      setRows(entries);

      return entries;
    } catch {}
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
      valueGetter: (value, row) =>
        `${row.currency || ""} ${
          row.amount != null ? numericToString(row.amount) : "0"
        }`,
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

  const gridConfig= [
    {
        weight: Weight.Low,
        view: (
            <CardView title="Outstanding Overview">
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
            <div className="mt-4"/>
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
            </CardView>
        )
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
              return await onApi(page, pageSize, searchText);
            }}
            onRowClick={(params) => {
              localStorage.setItem("os_partyName", params.row.partyName);
              localStorage.setItem("os_amount", params.row.amount);
              localStorage.setItem("os_groupType", selectedGroup.current);
              localStorage.setItem("os_agingCode", selectedAging.current);
              router.push("/dashboard/outstanding/bill-detail");
            }}
          />
        </CardView>
      ),
    },
  ];

  return (
    <div className="w-full" style={{}}>
        <DynGrid views={gridConfig} direction={GridDirection.Column}/>
    </div>
  );
};

export default Page;
