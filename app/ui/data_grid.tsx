"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";

interface TableViewProps {
  columns: GridColDef<any>[];
  onApi: (page: number, pageSize: number) => Promise<any[]>;
  onRowClick: (params: any) => void;
}

const DataTable: React.FC<TableViewProps> = ({ columns, onApi, onRowClick }) => {
  const [rows, setRows] = useState<any[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    onApi(paginationModel.page + 1, paginationModel.pageSize).then((entries) => {
      setRows(entries);
    })
  }, [columns])

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      rowCount={10000}
      pagination
      paginationMode="server"
      paginationModel={paginationModel}
      initialState={{
        pagination: {
          paginationModel: paginationModel,
        },
      }}
      pageSizeOptions={[5, 10, 25, 50, 75, 100]}
      disableRowSelectionOnClick
      onRowClick={(params) => {
        onRowClick(params);
      }}
      onPaginationModelChange={(value) => {
        setPaginationModel(value);
        onApi(value.page + 1, value.pageSize).then((entries) => {
          setRows(entries);
        });
      }}
    />
  );
};

export { DataTable };
