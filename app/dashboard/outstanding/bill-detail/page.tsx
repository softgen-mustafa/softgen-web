"use client";
import { getBmrmBaseUrl, postAsync } from "@/app/services/rest_services";
import { DataTable } from "@/app/ui/data_grid";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { ChevronLeftRounded } from "@mui/icons-material";
import {
  Grid,
  IconButton,
  Typography,
  Container,
} from "@mui/material";
import { PieChart } from "@mui/x-charts";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const Page = ({}) => {
    let partyName: string = "";
    let filterValue: string = "";
    let viewType: string = "";
    let billType: string = "";
    let filterType: string = "";


  const router = useRouter();

  useEffect(() => {
    partyName= localStorage.getItem("bill_party_name") || "";
    filterValue = localStorage.getItem("party_filter_value") || "";
    viewType = localStorage.getItem("party_view_type") || "" ;
    billType = localStorage.getItem("party_bill_type") || "" ;
    filterType = localStorage.getItem("party_filter_type") || "";


    onApi(1, 10);
  }, []);

  const [rows, setRows] = useState([]);

  const columns: GridColDef<any[number]>[] = [
    {
      field: "billDate",
      headerName: "Date",
      editable: false,
      sortable: true,
      minWidth: 50,
      maxWidth: 400,
    },
    {
      field: "billNumber",
      headerName: "Bill No.",
      editable: false,
      sortable: true,
      minWidth: 50,
      maxWidth: 400,
    },
    {
      field: "amount",
      headerName: "Value",
      editable: false,
      sortable: true,
      minWidth: 50,
      maxWidth: 400,
      valueGetter: (value, row) => `${row.currency || ""} ${row.amount || "0"}`,
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      editable: false,
      sortable: true,
      minWidth: 50,
      maxWidth: 400,
    },
    {
      field: "breachDays",
      headerName: "Delay Days",
      editable: false,
      sortable: true,
      minWidth: 50,
      maxWidth: 400,
    },
  ];

  let searchText = useRef("");

  const gridConfig: GridConfig[] = [
    {
      type: "item",
      view: (
        <CardView className="">
          <div className="flex flex-row items-center">
            <IconButton
              onClick={() => {
                router.back();
              }}
            >
              <ChevronLeftRounded />
            </IconButton>
            <Typography>Go Back</Typography>
          </div>
          <br />
          <Typography className="text-lg">Party Name,</Typography>
          <Typography className="text-2xl">{partyName}</Typography>
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
                  paddingAngle: 5,
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
        <CardView>
          <DataTable
            columns={columns}
            onApi={async (page, pageSize) => {
              return onApi(page, pageSize);
            }}
            onRowClick={(params) => {}}
          />
        </CardView>
      ),
      className: "",
      children: [],
    },
  ];

  const onApi = async (page: number, pageSize: number) => {
    let party = partyName.replace("&", "%26");
    let collectionUrl = `${getBmrmBaseUrl()}/bill/get/upcoming-bill-detail`;
    let agingUrl = `${getBmrmBaseUrl()}/bill/get/aging-bill-detail?agingCode=${filterValue}&groupType=${billType}&partyName=${party}`;
    let totalOutstandingUrl = `${getBmrmBaseUrl()}/bill/get/party-bill-detail?groupType=${billType}&partyName=${party}`;

    let url = totalOutstandingUrl;
    if (viewType === "upcoming") {
      url = collectionUrl;
    } else if (viewType === "aging") {
      url = agingUrl;
    }
    let requestBody;
    if (viewType === "upcoming") {
      requestBody = {
        groupType: billType,
        durationType: filterType,
        durationKey: filterValue,
        partyName: partyName,
        filter: {
          page_number: page,
          page_size: pageSize,
          search_text: searchText.current,
          sort_by: "billNumber",
          sort_order: "asc",
        },
      };
    } else {
      requestBody = {
        page_number: page,
        page_size: pageSize,
        search_text: searchText.current,
        sort_by: "billNumber",
        sort_order: "",
      };
    }
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

    //  console.log(`requestBody Party bill Detail : ${JSON.stringify(entries,  0 , index =2 )}`)

    setRows(entries);

    return entries;
  };

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
