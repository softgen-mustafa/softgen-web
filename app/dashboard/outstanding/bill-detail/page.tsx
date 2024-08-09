"use client";
import { numericToString } from "@/app/services/Local/helper";
import { getBmrmBaseUrl, postAsync } from "@/app/services/rest_services";
import { DataTable } from "@/app/ui/data_grid";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { ChevronLeftRounded } from "@mui/icons-material";
import { Grid, IconButton, Typography, Container } from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import FeatureControl from "@/app/components/featurepermission/page";
const Page = ({}) => {
  let partyName = useRef("");
  let filterValue = useRef("");
  let viewType = useRef("");
  let billType = useRef("");
  let filterType = useRef("");

  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkPermissionAndInitialize();
  }, []);

  const checkPermissionAndInitialize = async () => {
    const permission = await FeatureControl("PartyBillDetailScreen");
    setHasPermission(permission);
    if (permission) {
      partyName.current = localStorage.getItem("bill_party_name") || "";
      filterValue.current = localStorage.getItem("party_filter_value") || "";
      viewType.current = localStorage.getItem("party_view_type") || "";
      billType.current = localStorage.getItem("party_bill_type") || "";
      filterType.current = localStorage.getItem("party_filter_type") || "";
      onApi(1, 10);
    }
  };
  // useEffect(() => {
  //   partyName.current = localStorage.getItem("bill_party_name") || "";
  //   filterValue.current = localStorage.getItem("party_filter_value") || "";
  //   viewType.current = localStorage.getItem("party_view_type") || "";
  //   billType.current = localStorage.getItem("party_bill_type") || "";
  //   filterType.current = localStorage.getItem("party_filter_type") || "";
  //   onApi(1, 10);
  // }, []);

  const [rows, setRows] = useState([]);

  const columns: GridColDef<any[number]>[] = [
    {
      field: "billDate",
      headerName: "Date",
      editable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: "billNumber",
      headerName: "Bill No.",
      editable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Value",
      editable: false,
      sortable: true,
      flex: 1,
      type: "number",
      valueGetter: (value, row) =>
        `${row.currency || ""} ${numericToString(row.amount) || "0"}`,
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      editable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: "breachDays",
      headerName: "Delay Days",
      editable: false,
      sortable: true,
      type: "number",
      flex: 1,
    },
  ];

  const gridConfig: GridConfig[] = [
    {
      type: "item",
      view: (
        <CardView
          className="h-fit max-h-fit"
          title="Bill Detail"
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
          <Typography className="text-lg">Party Name,</Typography>
          <Typography className="text-2xl">{partyName.current}</Typography>
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
                      label: entry.billNumber,
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
        <CardView title="Bills">
          <DataTable
            columns={columns}
            useSearch={true}
            onApi={async (page, pageSize, searchText) => {
              return onApi(page, pageSize, searchText);
            }}
            onRowClick={(params) => {
              localStorage.setItem("billNumber", params.row.billNumber);
              localStorage.setItem("party_view_type", "outstanding");
              router.push("/dashboard/vouchers/voucherDetails");
            }}
          />
        </CardView>
      ),
      className: "",
      children: [],
    },
  ];

  const onApi = async (
    page: number,
    pageSize: number,
    searchValue?: string
  ) => {
    let party = partyName.current.replace("&", "%26");
    let collectionUrl = `${getBmrmBaseUrl()}/bill/get/upcoming-bill-detail`;
    let agingUrl = `${getBmrmBaseUrl()}/bill/get/aging-bill-detail?agingCode=${
      filterValue.current
    }&groupType=${billType.current}&partyName=${party}`;
    let totalOutstandingUrl = `${getBmrmBaseUrl()}/bill/get/party-bill-detail?groupType=${
      billType.current
    }&partyName=${party}`;

    let url = totalOutstandingUrl;
    if (viewType.current === "upcoming") {
      url = collectionUrl;
    } else if (viewType.current === "aging") {
      url = agingUrl;
    }
    let requestBody = {};
    if (viewType.current === "upcoming") {
      requestBody = {
        groupType: billType.current,
        durationType: filterType.current,
        durationKey: filterValue.current,
        partyName: partyName.current,
        filter: {
          page_number: page,
          page_size: pageSize,
          search_text: searchValue ?? "",
          sort_by: "billNumber",
          sort_order: "asc",
        },
      };
    } else {
      requestBody = {
        page_number: page,
        page_size: pageSize,
        search_text: searchValue ?? "",
        sort_by: "billNumber",
        sort_order: "",
      };
    }
    try {
      let response = await postAsync(url, requestBody);
      let entries = response.map((entry: any, index: number) => {
        return {
          id: index + 1, //entry.bill_id,
          billNumber: entry.billNumber,
          amount: entry.totalAmount,
          dueDate: entry.dueDate,
          breachDays: entry.breachDays,
          billDate: entry.billDate,
          currency: entry.currency ?? "₹",
        };
      });

      setRows(entries);
      console.log(
        `requestBody Party bill Detail : ${JSON.stringify(response)}`
      );
      return entries;
    } catch {}
    //  console.log(`requestBody Party bill Detail : ${JSON.stringify(entries,  0 , index =2 )}`)
  };

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
        className="bg-gray-200"
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
