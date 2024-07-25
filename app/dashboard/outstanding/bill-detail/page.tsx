"use client";
import { getBmrmBaseUrl, postAsync } from "@/app/services/rest_services";
import { Grid, Card, CardContent } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

const Page = ({}) => {
  const partyName: string = localStorage.getItem("bill_party_name") || "";
  const filterValue = localStorage.getItem("party_filter_value");
  const viewType = localStorage.getItem("party_view_type");
  const billType = localStorage.getItem("party_bill_type");
  const filterType = localStorage.getItem("party_filter_type") || null;

  useEffect(() => {
    onApi(pagingationModel);
  }, []);

  const [rows, setRows] = useState([]);
  const [pagingationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

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

  const onApi = async ({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }) => {
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
          page_number: page + 1,
          page_size: pageSize,
          search_text: "",
          sort_by: "billNumber",
          sort_order: "asc",
        },
      };
    } else {
      requestBody = {
        page_number: page + 1,
        page_size: pageSize,
        search_text: "",
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
    <div
      className="w-full"
      style={{
        paddingTop: 60,
      }}
    >
      <Grid
        container
        className="h-full w-full justify-start flex"
        columnGap={4}
      >
        <Grid item xs={12} sm={12} md={6} className="w-full h-full">
          <Card className="flex">
            <CardContent>
              <DataGrid
                columns={columns}
                rows={rows}
                rowCount={rows.length * 1000}
                pagination
                paginationMode="server"
                paginationModel={pagingationModel}
                initialState={{
                  pagination: {
                    paginationModel: pagingationModel,
                  },
                }}
                pageSizeOptions={[5, 10, 25, 50, 75, 100]}
                disableRowSelectionOnClick
                onPaginationModelChange={(value) => {
                  setPaginationModel(value);
                  onApi(value);
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Page;
