"use client";

import { useEffect, useState } from "react";
import TextInput from "./textfield";
import {
  Box,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { inspiredPalette } from "../theme";
import { Pin, PushPin } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/MoreVertOutlined";

const PeriodicTable = ({ cColumn, data }: { cColumn: any; data: any }) => {
  const [columns, updateColumns] = useState<any[]>([]);
  const [selectedRow, setSelectedRow] = useState<any[]>([]);
  const [draggedColumnIndex, setDraggedColumnIndex] = useState<number | null>(
    null
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const appTheme = useTheme();

  useEffect(() => {
    populateColumns();
  }, [cColumn, data]);

  const populateColumns = () => {
    let updatedColumns = cColumn.map((_item: any) => {
      let item = _item;
      item.rows = [];
      item.pinned = _item.pinned != null ? _item.pinned : false;
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

  const handleUnpinColumns = (col: any, key: number) => {
    return (
      <Box
        key={key}
        className="flex-1 border-2"
        draggable
        onDragStart={() => handleDragStart(key)}
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(key)}
      >
        <Box
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={2}
          className="py-2 border-b-2 bg-slate-50"
        >
          <Typography>{col.header}</Typography>
          <IconButton
            onClick={() => {
              let values = columns.map((entry: any) => {
                return {
                  ...entry,
                  pinned:
                    col.field === entry.field ? !entry.pinned : entry.pinned,
                };
              });
              updateColumns(values);
            }}
          >
            <PushPin
              sx={{ transform: col.pinned ? "rotate(0deg)" : "rotate(45deg)" }}
            />
          </IconButton>
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
  };

  return (
    <div className="flex items-center flex-row ">
      <div
        className="flex items-center flex-row"
        style={{
          borderRightWidth: 3,
          borderRightColor: appTheme.palette.primary.main,
        }}
      >
        {columns
          .filter((_item: any) => _item.pinned)
          .map((col, key) => {
            return handleUnpinColumns(col, key);
          })}
      </div>
      <div className="flex items-center flex-row overflow-scroll">
        {columns
          .filter((_item: any) => !_item.pinned)
          .map((col, key) => {
            return handleUnpinColumns(col, key);
          })}
      </div>
    </div>
  );
};

export default PeriodicTable;
