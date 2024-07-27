"use client";

import { Container } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { SearchInput } from "./text_inputs";

interface TableViewProps {
  columns: GridColDef<any>[];
  refresh?: boolean;
  onApi: (
    page: number,
    pageSize: number,
    searchText?: string,
  ) => Promise<any[]>;
  onRowClick: (params: any) => void;
  useSearch?: boolean;
}

const DataTable: React.FC<TableViewProps> = ({
  columns,
  refresh,
  onApi,
  onRowClick,
  useSearch,
}) => {
  const [rows, setRows] = useState<any[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    onApi(paginationModel.page + 1, paginationModel.pageSize).then(
      (entries) => {
        setRows(entries);
      },
    );
  }, [columns, refresh]);

  return (
    <Container>
      {useSearch && (
        <SearchInput
          placeHolder="Search..."
          onTextChange={(value) => {
            onApi(paginationModel.page + 1, paginationModel.pageSize, value);
          }}
        />
      )}
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
    </Container>
  );
};

export { DataTable };
