"use client";

import { numericToString } from "@/app/services/Local/helper";
import { getAsync, getBmrmBaseUrl } from "@/app/services/rest_services";
import { TextInput } from "@/app/ui/text_inputs";
import { CircularProgress } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useRef, useState } from "react";

const RankedPartyOutstandingCard = ({ billType }: { billType: string }) => {
  let rank = useRef(5);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const loadData = async () => {
    try {
      setLoading(true);
      let url = `${getBmrmBaseUrl()}/bill/get/party-os/overview?groupType=${billType}&rank=${
        rank.current
      }`;
      let response = await getAsync(url);
      let values = response.map((entry: any) => {
        return {
          id: entry.name,
          name: entry.name,
          amount: entry.totalAmount,
          currency: entry.currency ?? "₹",
        };
      });
      setRows(values);
    } catch {
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <TextInput
        mode={"number"}
        placeHolder="Enter Rank"
        onTextChange={(value) => {
          rank.current = value && value.length > 0 ? parseInt(value) : 5;
          loadData();
        }}
      />
      <br />
      {loading && (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      )}

      <DataGrid
        columns={columns}
        rows={rows}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        onRowClick={(params) => {}}
        pageSizeOptions={[5, 10, 25, 50, 75, 100]}
        disableRowSelectionOnClick
        onPaginationModelChange={(value) => {}}
      />
    </div>
  );
};

export default RankedPartyOutstandingCard;
