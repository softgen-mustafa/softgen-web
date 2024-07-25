"use client";
import { getBmrmBaseUrl, postAsync } from "@/app/services/rest_services";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

const Page = ({}) => {

  const partyName: string = localStorage.getItem("bill_party_name") || "";
  const filterValue = localStorage.getItem("party_filter_value");
  const viewType = localStorage.getItem("party_view_type");
  const billType = localStorage.getItem("party_bill_type"); 
  const filterType = localStorage.getItem("party_filter_type") || null; 

  useEffect(() => {
    onApi();
  }, [])

  const [rows, setRows] = useState([])
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



  const onApi = async () => {
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
          page_number: 0,
          page_size: 20,
          search_text: "",
          sort_by: "billNumber",
          sort_order: "asc",
        },
      };
    } else {
      requestBody = {
        page_number: 0,
        page_size: 20,
        search_text: "",
        sort_by: "billNumber",
        sort_order: "",
      };
    }
    let response = await postAsync(url, requestBody);
    
    let entries = response.map((entry: any, index: number) => {
      return {
        id: index + 1,//entry.bill_id,
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

  return (<div>
    <h3>Bill Detail</h3>
      <DataGrid
        columns={columns}
        rows={rows}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25, 50, 75, 100]}
        disableRowSelectionOnClick
        onPaginationModelChange={(value) => {
          alert(`page model:  ${JSON.stringify(value)}`);
        }}
      />
  </div>);
}

export default Page;