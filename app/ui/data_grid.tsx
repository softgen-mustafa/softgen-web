"use client";

import { Box, Button, Checkbox, IconButton, Typography } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridColumnVisibilityModel,
} from "@mui/x-data-grid";
import React, { useEffect, useRef, useState } from "react";
import { SearchInput } from "./text_inputs";
import { useTheme } from "@mui/material/styles";
import { inspiredPalette } from "./theme";

import { FilterAlt, Sync } from "@mui/icons-material";

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
  useCustomSorting?: boolean;
  SortingView?: React.FC | null;
}

const DataTable: React.FC<TableViewProps> = ({
  columns,
  refresh,
  onApi,
  onRowClick,
  useSearch,
  useServerPagination = true,
  useCustomSorting = false,
  SortingView = null,
}) => {
  const theme = useTheme();

  const [rows, setRows] = useState<any[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [loading, setLoading] = useState(false);

  const [openFilter, toggleFilter] = useState(false);
  const [filterColumns, setFilterColumns] = useState(columns ?? []);

  const [columnVisibility, changeColumnVisibility] = useState<any>({});

  const [sync, toggleSync] = useState(false);

  useEffect(() => {
    setLoading(true);
    setFilterColumns(columns);
    let visibility: any = {};
    columns.map((entry: any) => {
      visibility[entry.field] = true;
    });
    changeColumnVisibility(visibility);

    onApi(paginationModel.page + 1, paginationModel.pageSize).then(
      (entries) => {
        setRows(entries);
        setLoading(false);
      }
    );
  }, [refresh]);

  useEffect(() => {
    setLoading(true);
    onApi(paginationModel.page + 1, paginationModel.pageSize).then(
      (entries) => {
        setRows(entries);
        setLoading(false);
      }
    );
  }, [sync]);

  return (
    <Box className="h-fit" sx={{ maxHeight: 600, overflow: "auto" }}>
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

      {useCustomSorting && SortingView && <SortingView />}

      <div className="w-full flex justify-between">
        <div
          style={{
            marginRight: 8,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            style={{
              borderWidth: 1,
              borderRadius: 4,
              borderColor: inspiredPalette.lightTextGrey,
            }}
          >
            <IconButton
              className="w-full justify-between"
              sx={{
                color: theme.palette.primary.main,
              }}
              onClick={() => {
                toggleSync(!sync);
              }}
            >
              {openFilter && <Typography>Sync</Typography>}
              <Sync />
            </IconButton>
          </Box>
          <Box
            style={{
              marginTop: 6,
              borderWidth: 1,
              borderRadius: 4,
              borderColor: inspiredPalette.lightTextGrey,
            }}
          >
            <IconButton
              className="w-full justify-between"
              sx={{
                color: theme.palette.primary.main,
              }}
              onClick={() => {
                toggleFilter(!openFilter);
              }}
            >
              {openFilter && <Typography>Filter</Typography>}
              <FilterAlt />
            </IconButton>
          </Box>

          {openFilter && (
            <Box
              className="w-auto h-full  "
              style={{
                minWidth: 200,
                fontSize: 14,
                borderWidth: 1,
                borderRadius: 2,
                borderColor: inspiredPalette.lightTextGrey,
              }}
            >
              {filterColumns.map((entry: any, index: number) => {
                return (
                  <Box
                    key={index}
                    className="flex flex-row justify-start items-center px-2 "
                  >
                    <Checkbox
                      checked={columnVisibility[entry.field]}
                      defaultChecked={!entry.hidable}
                      onChange={() => {
                        try {
                          const newFilterColumns = filterColumns.map(
                            (column: any) => {
                              if (entry.field === column.field) {
                                return { ...column, hidable: !column.hidable };
                              }
                              return column;
                            }
                          );

                          const newColumnVisibility = {
                            ...columnVisibility,
                            [entry.field]: !columnVisibility[entry.field],
                          };

                          changeColumnVisibility(newColumnVisibility);
                          setFilterColumns(newFilterColumns);
                        } catch {
                        } finally {
                          setLoading(false);
                        }
                      }}
                    />
                    <Typography>{entry.headerName}</Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </div>
        <DataGrid
          columns={filterColumns}
          rows={!rows ? [] : rows}
          autoHeight={true}
          rowCount={useServerPagination ? 10000 : rows?.length}
          pagination
          paginationMode={useServerPagination ? "server" : "client"}
          paginationModel={paginationModel}
          disableColumnSelector={useCustomSorting}
          disableColumnMenu={useCustomSorting}
          initialState={{
            pagination: {
              paginationModel: paginationModel,
            },
            columns: {
              columnVisibilityModel: columnVisibility,
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
          columnHeaderHeight={40}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            fontSize: 14,
            width: "100%",

            "& .MuiDataGrid-main": {
              borderRadius: 2,
            },
            "& .MuiDataGrid-cell": {
              wordBreak: "break-word",
            },
            "& .MuiDataGrid-columnHeaders": {
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
              borderBottomWidth: 2,
              borderBottomColor: theme.palette.primary.main,
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              textTransform: "uppercase",
              fontSize: 14,
              fontWeight: "bold",
              color: inspiredPalette.dark,
            },
          }}
          columnVisibilityModel={columnVisibility}
          onColumnVisibilityModelChange={(newModel) => {}}
          slots={{
            noRowsOverlay: () => <Typography>No result found</Typography>,
          }}
        />
      </div>
    </Box>
  );
};

export { DataTable };
