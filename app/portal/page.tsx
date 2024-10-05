"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
  Typography,
  Checkbox,
  TextField,
  InputAdornment,
  TableSortLabel,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Search,
} from "@mui/icons-material";

// Interfaces for the structure
interface Bill {
  billNo: string;
  billDate: string;
  dueDate: string;
  delayDays: number;
}

interface DataRow {
  category: string;
  region: string;
  sales: number;
  bills: Bill[];
}

interface TableColumn {
  header: string;
  field: string;
  sortable: boolean;
  hideable?: boolean;
}

interface PivotTableProps {
  data: DataRow[];
  columns: TableColumn[];
  searchKeys: string[];
}

const PivotTable = ({ data, columns, searchKeys }: PivotTableProps) => {
  const [filteredData, setFilteredData] = useState<DataRow[]>(data);
  const [openRows, setOpenRows] = useState<{ [key: string]: boolean }>({});
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchText, setSearchText] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({ key: "", direction: null });

  // Toggle rows open/close
  const toggleRow = (index: number) => {
    setOpenRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Handle sorting
  const handleSort = (column: TableColumn) => {
    let direction = sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key: column.field, direction });
  };

  // Apply sorting
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) return 0;
    const aValue = a[sortConfig.key as keyof DataRow];
    const bValue = b[sortConfig.key as keyof DataRow];
    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Search Functionality
  const handleSearch = (text: string) => {
    const filtered = data.filter((row) =>
      searchKeys.some((key) =>
        row[key as keyof DataRow]
          ?.toString()
          .toLowerCase()
          .includes(text.toLowerCase()),
      ),
    );
    setFilteredData(filtered);
  };

  // Handle checkbox select
  const handleCheckboxChange = (index: number) => {
    const selectedIndex = selectedRows.indexOf(index);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRows, index);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRows.slice(1));
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = newSelected.concat(selectedRows.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRows.slice(0, selectedIndex),
        selectedRows.slice(selectedIndex + 1),
      );
    }
    setSelectedRows(newSelected);
  };

  useEffect(() => {
    handleSearch(searchText);
  }, [searchText]);

  return (
    <div>
      {/* Search Field */}
      <Box marginBottom={2}>
        <TextField
          label="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Table with expandable rows and dynamic columns */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell padding="checkbox">
                <Checkbox
                  onChange={(event, checked) => {
                    if (checked) {
                      const newSelecteds = data.map((_, index) => index);
                      setSelectedRows(newSelecteds);
                    } else {
                      setSelectedRows([]);
                    }
                  }}
                />
              </TableCell>
              {columns.map((column, index) => (
                <TableCell
                  key={index}
                  sortDirection={
                    sortConfig.key === column.field
                      ? sortConfig.direction
                      : false
                  }
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortConfig.key === column.field}
                      direction={sortConfig.direction || "asc"}
                      onClick={() => handleSort(column)}
                    >
                      {column.header}
                    </TableSortLabel>
                  ) : (
                    column.header
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((row, index) => (
              <React.Fragment key={index}>
                <TableRow>
                  <TableCell>
                    <IconButton size="small" onClick={() => toggleRow(index)}>
                      {openRows[index] ? (
                        <KeyboardArrowUp />
                      ) : (
                        <KeyboardArrowDown />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRows.indexOf(index) !== -1}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.field}>
                      {row[column.field as keyof DataRow]}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell colSpan={columns.length + 2} padding="none">
                    <Collapse in={openRows[index]} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                          Bills
                        </Typography>
                        <Table size="small" aria-label="bills">
                          <TableHead>
                            <TableRow>
                              <TableCell>Bill No</TableCell>
                              <TableCell>Bill Date</TableCell>
                              <TableCell>Due Date</TableCell>
                              <TableCell>Delay Days</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {row.bills.map((bill, billIndex) => (
                              <TableRow key={billIndex}>
                                <TableCell>{bill.billNo}</TableCell>
                                <TableCell>{bill.billDate}</TableCell>
                                <TableCell>{bill.dueDate}</TableCell>
                                <TableCell>{bill.delayDays}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

// Example usage
const exampleData: DataRow[] = [
  {
    category: "Electronics",
    sales: 100,
    region: "North",
    bills: [
      {
        billNo: "1",
        billDate: "10-10-2024",
        dueDate: "10-12-2024",
        delayDays: 60,
      },
      {
        billNo: "2",
        billDate: "10-10-2024",
        dueDate: "10-12-2024",
        delayDays: 60,
      },
    ],
  },
  {
    category: "Clothing",
    sales: 150,
    region: "South",
    bills: [
      {
        billNo: "3",
        billDate: "15-10-2024",
        dueDate: "15-11-2024",
        delayDays: 30,
      },
    ],
  },
];

const columns: TableColumn[] = [
  { header: "Category", field: "category", sortable: true },
  { header: "Region", field: "region", sortable: true },
  { header: "Sales", field: "sales", sortable: true },
];

const searchKeys = ["category", "region", "sales"];

const Page = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Dynamic Pivot Table with Expandable Rows
      </Typography>
      <PivotTable
        data={exampleData}
        columns={columns}
        searchKeys={searchKeys}
      />
    </div>
  );
};

export default Page;
