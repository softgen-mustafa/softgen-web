"use client";

import { numericToString } from "@/app/services/Local/helper";
import {
  getAsync,
  getBmrmBaseUrl,
  postAsync,
} from "@/app/services/rest_services";
import { DataTable } from "@/app/ui/data_grid";
import { DropDown } from "@/app/ui/drop_down";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { ChevronLeftRounded } from "@mui/icons-material";
import { Grid, IconButton, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface FilterProps {
  title: string;
  agingCode: string | number;
}

const Page = () => {
  const router = useRouter();
  const [refresh, triggerRefresh] = useState(false);
  const [filterData, setFilterData] = useState([]);

  let selectedFilter = useRef("all");
  let partyName = useRef("");

  useEffect(() => {
    partyName.current = localStorage.getItem("partyName") ?? "";
    loadData();
  }, []);

  const loadData = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/aging-settings`;
      let response = await getAsync(url);

      if (response && response.length > 0) {
        let data: any = [{ title: "All", code: "all" }];
        response.map((_data: FilterProps) => {
          data.push({
            billNumber: _data.title,
            code: _data.agingCode,
          });
        });
        setFilterData(data);
      }
    } catch (error) {
      console.log("Something went wrong...");
    }
  };

  const onApi = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/broker-outstanding/bill/overview`;
      let requestBody = {
        aging_code: selectedFilter.current,
        party_name: partyName,
      };
      let response = await postAsync(url, requestBody);
      if (response && response.length > 0) {
        let entries = response.map((_data: any, index: number) => ({
          id: index + 1,
          billNumber: _data.billNumber,
          billDateStr: _data.billDateStr,
          dueDateStr: _data.dueDateStr,
          amount: `\u20B9 ${numericToString(_data.amount)}`,
        }));
        return entries;
      }
      console.log(response);
    } catch (error) {
      console.log("Something went wrong...");
    }
  };

  const columns: GridColDef[] = [
    {
      field: "billNumber",
      headerName: "Bill Number",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
    },
    {
      field: "billDateStr",
      headerName: "Bill Date",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 150,
    },
    {
      field: "dueDateStr",
      headerName: "Due Date",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 180,
    },
    {
      field: "amount",
      headerName: "Value",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 150,
    },
  ];

  const gridConfig: GridConfig[] = [
    {
      type: "item",
      className: "",
      view: (
        <CardView
          title={partyName.current}
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
              selectedFilter.current = _data?.code;
              triggerRefresh(!refresh);
            }}
          />
          <DataTable
            columns={columns}
            refresh={refresh}
            useSearch={false}
            useServerPagination={false}
            onApi={async (page, pageSize, searchText) => {
              return await onApi();
            }}
            onRowClick={(params) => {
              //   localStorage.setItem("partyName", params.row.partyName);
              //   router.push("/dashboard/broker/outstanding/bill-overview");
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
