"use client";
import {
  getAsync,
  getBmrmBaseUrl,
  postAsync,
} from "@/app/services/rest_services";
import { useEffect, useRef, useState } from "react";
import { Typography, IconButton, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { GridColDef } from "@mui/x-data-grid";
import { ChevronLeftRounded } from "@mui/icons-material";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { DataTable } from "@/app/ui/data_grid";
import { DropDown } from "@/app/ui/drop_down";
import { numericToString } from "@/app/services/Local/helper";

const Page = () => {
  const router = useRouter();
  const [refresh, triggerRefresh] = useState(false);
  const [filterData, setFilterData] = useState([]);

  let selection = useRef("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/aging-settings`;
      let response = await getAsync(url);

      if (response && response.length > 0) {
        let values: any = [{ title: "All", code: "all" }];
        response.map((_data: any) => {
          values.push({
            title: _data.title,
            code: _data.agingCode,
          });
        });
        setFilterData(values);
      }
    } catch (error) {
      console.log("Something went wrong...");
    }
  };

  const onApi = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/broker-outstanding/broker/overview`;
      let requestBody = {
        aging_code: selection.current,
      };
      let response = await postAsync(url, requestBody);
      if (response && response.length > 0) {
        let entries = response.map((_data: any, index: number) => ({
          id: index + 1,
          brokerName: _data.brokerName,
          amount: `\u20B9 ${numericToString(_data.amount)}`,
        }));
        return entries;
      }
      console.log(response);
    } catch {
      return [];
    }
  };

  const columns: GridColDef[] = [
    {
      field: "brokerName",
      headerName: "Party",
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
          <DropDown
            label={"Filter"}
            displayFieldKey={"title"}
            valueFieldKey={null}
            selectionValues={filterData}
            helperText={""}
            onSelection={(_data) => {
              selection.current = _data?.code;
              triggerRefresh(!refresh);
            }}
          />
          <br />
          <DataTable
            columns={columns}
            refresh={refresh}
            useSearch={false}
            useServerPagination={false}
            onApi={async (page, pageSize, searchText) => {
              return await onApi();
            }}
            onRowClick={(params) => {
              localStorage.setItem("partyName", params.row.partyName);
              router.push("/dashboard/broker/outstanding/party-overview");
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
