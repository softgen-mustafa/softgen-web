"use client";
import { numericToString } from "@/app/services/Local/helper";
import { getBmrmBaseUrl, postAsync } from "@/app/services/rest_services";
import { DataTable } from "@/app/ui/data_grid";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { SearchInput } from "@/app/ui/text_inputs";
import { ChevronLeftRounded } from "@mui/icons-material";
import { Container, Grid, IconButton, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import FeatureControl from "@/app/components/featurepermission/page";

const Page = () => {
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(false);


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
    searchValue?: string,
  ) => {
    let collectionUrl = `${getBmrmBaseUrl()}/bill/get/upcoming-bills?groupType=${billType.current}&durationType=${filterType.current}&durationKey=${filterValue.current}`;
    let agingUrl = `${getBmrmBaseUrl()}/bill/get/aging-bills?agingCode=${filterValue.current}&groupType=${billType.current}`;
    let totalOutstandingUrl = `${getBmrmBaseUrl()}/bill/get/all-party-bills?groupType=${billType.current}`;

    let url = totalOutstandingUrl;
    if (viewType.current === "upcoming") {
      url = collectionUrl;
    } else if (viewType.current === "aging") {
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
    },
    {
      field: "amount",
      headerName: "Value",
      editable: false,
      sortable: true,
      type: "number",
      flex: 1,
      valueGetter: (value, row) =>
        `${row.currency || ""} ${row.amount != null ? numericToString(row.amount) : "0"}`,
    },
    {
      field: "billCount",
      headerName: "Total Bills",
      editable: false,
      flex: 1,
      type: "number",
      sortable: true,
    },
  ];

  const gridConfig: GridConfig[] = [
    {
      type: "item",
      view: (
        <CardView
          className="max-h-fit h-fit"
          title="Party Search"
          actions={[
            <IconButton
              key={1}
              onClick={() => {
                router.back();
              }}
            >
              <ChevronLeftRounded />
              <Typography>Go Back</Typography>
            </IconButton>,
          ]}
        >
          <Typography className="text-2xl">
            {viewType.current === "upcoming"
              ? `View based on filter:  ${filterType}`
              : viewType.current == "aging"
                ? `Aging-wise outstanding values`
                : `All parties outstanding values`}
          </Typography>
          <br />
          <Container className="overflow-x-auto flex">
            <PieChart
              width={300}
              height={300}
              margin={{ top: 100, left: 100, bottom: 100, right: 100 }}
              sx={{
                flex: 1,
                borderWidth: 2,
                borderRadius: 4,
                marginBottom: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
              slotProps={{
                legend: {
                  hidden: true,
                  position: {
                    horizontal: "right",
                    vertical: "bottom",
                  },
                },
              }}
              series={[
                {
                  data: rows.map((entry: any) => {
                    return {
                      label: entry.partyName,
                      value: entry.amount,
                    };
                  }),
                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: 1,
                  cornerRadius: 5,
                  startAngle: 0,
                  endAngle: 360,
                  // cx: 150,
                  // cy: 150,
                },
              ]}
            />
          </Container>
        </CardView>
      ),
      className: "",
      children: [],
    },
    {
      type: "item",
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
                filterValue.current || "",
              );
              localStorage.setItem("party_view_type", viewType.current || "");
              localStorage.setItem("party_bill_type", billType.current || "");
              localStorage.setItem(
                "party_filter_type",
                filterType.current || "",
              );
              localStorage.setItem("bill_party_name", params.row.partyName);
              router.push("/dashboard/outstanding/bill-detail");
            }}
          />
        </CardView>
      ),
      className: "",
      children: [],
    },
  ];

  if (!hasPermission) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
      <Typography className="text-2xl font-bold flex items-center justify-center flex-1 pl-2 pr-2">
          Get the Premium For this Service Or Contact Admin - 7977662924
        </Typography>
    </div>
    );
  }

  return (
    <div className="w-full" style={{}}>
      <Grid
        container
        sx={{
          flexGrow: 1,
          height: "100vh",
        }}
      >
        {RenderGrid(gridConfig)}
      </Grid>
    </div>
  );
};

export default Page;
