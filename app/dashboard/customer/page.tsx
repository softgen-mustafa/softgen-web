"use client";
import { getBmrmBaseUrl, postAsync } from "@/app/services/rest_services";
import { DataTable } from "@/app/ui/data_grid";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { Grid, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FeatureControl from "@/app/components/featurepermission/page";

const CustomerPartySearch = () => {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    FeatureControl("CustomerPartySearch").then((permission) => {
      setHasPermission(permission);
      if (permission) {
        onApi(1, 10);
      }
      // else {
      //   <Typography variant="h4">Get premium for the service </Typography>;

      //   // router.back();
      //   // Toast("Access Denied for Customer Overview");
      // }
    });
  }, []);

  const columns: GridColDef<any[number]>[] = [
    {
      field: "partyName",
      headerName: "Name",
      editable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: "mobileNo",
      headerName: "Mobile",
      editable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: "landlineNumber",
      headerName: "Landline Number",
      editable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: "emailId",
      headerName: "EmailId",
      editable: false,
      sortable: true,
      flex: 1,
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
        {" "}
        {hasPermission ? (
          RenderGrid(gridConfig)
        ) : (
          <Typography className="text-2xl font-bold flex items-center justify-center flex-1 pl-2 pr-2">
            Get the Premium For this Service Or Contact Admin - 7977662924
          </Typography>
        )}
      </Grid>
    </div>
  );
};

export default CustomerPartySearch;
