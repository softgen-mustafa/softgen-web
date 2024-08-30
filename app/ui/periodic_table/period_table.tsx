"use client";
import {
  CircularProgress,
  InputAdornment,
  TextField,
  Box,
  IconButton,
  Typography,
  RadioGroup,
  Radio,
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
import {
  FormLabel,
  FormControlLabel,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { SketchPicker } from "react-color";
import { DynGrid, Weight } from "../responsive_grid";

interface ApiProps {
  offset: number;
  limit: number;
  searchText?: string | null;
  searchKey?: string | null;
  sortKey?: string | null;
  sortOrder?: string | null;
}

interface PeriodicTableProps {
  columns: TableColumn[];
  rows?: any[];
  useSearch: boolean;
  searchKeys?: TableSearchKey[];
  sortKeys?: TableSortKey[];
  onApi?: (props: ApiProps) => Promise<any[]>;
  reload?: boolean;
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
interface TableSortKey {
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
  width?: number;
  hideable: boolean;
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
      boxShadow: "0 0 0 1px rgba(0,0,0,1)",
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
          <SketchPicker color={state.color} onChange={handleChange} />
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
              display: "flex",
              alignItems: "center",
              bgcolor: rowIndex % 2 === 0 ? "#FFFFFF" : "#F8F8F8",
            }}
          >
            {row.value}
          </Box>
        );
      })}
    </Box>
  );
};

interface MobileViewProps {
  columns: TableColumn[];
  rows: any[];
}

const MobileView = ({ columns, rows }: MobileViewProps) => {
  useEffect(() => {}, [columns]);

  const populateView = () => {
    return rows.map((row: any) => {
      return {
        weight: Weight.High,
        view: (
          <Box
            sx={{
              borderWidth: 1,
              borderRadius: 4,
              padding: 2,
            }}
          >
            {columns.map((column: any, colIndex: number) => {
              return (
                <div
                  key={colIndex}
                  className="flex flex-row justify-between items-center"
                >
                  <Typography>{column.header}</Typography>
                  <Typography sx={{}}>{row[column.field]} </Typography>
                </div>
              );
            })}
          </Box>
        ),
      };
    });
  };

  return (
    <div className="">
      <DynGrid views={populateView()} />
    </div>
  );
};

