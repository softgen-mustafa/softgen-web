"use client";

import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { SearchInput } from "./text_inputs";

interface TableViewProps {
  columns: GridColDef<any>[];
  refresh?: boolean;
  useServerPagination?: boolean;
  onApi: (
    page: number,
    pageSize: number,
    searchText?: string
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
  useServerPagination = true,
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
      }
    );
  }, [refresh]);

  return (
    <Box className="h-fit">
      {loading && (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      )}
      {useSearch && (
        <div className="w-full flex flex-row justify-end mb-4">
          <SearchInput
            placeHolder="Search..."
            onTextChange={(value) => {
              setLoading(true);
              onApi(
                paginationModel.page + 1,
                paginationModel.pageSize,
                value
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
        rows={!rows ? [] : rows}
        // className="h-fit max-h-fit"
        rowCount={useServerPagination ? 10000 : rows?.length}
        pagination
        paginationMode={useServerPagination ? "server" : "client"}
        paginationModel={paginationModel}
        initialState={{
          pagination: {
            paginationModel: paginationModel,
          },
        }}
        pageSizeOptions={[10, 25, 50, 75, 100]}
        onRowClick={(params) => {
          onRowClick(params);
        }}
        loading={loading}
        onPaginationModelChange={(value) => {
          setPaginationModel(value);
          setLoading(true);
          if (useServerPagination) {
            onApi(value.page + 1, value.pageSize).then((entries) => {
              setRows(entries);
              setLoading(false);
            });
          } else {
            setLoading(false);
          }
        }}
        sx={{
          height: "100%",
          width: "100%",
          "& .MuiDataGrid-cell": {
            wordBreak: "break-word",
          },
        }}
        slots={{
          noRowsOverlay: () => <Typography>No result found</Typography>,
        }}
      />
    </Box>
  );
};

export { DataTable };
