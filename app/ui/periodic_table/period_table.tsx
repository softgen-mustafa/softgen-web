"use client";
import { Box, IconButton, Typography } from "@mui/material";
import { ChevronRight, ChevronLeft, Sync, FilterAlt, FilterAltOff } from "@mui/icons-material";
import React, { useState, useRef, useEffect } from "react";
import {
    FormControl,
    MenuItem,
    Select,
} from "@mui/material";

interface PeriodicTableProps {
    columns: TableColumn[];
    rows?: any[];
    onApi?: (offset: number, limit: number, searchText: string) => Promise<any[]>
}

interface TableActionProps {
    onFilterToggle: () => void;
}

interface TablePaginationProps {
    onChange: (offset: number, limit: number) => void;
}


interface TableColumn {
    type: string
    header: string;
    field: string;
    pinned: boolean;
    rows: TableRow[];
}

interface TableRow {
    type: string;
    value: any;
    onEdit: () => void;
}

interface TableProps {
    columns: TableColumn[];
}

const Table = ({columns}: TableProps) => {
    return (
        <Box className="w-full flex flex-row">
            <Box className="w-full flex flex-row">
                {
                    columns.map((column: TableColumn, colIndex: number) => {
                        return (
                            <Box key={colIndex}>
                                <Box className="flex flex-row">
                                    <Typography>{column.header}</Typography>
                                </Box>
                                {
                                   column.rows.map((row: TableRow, rowIndex: number) => {
                                       return (
                                            <Box key={rowIndex}>{row.value}</Box>
                                       );
                                   })
                                }
                            </Box>
                        );
                    }) 
                }
            </Box>
        </Box>
    );
}


const TableActions = ({ onFilterToggle }: TableActionProps) => {
    const [openFilter, toggleFilter] = useState(false)
    return (
        <Box className="flex flex-row">
            <IconButton onClick={() => {
                toggleFilter(!openFilter)
                onFilterToggle()
            }}>{
                !openFilter ? <FilterAlt/> : <FilterAltOff/>
            }</IconButton>

            <IconButton onClick={() => {
            }}><Sync/></IconButton>

        </Box>
    );
}


const TablePagination = ({onChange}: TablePaginationProps) => {

    const limits = [5, 10, 15, 20, 25, 50, 75, 100, 500];

    const [offSet, setOffSet] = useState<number>(0)
    const [limit, setLimit] = useState("5")

    return (
        <Box className="flex flex-row items-center" style={{
        }}>

        <FormControl className="w-full mr-5">
        <Select
        className="w-full"
        value={limit}
        onChange={(event) => {
            let selectedValue = event.target.value ?? ""
            onChange(offSet,  parseInt(selectedValue))
            setLimit(selectedValue)
        }}
        >
        {
            limits.map((entry: number, index:number) => {
                return (
                    <MenuItem
                    key={index}
                    value={entry}
                    >
                    {entry}
                    </MenuItem>
                )
            })}
            </Select>

            </FormControl>

            <IconButton className="mr-2" onClick={() => {
                if (offSet > 0) {
                    setOffSet(offSet - 1)
                    onChange(offSet - 1, parseInt(limit))
                }
            }}><ChevronLeft/></IconButton>

            <Typography>{offSet + 1}</Typography>

            <IconButton className="ml-2" onClick={() => {
                setOffSet(offSet + 1)
                onChange(offSet + 1, parseInt(limit))
            }}><ChevronRight/></IconButton>
            </Box>
    );
}

const PeriodicTable = (props: PeriodicTableProps) => {

    useEffect(() => {
        refreshColumns(0, 5, "");
    }, [])


    const refreshColumns = (offset: number, limit: number, searchText: string) => {
        if (props.onApi != null) {
            props.onApi(offset, limit, searchText)
                .then((rows: any[]) => {
                    loadColumns(rows)
                })
        } else if (props.rows != null) {
            let rows = props.rows.slice(offset * limit, (offset * limit) + limit)
            loadColumns(rows)
        }
    }

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
                    onEdit: () => {}
                }
                column.rows.push(tableRow)
            }) 
            return column;
        })
        updateColumns(newColumns)
    }

    return (
        <div className="flex flex-col w-full h-auto">
            <Box className="flex flex-row w-full justify-between ">
                <TableActions onFilterToggle={() => toggleFilter(!filterOpen)}/>
                <TablePagination onChange={(offset: number, limit: number) => {
                    refreshColumns(offset, limit, "");
                }}/>
            </Box>
            <Box className="flex flex-row">
            {
                filterOpen &&
                    <Box className="flex flex-col">
                        <Typography>Filters</Typography>
                    </Box>
            }
            <Table columns={tableColumns}/>
            </Box>
        </div>
    );
}

export { PeriodicTable }
