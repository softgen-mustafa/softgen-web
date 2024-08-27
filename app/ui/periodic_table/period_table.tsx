"use client";
import {
  CircularProgress,
  InputAdornment,
  TextField,
  Box,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  Sync,
  FilterAlt,
  FilterAltOff,
} from "@mui/icons-material";
import React, { useState, useRef, useEffect } from "react";
import { FormControl, MenuItem, Select } from "@mui/material";
import { inspiredPalette } from "../theme";
import {  SketchPicker, TwitterPicker } from "react-color";

interface PeriodicTableProps {
  columns: TableColumn[];
  rows?: any[];
  useSearch: boolean;
  searchKeys?: TableSearchKey[];
  onApi?: (
    offset: number,
    limit: number,
    searchText: string,
    searchKey?: string
  ) => Promise<any[]>;
}

interface TableActionProps {
  onFilterToggle: () => void;
  onSync: () => void;
}

interface TablePaginationProps {
  refresh: boolean;
  onChange: (offset: number, limit: number) => void;
}

interface TableSearchKey {
  title: string;
  value: string;
}

interface TableSearchProps {
  onChange: (searchValue: string, searchKey?: string) => void;
  searchKeys?: TableSearchKey[];
}

interface TableColumn {
  type: string;
  header: string;
  field: string;
  pinned: boolean;
  rows: TableRow[];
  color?: any;
}

interface TableRow {
  type: string;
  value: any;
  onEdit: () => void;
}

interface TableProps {
  columns: TableColumn[];
}

const ColumnColorPicker = ({
  onColorChange,
}: {
  onColorChange: (color: any) => void;
}) => {
  const [state, setState] = useState<any>({
    displayColorPicker: false,
    color: {
      r: "241",
      g: "112",
      b: "19",
      a: "1",
    },
  });

  const handleClick = () => {
    setState({ ...state, displayColorPicker: !state.displayColorPicker });
  };

  const handleClose = () => {
    setState({ ...state, displayColorPicker: false });
  };

  const handleChange = (color: any) => {
    onColorChange(color.rgb);
    setState({ ...state, color: color.rgb });
  };
  let styles: any = {
    color: {
      height: "14px",
      width: "14px",
      borderRadius: "8px",
      background: `rgba(${state.color.r ?? 255}, ${state.color.g ?? 255}, ${
        state.color.b ?? 255
      }, ${state.color.a ?? 255})`,
    },
    swatch: {
      padding: "2px",
      background: "#fff",
      borderRadius: "10px",
      boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
      cursor: "pointer",
    },
    popover: {
      position: "absolute",
      zIndex: "2",
    },
    cover: {
      position: "fixed",
      top: "0px",
      right: "0px",
      bottom: "0px",
      left: "0px",
    },
  };

  return (
    <div>
      <div style={styles.swatch} onClick={handleClick}>
        <div style={styles.color} />
      </div>
      {state.displayColorPicker ? (
        <div style={styles.popover}>
          <div style={styles.cover} onClick={handleClose} />
          <TwitterPicker color={state.color} onChange={handleChange} />
        </div>
      ) : null}
    </div>
  );
};

const TableColumnView = ({
  column,
  onColorPick,
}: {
  column: TableColumn;
  onColorPick: (color: any) => void;
}) => {
  const theme = useTheme();

  return (
    <Box>
      <Box
        className="pr-2 flex flex-row items-center justify-between"
        sx={{
          minHeight: 60,
          maxHeight: 60,
          borderBottomWidth: 2,
          borderBottomColor: theme.palette.primary.main,
        }}
      >
        <Typography className="pl-2">{column.header}</Typography>
        <ColumnColorPicker
          onColorChange={(color) => {
            onColorPick(color);
          }}
        />
      </Box>
      {column.rows.map((row: TableRow, rowIndex: number) => {
        return (
          <Box
            key={rowIndex}
            className="flex-row pl-2"
            sx={{
              minHeight: 60,
              maxHeight: 60,
            }}
          >
            {row.value}
          </Box>
        );
      })}
    </Box>
  );
};

const Table = ({ columns }: TableProps) => {
  const theme = useTheme();

  const [tableColumns, updateColumns] = useState<TableColumn[]>([]);
  const [draggedColumnIndex, setDraggedColumnIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    updateColumns(columns);
  }, [columns]);

  const handleDragStart = (index: number) => {
    setDraggedColumnIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedColumnIndex === null || draggedColumnIndex === targetIndex)
      return;

    const newColumns = [...columns];
    const [draggedColumn] = newColumns.splice(draggedColumnIndex, 1);
    newColumns.splice(targetIndex, 0, draggedColumn);

    updateColumns(newColumns);
    setDraggedColumnIndex(null);
  };

  return (
    <Box className="w-full flex flex-row overflow-scroll">
      <Box
        className="w-full flex flex-row p-2"
        style={{
          borderWidth: 1,
          borderRadius: 2,
        }}
      >
        {tableColumns.map((column: TableColumn, colIndex: number) => {
          let columnColor = `white`;
          if (column.color != null) {
            columnColor = `rgba(${column.color.r ?? 255}, ${
              column.color.g ?? 255
            }, ${column.color.b ?? 255}, ${column.color.a ?? 255})`;
          }
          return (
            <div
              key={colIndex}
              className="flex-grow"
              draggable
              onDragStart={() => handleDragStart(colIndex)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(colIndex)}
              style={{
                background: columnColor,
              }}
            >
              <TableColumnView
                column={column}
                onColorPick={(color: any) => {
                  let values = tableColumns.map((entry: any) => {
                    if (entry.field === column.field) {
                      entry.color = color;
                    }
                    return entry;
                  });
                  updateColumns(values);
                }}
              />
            </div>
          );
        })}
      </Box>
    </Box>
  );
};

