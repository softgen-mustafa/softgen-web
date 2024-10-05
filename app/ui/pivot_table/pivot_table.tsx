import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

// Function to create pivoted data from the nested bill structure
const createPivotData = (rows: any[], pivotKey: string, valueKey: string) => {
  const pivotData: any[] = [];

  rows.forEach((row) => {
    row.bills.forEach((bill: any) => {
      pivotData.push({
        category: row[pivotKey],
        region: row.region,
        sales: row[valueKey],
        billNo: bill.billNo,
        billDate: bill.billDate,
        dueDate: bill.dueDate,
        delayDays: bill.delayDays,
      });
    });
  });

  return pivotData;
};

interface PivotTableProps {
  data: any[];
}

const PivotTable = ({ data }: PivotTableProps) => {
  // The pivot keys and value keys are hard-coded here
  const pivotKey = "category";
  const valueKey = "sales";
  const [pivotData, setPivotData] = useState<any[]>([]);

  useEffect(() => {
    const result = createPivotData(data, pivotKey, valueKey);
    setPivotData(result);
  }, [data]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Category</TableCell>
            <TableCell>Region</TableCell>
            <TableCell>Sales</TableCell>
            <TableCell>Bill No</TableCell>
            <TableCell>Bill Date</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Delay Days</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pivotData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.category}</TableCell>
              <TableCell>{row.region}</TableCell>
              <TableCell>{row.sales}</TableCell>
              <TableCell>{row.billNo}</TableCell>
              <TableCell>{row.billDate}</TableCell>
              <TableCell>{row.dueDate}</TableCell>
              <TableCell>{row.delayDays}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export { PivotTable };
