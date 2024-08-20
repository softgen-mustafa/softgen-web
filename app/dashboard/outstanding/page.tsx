"use client";
import { numericToString } from "@/app/services/Local/helper";
import { getBmrmBaseUrl, postAsync } from "@/app/services/rest_services";
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
import OutstandingOverview from "./party-search/outstanding_overview";

const Page = () => {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  let filterValue = useRef("");
  let viewType = useRef("");
  let billType = useRef("");
  let filterType = useRef("");

  const [refresh, triggerRefresh] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    checkPermissionAndInitialize();
  }, []);

  const checkPermissionAndInitialize = async () => {
    const permission = await FeatureControl("PartySearchScreen");
    setHasPermission(permission);
    if (permission) {
      filterValue.current = localStorage.getItem("party_filter_value") || "";
      viewType.current = localStorage.getItem("party_view_type") || "";
      billType.current = localStorage.getItem("party_bill_type") || "";
      filterType.current = localStorage.getItem("party_filter_type") || "";
      triggerRefresh(!refresh);
    }
  };

  // useEffect(() => {
  //   filterValue.current = localStorage.getItem("party_filter_value") || "";
  //   viewType.current = localStorage.getItem("party_view_type") || "";
  //   billType.current = localStorage.getItem("party_bill_type") || "";
  //   filterType.current = localStorage.getItem("party_filter_type") || "";
  //   triggerRefresh(!refresh);
  // }, []);

  const onApi = async (
    page: number,
    pageSize: number,
    searchValue?: string
  ) => {
    let groupType = localStorage.getItem("os_bill_type");
    let agingType = localStorage.getItem("os_aging_type");

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
              <OutstandingOverview
                onChange={() => {
                  triggerRefresh(!refresh);
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
              return await onApi(page, pageSize, searchText);
            }}
            onRowClick={(params) => {
              localStorage.setItem(
                "party_filter_value",
                filterValue.current || ""
              );
              localStorage.setItem("party_view_type", viewType.current || "");
              localStorage.setItem("party_bill_type", billType.current || "");
              localStorage.setItem(
                "party_filter_type",
                filterType.current || ""
              );
              localStorage.setItem("bill_party_name", params.row.partyName);
              router.push("/dashboard/outstanding/bill-detail");
            }}
          />
        </CardView>
      ),
    },
  ];

  return (
    <div className="w-full" style={{}}>
        {hasPermission === null ? (
          <CircularProgress />
        ) : hasPermission ? (
            <DynGrid views={gridConfig} direction={GridDirection.Column}/>
        ) : (
          <Typography className="text-2xl text-center font-bold flex items-center justify-center flex-1 pl-2 pr-2">
            Check Your Internet Access Or This Feature is not included in your
            Subscription package. Kindly get the Premium package to utilize this
            feature.
          </Typography>
        )}
    </div>
  );
};

export default Page;
