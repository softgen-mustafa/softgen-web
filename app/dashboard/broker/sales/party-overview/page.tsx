"use client";
import { getBmrmBaseUrl, postAsync } from "@/app/services/rest_services";
import { useEffect, useState } from "react";
import { Typography, IconButton, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { GridColDef } from "@mui/x-data-grid";
import { ChevronLeftRounded } from "@mui/icons-material";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { DataTable } from "@/app/ui/data_grid";
import Cookies from "js-cookie";

const Page = () => {
  const router = useRouter();
  const [refresh, triggerRefresh] = useState(false);

  useEffect(() => {}, []);

  const loadData = async () => {
    try {
      const fromDate = Cookies.get("fromDate");
      const toDate = Cookies.get("toDate");

      let brokerName = localStorage.getItem("brokerName");
      let url = `${getBmrmBaseUrl()}/broker-sales/party/overview?brokerName=${brokerName}`;
      let requestBody = {
        startDate: fromDate ? fromDate : "",
        endDate: toDate ? toDate : "",
      };
      let response = await await postAsync(url, requestBody);
      if (response && response.length > 0) {
        let entries = response.map((_data: any, index: number) => {
          return {
            id: index + 1,
            partyName: _data.partyName,
            preGstAmount: `\u20B9 ${_data.preGstAmount.toLocaleString()}`,
            postGstAmount: `\u20B9 ${_data.postGstAmount.toLocaleString()}`,
          };
        });
        return entries;
      }
    } catch {
      return [];
    }
  };

  const columns: GridColDef[] = [
    {
      field: "partyName",
      headerName: "Party",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
    },
    {
      field: "preGstAmount",
      headerName: "Value",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
    },
    {
      field: "postGstAmount",
      headerName: "Post Tax",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
    },
  ];

  const gridConfig: GridConfig[] = [
    {
      type: "item",
      className: "",
      view: (
        <CardView
          title={"Overview"}
          className="h-fit"
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
          <DataTable
            columns={columns}
            refresh={refresh}
            useSearch={false}
            useServerPagination={false}
            onApi={async (page, pageSize, searchText) => {
              return await loadData();
            }}
            onRowClick={(params) => {
              localStorage.setItem("partyName", params.row.partyName);
              router.push("/dashboard/broker/sales/bill-overview");
            }}
          />
        </CardView>
      ),
      children: [],
    },
  ];

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
