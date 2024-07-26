"use client";
import { getBmrmBaseUrl, postAsync } from "@/app/services/rest_services";
import { DataTable } from "@/app/ui/data_grid";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { Grid, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const CustomerPartySearch = () => {
  const router = useRouter();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    onApi(1, 10);
  }, []);

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

  const onApi = async (page: number, pageSize: number) => {
    let url = `${getBmrmBaseUrl()}/ledger/get/customers`;

    let requestBody = {
      page_number: page,
      page_size: pageSize,
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

  const gridConfig: GridConfig[] = [
    {
      type: "item",
      view: (
        <CardView>
          <Typography variant="h4">Customer Search</Typography>
          <DataTable
            columns={columns}
            onApi={async (page, pageSize) => {
              return onApi(page, pageSize);
            }}
            onRowClick={(params) => {
              localStorage.setItem("party_filter_value", params.row.id);
              router.push("/dashboard/customer/details");
            }}
          />
        </CardView>
      ),
      className: "",
      children: [],
    },
  ];

  return (
    <div className="w-full">
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

export default CustomerPartySearch;
