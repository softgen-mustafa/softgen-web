"use client";

import { CircularProgress, Container } from "@mui/material";
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    onApi(paginationModel.page + 1, paginationModel.pageSize).then(
      (entries) => {
        setRows(entries);
        setLoading(false);
      },
    );
  }, [refresh]);

  return (
    <Container>
      {loading && <CircularProgress />}
      {useSearch && (
        <div className="w-full flex flex-row justify-end mb-4">
          <SearchInput
            placeHolder="Search..."
            onTextChange={(value) => {
              setLoading(true);
              onApi(
                paginationModel.page + 1,
                paginationModel.pageSize,
                value,
              ).then((entries) => {
                setRows(entries);
                setLoading(false);
              });
            }}
          />
        </div>
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
        pageSizeOptions={[10, 25, 50, 75, 100]}
        disableRowSelectionOnClick
        onRowClick={(params) => {
          onRowClick(params);
        }}
        onPaginationModelChange={(value) => {
          setPaginationModel(value);
          setLoading(true);
          onApi(value.page + 1, value.pageSize).then((entries) => {
            setRows(entries);
            setLoading(false);
          });
        }}
      />
    </Container>
  );
};

export { DataTable };
