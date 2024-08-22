"use client";
import { numericToString } from "@/app/services/Local/helper";
import { getBmrmBaseUrl, postAsync } from "@/app/services/rest_services";
import { DataTable } from "@/app/ui/data_grid";
import { CardView, DynGrid, GridDirection, RenderGrid, Weight } from "@/app/ui/responsive_grid";
import { ChevronLeftRounded } from "@mui/icons-material";
import {
  Grid,
  IconButton,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FeatureControl } from "@/app/components/featurepermission/permission_helper";

const Page = ({}) => {
  let partyName = useRef("");
  let amount = useRef("");
  let groupType = useRef("");
  let agingCode = useRef("");

  const router = useRouter();

  useEffect(() => {
      partyName.current = localStorage.getItem("os_partyName") || "";
      amount.current = localStorage.getItem("os_amount") || "";
      groupType.current = localStorage.getItem("os_groupType") || "";
      agingCode.current = localStorage.getItem("os_agingCode") || "";
  }, []);


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

  const gridConfig= [
    {
        weight: Weight.Low,
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
          <Typography className="text-md">Party Name,</Typography>
          <Typography className="text-xl mt-2">{partyName.current}</Typography>
          <Typography className="text-md">Amount,</Typography>
          <Typography className="text-xl mt-2">{amount.current}</Typography>
          <Container className="overflow-x-auto flex mt-4">
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
    },
    {
        weight: Weight.High,
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
    },
  ];

  const onApi = async (
    page: number,
    pageSize: number,
    searchValue?: string
  ) => {
    let party = partyName.current.replace("&", "%26");
    let agingUrl = `${getBmrmBaseUrl()}/bill/get/aging-bill-detail?agingCode=${
      agingCode.current
    }&groupType=${groupType.current}&partyName=${party}`;
    let totalOutstandingUrl = `${getBmrmBaseUrl()}/bill/get/party-bill-detail?groupType=${
      groupType.current
    }&partyName=${party}`;


    let url = totalOutstandingUrl;
    if (agingCode.current !== null && agingCode.current !== "all") {
      url = agingUrl;
    }

    let requestBody = {};
      requestBody = {
        page_number: page,
        page_size: pageSize,
        search_text: searchValue ?? "",
        sort_by: "billNumber",
        sort_order: "asc",
      };
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
  };

  return (
    <div className="w-full" style={{}}>
    <DynGrid views={gridConfig} direction={GridDirection.Column}/>
    </div>
  );
};

export default Page;