const Table = ({ columns }: TableProps) => {
  const theme = useTheme();

  const [tableColumns, updateColumns] = useState<TableColumn[]>(columns);
  // const [draggedColumnIndex, setDraggedColumnIndex] = useState<number | null>(
  //   null
  // );

  const resizingColumnIndex = useRef<number | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  useEffect(() => {
    updateColumns(columns);
  }, [columns]);

  const handleMouseMove = (event: MouseEvent) => {
    if (resizingColumnIndex.current !== null) {
      const newColumns = [...tableColumns];
      const index = resizingColumnIndex.current;
      const newWidth = Math.max(
        startWidth.current + (event.clientX - startX.current),
        50
      );
      newColumns[index].width = newWidth;
      updateColumns(newColumns);
    }
  };

  const handleMouseUp = () => {
    resizingColumnIndex.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const target = event.target as HTMLElement;
    if (!target.classList.contains("resizer-handle")) return;

    resizingColumnIndex.current = index;
    startX.current = event.clientX;
    startWidth.current = tableColumns[index].width || 100;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // const handleDragStart = (index: number) => {
  //   setDraggedColumnIndex(index);
  // };

  // const handleDragOver = (e: React.DragEvent) => {
  //   e.preventDefault();
  // };

  // const handleDrop = (targetIndex: number) => {
  //   if (draggedColumnIndex === null || draggedColumnIndex === targetIndex)
  //     return;

  //   const newColumns = [...columns];
  //   const [draggedColumn] = newColumns.splice(draggedColumnIndex, 1);
  //   newColumns.splice(targetIndex, 0, draggedColumn);

  //   updateColumns(newColumns);
  //   setDraggedColumnIndex(null);
  // };

  return (
    <Box className="w-full flex flex-row overflow-x-scroll overflow-y-scroll">
      <Box
        className="w-full flex flex-row p-2 overflow-x-scroll"
        style={{
          borderWidth: 1,
          borderRadius: 2,
        }}
      >
        {tableColumns
          .filter((_item: any) => !_item.hideable)
          .map((column: TableColumn, colIndex: number) => {
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
                // draggable
                // onDragStart={() => handleDragStart(colIndex)}
                // onDragOver={handleDragOver}
                // onDrop={() => handleDrop(colIndex)}
                style={{
                  background: columnColor,
                  width: column.width || 100,
                  position: "relative",
                }}
              >
                <div
                  className="resizer-handle"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    width: "2px",
                    height: "100%",
                    cursor: "col-resize",
                    zIndex: 1,
                    borderRight: "0.5px Solid #d1d5db",
                  }}
                  onMouseDown={(event) => handleMouseDown(colIndex, event)}
                />

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

interface TableFilterProps {
  columns: TableColumn[];
  sortKeys?: TableSortKey[];
  onChange?: (sortKey: string, sortOrder: string) => void;
}

const TableFilterView = ({ sortKeys = [], onChange }: TableFilterProps) => {
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  return (
    <Box
      className="flex flex-col mr-1 p-2"
      style={{
        borderWidth: 1,
        minWidth: 150,
      }}
    >
      <Typography>Columns & Sorting</Typography>
      {sortKeys != null && sortKeys.length > 0 && (
        <Box>
          <FormControl className="mr-5">
            <FormLabel className="mt-4">Sort By</FormLabel>
            <Select
              className="w-full"
              value={sortKey}
              onChange={(event) => {
                let selectedValue = event.target.value ?? "";
                setSortKey(selectedValue);
                if (onChange != null) {
                  onChange(selectedValue, sortOrder);
                }
              }}
            >
              {sortKeys.map((entry: TableSortKey, index: number) => {
                return (
                  <MenuItem key={index} value={entry.value}>
                    {entry.title}
                  </MenuItem>
                );
              })}
            </Select>
            <FormLabel className="mt-4">Sort Order</FormLabel>
            <RadioGroup
              value={sortOrder}
              onChange={(event) => {
                let selectedValue = event.target.value ?? "";
                setSortOrder(selectedValue);
                if (onChange != null) {
                  onChange(sortKey, selectedValue);
                }
              }}
            >
              <FormControlLabel
                value="asc"
                control={<Radio />}
                label="Ascending"
              />
              <FormControlLabel
                value="desc"
                control={<Radio />}
                label="Descending"
              />
            </RadioGroup>
          </FormControl>
        </Box>
      )}
    </Box>
  );
};

const PeriodicTable = (props: PeriodicTableProps) => {
  const [loading, setLoading] = useState(false);
  const [refresh, toggleRefresh] = useState(false);
  const [mobileRows, setMobileRows] = useState<any[]>([]);

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    refreshColumns({ offset: 0, limit: 5, searchText: "" });
  }, [props.reload]);

  const refreshColumns = (apiParams: ApiProps) => {
    if (props.onApi != null) {
      try {
        setLoading(true);
        let apiArgs: ApiProps = {
          offset: apiParams.offset,
          limit: apiParams.limit,
          searchText: apiParams.searchText,
          searchKey: apiParams.searchKey,
          sortKey: apiParams.sortKey,
          sortOrder: apiParams.sortOrder,
        };
        props.onApi(apiArgs).then((rows: any[]) => {
          loadColumns(rows);
          setLoading(false);
        });
      } catch {
        return [];
      } finally {
        setLoading(false);
      }
    } else if (props.rows != null) {
      console.log(props.rows);
      let rows = props.rows.slice(
        apiParams.offset * apiParams.limit,
        apiParams.offset * apiParams.limit + apiParams.limit
      );
      loadColumns(rows);
    }
  };

  const [filterOpen, toggleFilter] = useState(false);
  const [tableColumns, updateColumns] = useState<TableColumn[]>([]);

  const loadColumns = (rows: any[]) => {
    if (dimensions.width <= maxPhoneWidth) {
      setMobileRows(rows);
    }

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

  const maxPhoneWidth = 500;

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col w-full h-auto">
      {/* <div>width: {dimensions.width}</div> */}
      <Box className="flex flex-col sm:flex-row w-full justify-between mb-4">
        <TableActions
          onFilterToggle={() => toggleFilter(!filterOpen)}
          onSync={() => {
            refreshColumns({ offset: 0, limit: 5, searchText: "" });
            toggleRefresh(!refresh);
          }}
        />
        {props.useSearch && (
          <TableSearch
            searchKeys={props.searchKeys}
            onChange={(searchValue: string, searchKey?: string) => {
              refreshColumns({
                offset: 0,
                limit: 5,
                searchText: searchValue,
                searchKey: searchKey,
              });
            }}
          />
        )}
        <TablePagination
          refresh={refresh}
          onChange={(offset: number, limit: number) => {
            refreshColumns({ offset: offset, limit: limit, searchText: "" });
          }}
        />
      </Box>
      {loading && <CircularProgress />}
      <Box className="flex flex-row">
        {filterOpen && (
          <TableFilterView
            columns={tableColumns}
            sortKeys={props.sortKeys}
            onChange={(sortKey: string, sortOrder: string) => {
              refreshColumns({
                offset: 0,
                limit: 5,
                sortKey: sortKey,
                sortOrder: sortOrder,
              });
            }}
          />
        )}
        {dimensions.width > maxPhoneWidth && <Table columns={tableColumns} />}
        {dimensions.width <= maxPhoneWidth && (
          <MobileView columns={props.columns} rows={mobileRows} />
        )}
        <Box></Box>
      </Box>
    </div>
  );
};
export { PeriodicTable };
export type { TableColumn, TableSearchKey, TableSortKey, ApiProps };