const TableActions = ({ onFilterToggle, onSync }: TableActionProps) => {
  const [openFilter, toggleFilter] = useState(false);
  return (
    <Box className="flex flex-row">
      <IconButton
        onClick={() => {
          toggleFilter(!openFilter);
          onFilterToggle();
        }}
      >
        {!openFilter ? <FilterAlt /> : <FilterAltOff />}
      </IconButton>

      <IconButton
        onClick={() => {
          onSync();
        }}
      >
        <Sync />
      </IconButton>
    </Box>
  );
};

const TablePagination = ({ refresh, onChange }: TablePaginationProps) => {
  useEffect(() => {
    setOffSet(0);
    setLimit("5");
  }, [refresh]);

  const limits = [5, 10, 15, 20, 25, 50, 75, 100, 500];

  const [offSet, setOffSet] = useState<number>(0);
  const [limit, setLimit] = useState("5");

  return (
    <Box className="flex flex-row items-center" style={{}}>
      <FormControl className="w-full mr-5">
        <Select
          className="w-full"
          value={limit}
          onChange={(event) => {
            let selectedValue = event.target.value ?? "";
            onChange(offSet, parseInt(selectedValue));
            setLimit(selectedValue);
          }}
        >
          {limits.map((entry: number, index: number) => {
            return (
              <MenuItem key={index} value={entry}>
                {entry}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <IconButton
        className="mr-2"
        onClick={() => {
          if (offSet > 0) {
            setOffSet(offSet - 1);
            onChange(offSet - 1, parseInt(limit));
          }
        }}
      >
        <ChevronLeft />
      </IconButton>

      <Typography>{offSet + 1}</Typography>

      <IconButton
        className="ml-2"
        onClick={() => {
          setOffSet(offSet + 1);
          onChange(offSet + 1, parseInt(limit));
        }}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

const TableSearch = ({ onChange, searchKeys = [] }: TableSearchProps) => {
  const [searchKey, setSearchKey] = useState("");
  return (
    <Box className="flex flex-row">
      {searchKeys != null && searchKeys.length > 0 && (
        <FormControl className="mr-5">
          <Select
            className="w-full"
            value={searchKey}
            onChange={(event) => {
              let selectedValue = event.target.value ?? "";
              setSearchKey(selectedValue);
            }}
          >
            {searchKeys.map((entry: TableSearchKey, index: number) => {
              return (
                <MenuItem key={index} value={entry.value}>
                  {entry.title}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      )}

      <TextField
        label={"Search"}
        variant="outlined"
        type={"text"}
        sx={{
          flex: 1,
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search />
            </InputAdornment>
          ),
        }}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          let updatedValue = event.target.value;
          onChange(updatedValue, searchKey);
        }}
      />
    </Box>
  );
};

const PeriodicTable = (props: PeriodicTableProps) => {
  const [loading, setLoading] = useState(false);
  const [refresh, toggleRefresh] = useState(false);

  useEffect(() => {
    refreshColumns(0, 5, "");
  }, []);

  const refreshColumns = (
    offset: number,
    limit: number,
    searchText: string,
    searchKey?: string
  ) => {
    if (props.onApi != null) {
      try {
        setLoading(true);
        props
          .onApi(offset, limit, searchText, searchKey)
          .then((rows: any[]) => {
            loadColumns(rows);
            setLoading(false);
          });
      } catch {
      } finally {
        setLoading(false);
      }
    } else if (props.rows != null) {
      let rows = props.rows.slice(offset * limit, offset * limit + limit);
      loadColumns(rows);
    }
  };

  const [filterOpen, toggleFilter] = useState(false);
  const [tableColumns, updateColumns] = useState<TableColumn[]>([]);

  const loadColumns = (rows: any[]) => {
    let newColumns = props.columns.map((entry: TableColumn) => {
      let column = entry;
      column.rows = [];
      column.pinned = false;
      rows.map((row: any) => {
        let tableRow: TableRow = {
          type: entry.type ?? "text",
          value: row[column.field] ?? null,
          onEdit: () => {},
        };
        column.rows.push(tableRow);
      });
      return column;
    });
    updateColumns(newColumns);
  };

  return (
    <div className="flex flex-col w-full h-auto">
      <Box className="flex flex-col sm:flex-row w-full justify-between ">
        <TableActions
          onFilterToggle={() => toggleFilter(!filterOpen)}
          onSync={() => {
            refreshColumns(0, 5, "");
            toggleRefresh(!refresh);
          }}
        />
        {props.useSearch && (
          <TableSearch
            searchKeys={props.searchKeys}
            onChange={(searchValue: string, searchKey?: string) => {
              refreshColumns(0, 5, searchValue, searchKey);
            }}
          />
        )}
        <TablePagination
          refresh={refresh}
          onChange={(offset: number, limit: number) => {
            refreshColumns(offset, limit, "");
          }}
        />
      </Box>
      {loading && <CircularProgress />}
      <Box className="flex flex-row">
        {filterOpen && (
          <Box className="flex flex-col">
            <Typography>Filters</Typography>
          </Box>
        )}
        <Table columns={tableColumns} />
      </Box>
    </div>
  );
};

export { PeriodicTable };
export type { TableColumn, TableSearchKey };
