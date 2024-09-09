"use client";

import { numericToString } from "@/app/services/Local/helper";
import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import { DataTable } from "@/app/ui/data_grid";
import {
  PeriodicTable,
  TableColumn,
} from "@/app/ui/periodic_table/period_table";
import { TextInput } from "@/app/ui/text_inputs";
import { CircularProgress } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";

const RankedPartyOutstandingCard = ({
  billType,
  companyId,
}: {
  billType: string;
  companyId: string;
}) => {
  let rank = useRef(5);
  const [rows, setRows] = useState([]);
  const [refresh, triggerRefresh] = useState(false);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Party",
      editable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Value",
      type: "number",
      editable: false,
      sortable: true,
      flex: 1,
      valueGetter: (value, row) =>
        `${row.currency || ""} ${
          row.amount != null ? numericToString(row.amount) : "0"
        }`,
    },
  ];

  useEffect(() => {
    loadData();
  }, [billType]);

  const loadData = async (searchText?: string | number) => {
    try {
      let url = `${getBmrmBaseUrl()}/bill/get/party-os/overview?groupType=${billType}&rank=${searchText}`;
      let response = await getAsync(url);
      let values = response.map((entry: any) => {
        return {
          id: entry.name,
          name: entry.name,
          amount: entry.totalAmount,
          // amount: `${entry.currency ?? "₹"} ${numericToString(
          //   entry.totalAmount
          // )}`,
          currency: entry.currency ?? "₹",
        };
      });
      return values;
      // setRows(values);
    } catch {
    } finally {
    }
  };
  return (
    <div>
      {/* <TextInput
        mode={"number"}
        placeHolder="Enter Rank"
        onTextChange={(value) => {
          rank.current = value && value.length > 0 ? parseInt(value) : 5;
          loadData();
        }}
      />
      <br /> */}
      {/* {loading && (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      )} */}
      {/* <DataTable
        columns={columns}
        refresh={refresh}
        useSearch={true}
        useServerPagination={false}
        onApi={async (page, pageSize, searchText) => {
          return await loadData(searchText?.length ? searchText : rank.current);
        }}
        onRowClick={() => {}}
      /> */}
      <PeriodicTable
        chartKeyFields={[
          {
            label: "Party",
            value: "name",
          },
        ]}
        chartValueFields={[
          {
            label: "Amount",
            value: "amount",
          },
        ]}
        useSearch={false}
        columns={columns.map((col: any) => {
          let column: TableColumn = {
            header: col.headerName,
            field: col.field,
            type: "text",
            pinned: false,
            rows: [],
          };
          return column;
        })}
        onApi={() => loadData(rank.current)}
      />
    </div>
  );
};

export default RankedPartyOutstandingCard;
