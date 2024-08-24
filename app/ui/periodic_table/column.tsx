"use client";

import { useEffect, useState } from "react";
import TextInput from "./textfield";
import { Box, Typography } from "@mui/material";

const PeriodicTable = ({ cColumn, data }: { cColumn: any; data: any }) => {
  const [columns, updateColumns] = useState([]);
  const [selectedRow, setSelectedRow] = useState<any[]>([]);
  const [draggedColumnIndex, setDraggedColumnIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    populateColumns();
  }, [cColumn, data]);

  const populateColumns = () => {
    let updatedColumns = cColumn.map((_item: any) => {
      let item = _item;
      item.rows = [];
      data.map((ele: any, index: number) =>
        item.rows.push({
          index: index,
          data: ele[_item.field],
          view: (
            <div>
              <TextInput
                type={_item.type}
                editable={true}
                value={ele[_item.field]}
                // onChange={() => {}}
              />
            </div>
          ),
        })
      );
      return item;
    });
    updateColumns(updatedColumns);
  };

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
    <div className="flex items-center flex-row overflow-scroll">
      {columns.map((col: any, key: number) => {
        return (
          <Box
            key={key}
            className="flex-1 border-2"
            draggable
            onDragStart={() => handleDragStart(key)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(key)}
          >
            <Box className="py-2 border-b-2 flex align-middle justify-center bg-slate-50">
              <Typography>{col.header}</Typography>
            </Box>
            {col.rows.map((row: any, index: any) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    selectedRow.includes(index)
                      ? setSelectedRow(selectedRow.filter((i) => i !== index))
                      : setSelectedRow([...selectedRow, index]);
                  }}
                  className={`py-2 border-b-2 flex align-middle justify-center ${
                    selectedRow.includes(index) ? "bg-slate-100" : "bg-white"
                  }`}
                >
                  {row.view}
                </div>
              );
            })}
          </Box>
        );
      })}
    </div>
  );
};

export default PeriodicTable;
