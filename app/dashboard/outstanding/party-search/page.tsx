"use client";
import { getBmrmBaseUrl, postAsync } from "@/app/services/rest_services";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();

  const filterValue = localStorage.getItem("party_filter_value");
  const viewType = localStorage.getItem("party_view_type");
  const billType = localStorage.getItem("party_bill_type"); 
  const filterType = localStorage.getItem("party_filter_type") || null; 

  const [rows, setRows] = useState([]);


  useEffect(() => {
    onApi();
  }, []);


  const onApi = async () => {
    let collectionUrl = `${getBmrmBaseUrl()}/bill/get/upcoming-bills?groupType=${billType}&durationType=${filterType}&durationKey=${
      filterValue
    }`;
    let agingUrl = `${getBmrmBaseUrl()}/bill/get/aging-bills?agingCode=${
      filterValue
    }&groupType=${billType}`;
    let totalOutstandingUrl = `${getBmrmBaseUrl()}/bill/get/all-party-bills?groupType=${billType}`;

    let url = totalOutstandingUrl;
    if (viewType === "upcoming") {
      url = collectionUrl;
    } else if (viewType === "aging") {
      url = agingUrl;
    }

    let requestBody = {
      page_number: 1,
      page_size: 50,
      search_text: "",
      sort_by: "name",
      sort_order: "asc",
    };
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
  };

  const columns: GridColDef<any[number]>[] = [
    {
      field: "partyName",
      headerName: "Name",
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
      field: "billCount",
      headerName: "Total Bills",
      editable: false,
      sortable: true,
      minWidth: 50,
      maxWidth: 400,
    },
  ];


  return (
    <div>
      <h3>Party Search</h3>
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
        onRowClick={(params) => {
          localStorage.setItem("party_filter_value", filterValue || "");
          localStorage.setItem("party_view_type", viewType|| "");
          localStorage.setItem("party_bill_type", billType|| "");
          localStorage.setItem("party_filter_type", filterType|| "");
          localStorage.setItem("bill_party_name", params.row.partyName);
          router.push("/dashboard/outstanding/bill-detail");
        }}
        disableRowSelectionOnClick
        onPaginationModelChange={(value) => {
          alert(`page model:  ${JSON.stringify(value)}`);
        }}
      />
    </div>
  );
}

export default Page;