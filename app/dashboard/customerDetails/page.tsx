"use client";
import { getBmrmBaseUrl, postAsync } from "@/app/services/rest_services";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CustomerPartySearch = () => {
  const router = useRouter();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    onApi();
  }, []);

  const onApi = async () => {
    let url = `${getBmrmBaseUrl()}/ledger/get/customers`;

    let requestBody = {
      page_number: 1,
      page_size: 10000,
      search_text: "",
      sort_by: "name",
      sort_order: "asc",
    };
    let response = await postAsync(url, requestBody);
    let entries = response.map((entry: any, index: number) => {
      return {
        id: entry.id, 
        partyName: entry.name,
        mobileNo: entry.mobile_no,
        landlineNumber: entry.landline_no,
        emailId: entry.email,
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
      field: "mobileNo",
      headerName: "Mobile",
      editable: false,
      sortable: true,
      minWidth: 50,
      maxWidth: 400,
    },
    {
      field: "landlineNumber",
      headerName: "Landline Number",
      editable: false,
      sortable: true,
      minWidth: 50,
      maxWidth: 400,
    },
    {
      field: "emailId",
      headerName: "EmailId",
      editable: false,
      sortable: true,
      minWidth: 50,
      maxWidth: 400,
    },
  ];

  return (
    <div>
      <h3>Customer Search</h3>
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
          localStorage.setItem("party_filter_value", params.row.id);  
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

export default CustomerPartySearch ;
