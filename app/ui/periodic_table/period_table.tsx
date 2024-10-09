"use client";
import {
  Checkbox,
  InputAdornment,
  TextField,
  Box,
  IconButton,
  Typography,
  RadioGroup,
  Radio,
  useTheme,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  Sync,
  FilterAlt,
  FilterAltOff,
  ArrowUpward,
  ArrowDownward,
} from "@mui/icons-material";
import React, { useState, useRef, useEffect, ReactElement } from "react";
import {
  FormLabel,
  FormControlLabel,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import { SketchPicker } from "react-color";
import { DynGrid, Weight } from "../responsive_grid";
import { DropDown } from "../drop_down";
import { SingleChartView } from "@/app/ui/graph_util";
import { numericToString } from "@/app/services/Local/helper";

interface ApiProps {
  offset: number;
  limit: number;
  searchText?: string | null;
  searchKey?: string | null;
  sortKey?: string | null;
  sortOrder?: string | null;
}

interface PeriodicTableProps {
  pivotKey?: string;
  usePivot?: boolean;
  showSummationRow?: boolean;
  actionViews?: any[];
  iconActions?: any[];
  columns: TableColumn[];
  rows?: any[];
  useSearch: boolean;
  searchKeys?: TableSearchKey[];
  sortKeys?: TableSortKey[];
  onApi?: (props: ApiProps) => Promise<any[]>;
  reload?: boolean;
  RenderAdditionalView?: ReactElement;
  refreshFilterView?: boolean;
  onRowClick?: (rowData: any) => void;
  checkBoxSelection?: boolean;
  renderCheckedView?: (values: any[]) => ReactElement;
  chartKeyFields?: any[];
  chartValueFields?: any[];
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
  hideable?: boolean;
  mobileFullView?: boolean;
  showSummation?: boolean;
}

interface TableRow {
  type: string;
  value: any;
  field?: string;
  onEdit: () => void;
}

interface TableProps {
  pivotKey?: string;
  usePivot?: boolean;
  columns: TableColumn[];
  rows: TableRow[][];
  onRowClick?: (rowData: any) => void;
  checkBox?: boolean;
  onChecked?: (values: any[]) => void;
  iconActions?: any[];
  actionViews?: any[];
  reload: any;
  showSummationRow?: boolean;
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
  const theme = useTheme();

  const populateView = () => {
    return rows.map((row: any) => {
      return {
        weight: Weight.Low,
        view: (
          <Box
            sx={{
              borderWidth: 1.9,
              borderRadius: 3.5,
              padding: 1.3,
              borderColor: theme.palette.primary.light,
              borderLeftWidth: 8.5,
              borderLeftColor: theme.palette.primary.main,
              display: "flex", // Flexbox for centering
              ml: "-10%",
            }}
            className="flex flex-row flex-wrap justify-between"
          >
            {columns
              .filter((_column) => !_column.hideable)
              .map((column: any, colIndex: number) => {
                // console.log(columns);
                return (
                  // <div
                  //   key={colIndex}
                  //   className="flex flex-row justify-between items-baseline mb-2"
                  // >
                  <Box
                    key={colIndex}
                    className={`flex flex-col ${
                      colIndex % 2 === 0 ? "items-start" : "items-end"
                    }`}
                    width={"50%"}
                    mb={2}
                  >
                    {!column.mobileFullView && (
                      <Typography
                        sx={{
                          fontSize: 14,
                          textAlign: colIndex % 2 === 0 ? "left" : "right",
                        }}
                      >
                        {column.header}
                      </Typography>
                    )}
                    <Typography
                      sx={{
                        // textAlign: column.mobileFullView ? "center" : "right",
                        // width: "60%",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      {row[column.field]}{" "}
                    </Typography>
                  </Box>
                  // </div>
                );
              })}
          </Box>
        ),
      };
    });
  };

  return (
    <div className="">
      <DynGrid views={populateView()} isMobileView={true} />
    </div>
  );
};

const Table = ({
  onChecked,
  columns,
  rows,
  onRowClick,
  checkBox,
  iconActions = [],
  actionViews = [],
  reload,
  usePivot = false,
  pivotKey = "",
  showSummationRow = false,
}: TableProps) => {
  const theme = useTheme();

  const [fieldWidths, changeFieldWidths] = useState<any[]>([]);
  const [tableRows, updateRows] = useState<any[][]>([]);
  const [selectedRow, setSelectedRow] = useState<any[]>([]);
  const resizingColumnIndex = useRef<number | null>(null);
  const shownRowIndexes = useRef<number[]>([]);
  const [refresh, triggerRefresh] = useState<number>(1);

  const handleRowClick = (rowData: any) => {
    // Call the callback function only if it is provided
    if (onRowClick) {
      // Convert the row data to an object format if it's not already
      const rowObject = Array.isArray(rowData)
        ? rowData.reduce((obj, cell) => {
            obj[cell.field] = cell.value;
            return obj;
          }, {})
        : rowData;

      onRowClick(rowObject);
    }
  };

  useEffect(() => {
    let columnWidths = columns.map((column: TableColumn) => {
      return {
        field: column,
        // width: 150,
        width: column.width || 150, // Default column width to 150 if not provided
      };
    });
    changeFieldWidths(columnWidths);

    updateRows(rows);
  }, [rows]);

  useEffect(() => {
    setSelectedRow([]);
  }, [tableRows]);

  const handleMouseMove = (event: MouseEvent) => {};

  const handleMouseUp = () => {
    resizingColumnIndex.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleMouseDown = (index: number, event: React.MouseEvent) => {};

  const renderPivotRows = (rowIndex: number) => {
    if (!shownRowIndexes.current.includes(rowIndex)) {
      return <></>;
    }
    let pivotColumn = tableRows[rowIndex].find(
      (entry) => entry.field === pivotKey
    );
    if (
      pivotColumn === null ||
      pivotColumn.value === null ||
      pivotColumn.value.length < 1
    ) {
      return [];
    }
    0;
    let firstRow = pivotColumn.value[0];
    let keys = Object.keys(firstRow);

    let rows = pivotColumn.value.map((row: any, rowIdx: number) => {
      return (
        <Box key={rowIdx} className="flex flex-row overflow-x-hidden">
          {keys.map((column: string, index: number) => {
            let value = row[column];
            return (
              <div key={index}>
                <Box
                  key={index}
                  className="w-full flex p-2"
                  sx={{
                    minWidth: 150,
                    maxWidth: 200,
                    borderBottomWidth: 2,

                    flex: `1 0 ${200}px`, // Allow flexing with minimum width

                    borderRightWidth: index === keys.length - 1 ? 0 : 2,
                  }}
                >
                  <Typography>{column}</Typography>
                </Box>
                <Box
                  key={index}
                  className={`w-full flex p-2`}
                  sx={{
                    minWidth: 150,
                    maxWidth: 200,
                    // flex: `1 0 ${cellWidth}px`, // Allow flexing

                    borderRightWidth: index === row.length - 1 ? 0 : 2,
                    overflowX: "auto", // Ensure the row can scroll horizontally
                  }}
                >
                  <Typography className="overflow-x-auto">{value}</Typography>
                </Box>
              </div>
            );
          })}
        </Box>
      );
    });

    return (
      <div
        className="w-auto flex-col m-2 p-2"
        style={{
          borderWidth: 1,
        }}
      >
        {rows}
      </div>
    );
  };

  return (
    // <Box className="w-full max-w-[100vw] flex flex-row max-h-[600px]">
    <Box
      key={refresh}
      className="w-full max-h-[600px]"
      sx={{ overflowX: "auto", overflowY: "auto" }}
    >
      <Box
        className="w-full flex flex-col p-2"
        style={{
          minWidth: columns.length * 150, // Adjust the minimum width to fit all columns
          // overflowX: "auto",
          borderWidth: 1,
          borderRadius: 2,
        }}
      >
        {/* Header Row*/}
        <Box
          //  className="flex flex-row justify-between">
          className="flex flex-row justify-between sticky top-0 bg-white z-10"
          sx={{
            borderBottomWidth: 2,
            borderBottomColor: theme.palette.primary.main,
          }}
        >
          {checkBox && (
            <Box
              className="flex p-0 bg-white"
              sx={{ borderRightWidth: 2, borderBottomWidth: 2 }}
            >
              <Checkbox
                onChange={(event, checked: boolean) => {
                  let values: any[] = [];
                  if (checked) {
                    tableRows.map((_items: any, index: number) => {
                      values.push(index);
                    });
                  }
                  if (onChecked) {
                    onChecked(values);
                  }
                  setSelectedRow(values);
                }}
              />
            </Box>
          )}
          {usePivot && (
            <Box key={1} className="flex p-0" sx={{ borderRightWidth: 2 }}>
              <IconButton
                onClick={() => {
                  let hasContent = shownRowIndexes.current.length > 0;
                  shownRowIndexes.current = hasContent
                    ? []
                    : shownRowIndexes.current;
                  triggerRefresh(refresh == 1 ? 0 : 1);
                }}
              >
                {shownRowIndexes.current.length > 0 ? (
                  <ArrowUpward />
                ) : (
                  <ArrowDownward />
                )}
              </IconButton>
            </Box>
          )}
          {columns
            .filter((entry) => !entry.hideable)
            .map((column: TableColumn, colIndex: number) => {
              let cellWidth = fieldWidths.find(
                (entry: any) => entry.field === column.field
              );
              if (cellWidth === null) {
                cellWidth = 200;
              }
              return (
                <Box
                  key={colIndex}
                  className="w-full flex p-2"
                  sx={{
                    minWidth: 150,
                    maxWidth: cellWidth,
                    borderBottomWidth: 2,

                    flex: `1 0 ${cellWidth}px`, // Allow flexing with minimum width

                    borderRightWidth: colIndex === columns.length - 1 ? 0 : 2,
                  }}
                >
                  <Typography>{column.header}</Typography>
                </Box>
              );
            })}
          {iconActions &&
            iconActions.length > 0 &&
            iconActions.map((entry: any, index: number) => {
              return (
                <Box
                  key={index}
                  className="w-full flex p-2"
                  sx={{
                    minWidth: 100,
                    borderBottomWidth: 2,
                    borderRightWidth: 2,
                  }}
                >
                  <Typography>{entry.label}</Typography>
                </Box>
              );
            })}
          {actionViews &&
            actionViews.length > 0 &&
            actionViews.map((entry: any, index: number) => {
              return (
                <Box
                  key={index}
                  className="w-full flex p-2"
                  sx={{
                    minWidth: 100,
                    // borderBottomWidth: 2,
                    borderRightWidth: 2,
                  }}
                >
                  <Typography>{entry.label}</Typography>
                </Box>
              );
            })}
        </Box>
        {/* {reload && <LinearProgress />} */}
        {!reload && tableRows.length <= 0 && (
          <Box className="flex flex-row align-middle justify-center mt-4 mb-2">
            <Typography>No Data Found</Typography>
          </Box>
        )}
        {/* Data Rows*/}
        {tableRows.map((row: any[], rowIndex: number) => {
          return (
            <div className="flex flex-col " key={rowIndex}>
              <div
                key={rowIndex}
                className="flex flex-row justify-between"
                style={{
                  background: rowIndex % 2 === 0 ? "white" : "#F9F9F9",
                }}
                onClick={() => {
                  handleRowClick(row);
                }}
              >
                {checkBox && (
                  <Box
                    key={rowIndex}
                    className="flex p-0"
                    sx={{ borderRightWidth: 2 }}
                  >
                    <Checkbox
                      checked={selectedRow.includes(rowIndex)}
                      onChange={() => {
                        let selectedValues = selectedRow;
                        if (selectedValues.includes(rowIndex)) {
                          selectedValues = selectedValues.filter(
                            (i) => i !== rowIndex
                          );
                        } else {
                          selectedValues.push(rowIndex);
                        }
                        setSelectedRow(selectedValues);
                        if (onChecked) {
                          onChecked(selectedValues);
                        }
                      }}
                    />
                  </Box>
                )}
                {usePivot && (
                  <Box
                    key={rowIndex}
                    className="flex p-0"
                    sx={{ borderRightWidth: 2 }}
                  >
                    <IconButton
                      onClick={() => {
                        let selectedValues = shownRowIndexes.current;
                        if (selectedValues.includes(rowIndex)) {
                          selectedValues = selectedValues.filter(
                            (i) => i !== rowIndex
                          );
                        } else {
                          selectedValues.push(rowIndex);
                        }
                        shownRowIndexes.current = selectedValues;
                        triggerRefresh(refresh == 1 ? 0 : 1);
                      }}
                    >
                      {shownRowIndexes.current.includes(rowIndex) ? (
                        <ArrowUpward />
                      ) : (
                        <ArrowDownward />
                      )}
                    </IconButton>
                  </Box>
                )}
                {row
                  .filter((entry: any) => {
                    let col = columns.find((c) => c.field === entry.field);
                    if (col === null) {
                      return false;
                    }
                    return !col?.hideable;
                  })
                  .map((cell: any, cellIndex: number) => {
                    let cellWidth = fieldWidths.find(
                      (entry: any) => entry.field === cell.field
                    );
                    if (cellWidth === null) {
                      cellWidth = 200;
                    }

                    return (
                      <Box
                        key={cellIndex}
                        className={`w-full flex p-2`}
                        sx={{
                          minWidth: 150,
                          maxWidth: cellWidth,
                          // flex: `1 0 ${cellWidth}px`, // Allow flexing

                          borderRightWidth:
                            cellIndex === row.length - 1 ? 0 : 2,
                          overflowX: "auto", // Ensure the row can scroll horizontally
                        }}
                      >
                        <Typography className="overflow-x-auto">
                          {cell.type == "number"
                            ? numericToString(parseFloat(cell.value).toFixed(2))
                            : cell.value}
                        </Typography>
                      </Box>
                    );
                  })}
                {iconActions &&
                  iconActions.length > 0 &&
                  iconActions.map((entry: any, index: number) => {
                    return (
                      <Box
                        key={index}
                        className={`w-full flex p-2 justify-center`}
                        sx={{
                          minWidth: 100,
                          borderRightWidth: 2,
                        }}
                      >
                        <IconButton
                          key={index}
                          onClick={() => {
                            if (entry.onPress) {
                              entry.onPress(row);
                            }
                          }}
                        >
                          {entry.icon}
                        </IconButton>
                      </Box>
                    );
                  })}
                {actionViews &&
                  actionViews.length > 0 &&
                  actionViews.map((entry: any, index: number) => {
                    return (
                      <Box
                        key={index}
                        className={`w-full flex p-2 justify-center`}
                        sx={{
                          minWidth: 100,
                          borderRightWidth: 2,
                        }}
                      >
                        {entry.renderView(row)}
                      </Box>
                    );
                  })}
              </div>
              {row &&
                row.length > 0 &&
                usePivot &&
                pivotKey != null &&
                renderPivotRows(rowIndex)}
            </div>
          );
        })}
        {/*Summation Row */}
        {showSummationRow && (
          <Box
            //  className="flex flex-row justify-between">
            className="flex flex-row justify-between sticky bottom-0 bg-gray-100 z-10"
            sx={{
              borderTopWidth: 2,
              borderTopColor: theme.palette.primary.main,
            }}
          >
            {checkBox && (
              <Box
                className="flex p-0 bg-white"
                sx={{ borderRightWidth: 2, borderBottomWidth: 2 }}
              >
                <Checkbox
                  className=""
                  onChange={(event, checked: boolean) => {
                    let values: any[] = [];
                    if (checked) {
                      tableRows.map((_items: any, index: number) => {
                        values.push(index);
                      });
                    }
                    if (onChecked) {
                      onChecked(values);
                    }
                    setSelectedRow(values);
                  }}
                />
              </Box>
            )}
            {usePivot && (
              <Box key={1} className="flex p-0" sx={{ borderRightWidth: 2 }}>
                <IconButton
                  onClick={() => {
                    let hasContent = shownRowIndexes.current.length > 0;
                    shownRowIndexes.current = hasContent
                      ? []
                      : shownRowIndexes.current;
                    triggerRefresh(refresh == 1 ? 0 : 1);
                  }}
                >
                  {shownRowIndexes.current.length > 0 ? (
                    <ArrowUpward />
                  ) : (
                    <ArrowDownward />
                  )}
                </IconButton>
              </Box>
            )}
            {columns
              .filter((entry) => !entry.hideable)
              .map((column: TableColumn, colIndex: number) => {
                let cellWidth = fieldWidths.find(
                  (entry: any) => entry.field === column.field
                );
                if (cellWidth === null) {
                  cellWidth = 200;
                }
                let summation = 0;
                if (column.showSummation) {
                  tableRows.map((row: any, rowIndex: number) => {
                    let rowValue = row.find(
                      (rowEntry: any) => rowEntry.field == column.field
                    );
                    if (rowValue) {
                      console.log(`row value: ${JSON.stringify(rowValue)}`);
                      summation += rowValue.value;
                    }
                  });
                }
                return (
                  <Box
                    key={colIndex}
                    className="w-full flex p-2"
                    sx={{
                      minWidth: 150,
                      maxWidth: cellWidth,
                      borderBottomWidth: 2,

                      flex: `1 0 ${cellWidth}px`, // Allow flexing with minimum width

                      borderRightWidth: colIndex === columns.length - 1 ? 0 : 2,
                    }}
                  >
                    {column.showSummation && (
                      <Typography>{numericToString(summation)}</Typography>
                    )}
                  </Box>
                );
              })}
            {iconActions &&
              iconActions.length > 0 &&
              iconActions.map((entry: any, index: number) => {
                return (
                  <Box
                    key={index}
                    className="w-full flex p-2"
                    sx={{
                      minWidth: 100,
                      borderBottomWidth: 2,
                      borderRightWidth: 2,
                    }}
                  >
                    <Typography>{entry.label}</Typography>
                  </Box>
                );
              })}
            {actionViews &&
              actionViews.length > 0 &&
              actionViews.map((entry: any, index: number) => {
                return (
                  <Box
                    key={index}
                    className="w-full flex p-2"
                    sx={{
                      minWidth: 100,
                      // borderBottomWidth: 2,
                      borderRightWidth: 2,
                    }}
                  >
                    <Typography>{entry.label}</Typography>
                  </Box>
                );
              })}
          </Box>
        )}
      </Box>
    </Box>
  );
};

const viewTypeData = [
  {
    label: "Table View",
    value: "table",
  },
  {
    label: "Chart View",
    value: "chart",
  },
];
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

  const limits = [5, 10, 15, 20, 25, 50, 75, 100, 500, 800];

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
            setOffSet(0);
            onChange(0, parseInt(selectedValue));
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

        {/* <Select
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
        </Select> */}
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
    <Box className="flex flex-row items-center" sx={{ width: "25rem" }}>
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
  onHideColumns?: any;
  refreshFilterView?: boolean;
  RenderAdditionalView?: ReactElement;
}

const TableFilterView = ({
  columns,
  refreshFilterView,
  RenderAdditionalView,
  sortKeys = [],
  onChange,
  onHideColumns,
}: TableFilterProps) => {
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [AddtionalView, setAddtionalView] = useState<ReactElement | null>(null);

  const handleFilterColumns = (index: number) => {
    let updatedColumns = [...columns];
    updatedColumns[index].hideable = !updatedColumns[index].hideable;
    onHideColumns(updatedColumns);
  };

  useEffect(() => {
    setAddtionalView(RenderAdditionalView || null);
  }, [refreshFilterView]);

  const renderAdditionalView = () => {
    return RenderAdditionalView;
  };
  return (
    <Box
      className="flex flex-col mr-1 p-2 max-h-[600px] overflow-y-auto"
      style={{
        borderWidth: 1,
        minWidth: 250,
      }}
    >
      <Typography className="mt-2 mb-2">Filters</Typography>
      {AddtionalView != null && AddtionalView}

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

      {/*<FormLabel className="mt-4">Filter Columns</FormLabel>
      {columns.map((col, index) => {
        return (
          <Box key={index} className="flex flex-row items-center">
            <Checkbox
              defaultChecked={!col.hideable}
              onChange={() => handleFilterColumns(index)}
            />
            <Typography>{col.header}</Typography>
          </Box>
        );
      })} */}
    </Box>
  );
};

interface TableChartProps {
  dataRows: any[];
  keyFields: string[];
  valueFields: string[];
}

const TableChartView = ({
  dataRows,
  keyFields,
  valueFields,
}: TableChartProps) => {
  const [data, setData] = useState<any[]>([]);
  const [keyField, setKeyField] = useState<any>(keyFields[0]);
  const [valueField, setValueField] = useState<any>(valueFields[0]);

  useEffect(() => {
    createChartData(keyFields[0], valueFields[0]);
  }, [dataRows]);

  const createChartData = (key: any, value: any) => {
    let chartValues: any[] = [];
    dataRows.map((row: any[]) => {
      let keyData = row.find((entry: any) => entry.field === key.value) ?? null;
      let valueData =
        row.find((entry: any) => entry.field === value.value) ?? null;
      if (keyData === null || valueData === null) {
        return;
      }
      chartValues.push({
        label: keyData.value,
        value: valueData.value,
      });
    });
    setData(chartValues);
  };

  return (
    <Stack sx={{ flexDirection: { xs: "col", sm: "col", md: "row" } }} gap={3}>
      <Box className="flex flex-1 flex-col gap-4">
        <DropDown
          label={"Select Label"}
          displayFieldKey={"label"}
          valueFieldKey={null}
          selectionValues={keyFields}
          helperText={""}
          onSelection={(selection) => {
            setKeyField(selection);
            createChartData(selection, valueField);
          }}
        />
        <DropDown
          label={"Select Value"}
          displayFieldKey={"label"}
          valueFieldKey={null}
          selectionValues={valueFields}
          helperText={""}
          onSelection={(selection) => {
            setValueField(selection);
            createChartData(keyField, selection);
          }}
        />
      </Box>
      <Box sx={{ width: { md: "80%" } }}>
        <SingleChartView defaultChart="pie" values={data} title="" />
      </Box>
    </Stack>
  );
};

const PeriodicTable = (props: PeriodicTableProps) => {
  const [loading, setLoading] = useState(false);
  const [refresh, toggleRefresh] = useState(false);
  const [mobileRows, setMobileRows] = useState<any[]>([]);
  const [filterOpen, toggleFilter] = useState(false);
  const [dataRows, updateRows] = useState<TableRow[][]>([]);
  const [tableState, updateTableState] = useState<any>({
    viewType: "table",
  });

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    refreshColumns({ offset: 0, limit: 5, searchText: "" });
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, [props.reload]);

  /*useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
    refreshColumns({ offset: 0, limit: 5, searchText: "" });
  }, [props.rows]);*/

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

  const loadColumns = (rows: any[]) => {
    if (dimensions.width <= maxPhoneWidth) {
      setMobileRows(rows);
    }
    let tableRows: TableRow[][] = [];

    rows.map((row: any) => {
      let cells: TableRow[] = [];
      props.columns.map((column: TableColumn) => {
        let cell: TableRow = {
          type: column.type,
          field: column.field,
          value: row[column.field],
          onEdit: () => {},
        };
        cells.push(cell);
      });

      tableRows.push(cells);
    });
    updateRows(tableRows);
  };

  const maxPhoneWidth = 500;

  const [checkedValues, changeCheckedValues] = useState<any[]>([]);

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
    <div className="flex flex-col w-full h-auto max-h-[650px] pb-2">
      {/* <div>width: {dimensions.width}</div> */}
      <Box className="flex flex-col sm:flex-row w-full justify-between mb-4 gap-2">
        <Stack flexDirection={"row"} alignItems={"center"} gap={1}>
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
        </Stack>
        <div className="w-full flex justify-end">
          {checkedValues &&
            checkedValues.length > 0 &&
            props.renderCheckedView !== null &&
            props.renderCheckedView!(checkedValues)}
        </div>
        <Stack flexDirection={"row"} alignItems={"baseline"} gap={1}>
          <DropDown
            label={"Select View"}
            displayFieldKey={"label"}
            valueFieldKey={null}
            selectionValues={viewTypeData}
            helperText={""}
            defaultSelectionIndex={viewTypeData.findIndex(
              (entry) => entry.value === tableState.viewType
            )}
            onSelection={(selection) => {
              updateTableState({ ...tableState, viewType: selection.value });
            }}
          />
          <TablePagination
            refresh={refresh}
            onChange={(offset: number, limit: number) => {
              refreshColumns({ offset: offset, limit: limit, searchText: "" });
            }}
          />
        </Stack>
      </Box>
      {loading && (
        <Box className="z-30 flex justify-center items-center w-full">
          {<CircularProgress className="flex" />}
        </Box>
      )}
      <Box
        display={"flex"}
        flexDirection={{ xs: "column", md: "row" }}
        // alignItems={"center"}
      >
        {filterOpen && (
          <TableFilterView
            refreshFilterView={props.refreshFilterView}
            RenderAdditionalView={props.RenderAdditionalView}
            columns={props.columns}
            sortKeys={props.sortKeys}
            onChange={(sortKey: string, sortOrder: string) => {
              refreshColumns({
                offset: 0,
                limit: 5,
                sortKey: sortKey,
                sortOrder: sortOrder,
              });
            }}
            onHideColumns={() => {}}
          />
        )}

        {tableState.viewType === "table" &&
          dimensions.width > maxPhoneWidth && (
            <Table
              pivotKey={props.pivotKey}
              usePivot={props.usePivot}
              showSummationRow={props.showSummationRow}
              actionViews={props.actionViews}
              iconActions={props.iconActions}
              columns={props.columns}
              rows={dataRows}
              reload={loading}
              onRowClick={props.onRowClick}
              checkBox={props.checkBoxSelection}
              onChecked={(selectedIndexes: any[]) => {
                let selectedValues: any[] = [];
                selectedIndexes.map((selectedIndex: number) => {
                  selectedValues.push(dataRows[selectedIndex]);
                });
                changeCheckedValues(selectedValues);
              }}
            />
          )}
        {tableState.viewType === "table" &&
          dimensions.width <= maxPhoneWidth && (
            <MobileView columns={props.columns} rows={mobileRows} />
          )}
        {tableState.viewType !== "table" &&
          props.chartKeyFields != null &&
          props.chartValueFields != null && (
            <Box
              sx={{
                borderTopWidth: "1px",
                paddingTop: 2,
                width: "100%",
              }}
            >
              <TableChartView
                keyFields={props.chartKeyFields}
                valueFields={props.chartValueFields}
                dataRows={dataRows}
              />
            </Box>
          )}
      </Box>
    </div>
  );
};
export { PeriodicTable };
export type { TableColumn, TableSearchKey, TableSortKey, ApiProps, TableProps };
