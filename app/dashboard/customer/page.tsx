"use client";
import { getBmrmBaseUrl, postAsync } from "@/app/services/rest_services";
import { DataTable } from "@/app/ui/data_grid";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { CircularProgress, Grid, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FeatureControl } from "@/app/components/featurepermission/permission_helper";
import {
  ApiProps,
  PeriodicTable,
  TableColumn,
  TableSearchKey,
} from "@/app/ui/periodic_table/period_table";
const CustomerPartySearch = () => {
  const router = useRouter();
  const [rows, setRows] = useState([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    /*FeatureControl("CustomerPartySearch").then((permission) => {
      setHasPermission(permission);
      // if (permission) {
      //   onApi(1, 10);
      // }
      // else {
      //   <Typography variant="h4">Get premium for the service </Typography>;

      //   // router.back();
      //   // Toast("Access Denied for Customer Overview");
      // }
    }); */
  }, []);

  const columns: GridColDef<any[number]>[] = [
    {
      field: "id",
      headerName: "Id",
      editable: false,
      sortable: false,
      hideable: true,
      flex: 1,
      minWidth: 250,
    },
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

  const sortKeys: TableSearchKey[] = [
    {
      title: "Name",
      value: "name",
    },
  ];

  const onApi = async (apiProps: ApiProps) => {
    let url = `${getBmrmBaseUrl()}/ledger/get/customers`;

    let requestBody = {
      page_number: apiProps.offset + 1,
      page_size: apiProps.limit,
      search_text: apiProps.searchText ?? "",
      sort_by: apiProps.sortKey ?? "",
      sort_order: apiProps.sortOrder ?? "",
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
        <CardView title="Customer Search">
          {/* <Typography variant="h4">Customer Search</Typography> */}
          {/* <DataTable
            columns={columns}
            onApi={async (page, pageSize) => {
              return onApi(page, pageSize);
            }}
            onRowClick={(params) => {
              localStorage.setItem("party_filter_value", params.row.id);
              router.push("/dashboard/customer/details");
            }}
          /> */}
          <PeriodicTable
            useSearch={false}
            columns={columns.map((col: any) => {
              let column: TableColumn = {
                header: col.headerName,
                field: col.field,
                type: "text",
                pinned: false,
                hideable: col.hideable,
                rows: [],
              };
              return column;
            })}
            onApi={onApi}
            sortKeys={sortKeys}
            onRowClick={(rowData) => {
              localStorage.setItem(
                "party_filter_value",
                JSON.stringify(rowData.id),
              );
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
        {hasPermission === null ? (
          <CircularProgress />
        ) : hasPermission ? (
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
