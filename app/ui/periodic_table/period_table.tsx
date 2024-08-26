"use client";
import {CircularProgress, InputAdornment, TextField, Box, IconButton, Typography } from "@mui/material";
import { Search, ChevronRight, ChevronLeft, Sync, FilterAlt, FilterAltOff } from "@mui/icons-material";
import React, { useState, useRef, useEffect } from "react";
import {
    FormControl,
    MenuItem,
    Select,
} from "@mui/material";

interface PeriodicTableProps {
    columns: TableColumn[];
    rows?: any[];
    useSearch: boolean;
    searchKeys?: TableSearchKey[];
    onApi?: (offset: number, limit: number, searchText: string, searchKey?: string) => Promise<any[]>
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


const TableActions = ({ onFilterToggle, onSync }: TableActionProps) => {
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
            onSync();
        }}><Sync/></IconButton>

        </Box>
    );
}


const TablePagination = ({refresh, onChange}: TablePaginationProps) => {

    useEffect(() => {
        setOffSet(0);
        setLimit("5");
    }, [refresh])

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

const TableSearch = ({onChange, searchKeys = []}: TableSearchProps) => {
    const [searchKey, setSearchKey] = useState("");
    return (
        <Box className="flex flex-row">
        {
            searchKeys != null
            &&
                searchKeys.length > 0
            &&
                <FormControl className="mr-5">
            <Select
            className="w-full"
            value={searchKey}
            onChange={(event) => {
                let selectedValue = event.target.value ?? ""
                setSearchKey(selectedValue)
            }}
            >
            {
                searchKeys.map((entry: TableSearchKey, index:number) => {
                    return (
                        <MenuItem
                        key={index}
                        value={entry.value}
                        >
                        {entry.title}
                        </MenuItem>
                    )
                })}
                </Select>

                </FormControl>
        }

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
}

const PeriodicTable = (props: PeriodicTableProps) => {


    const [loading, setLoading] = useState(false);
    const [refresh, toggleRefresh] = useState(false);

    useEffect(() => {
        refreshColumns(0, 5, "");
    }, [])


    const refreshColumns = (offset: number, limit: number, searchText: string, searchKey?: string) => {
        if (props.onApi != null) {
            try {
                setLoading(true)
                props.onApi(offset, limit, searchText, searchKey)
                .then((rows: any[]) => {
                    loadColumns(rows)
                    setLoading(false)
                })
            } catch {

            } finally {
                setLoading(false)
            }
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
        <TableActions onFilterToggle={() => toggleFilter(!filterOpen)} onSync={() => {
            refreshColumns(0, 5, "")
            toggleRefresh(!refresh);
        }}/>
        {
            props.useSearch
            &&
                <TableSearch 
            searchKeys={props.searchKeys}
            onChange={(searchValue: string, searchKey?: string) => {
                refreshColumns(0, 5, searchValue, searchKey);
            }}
            />
        }
        <TablePagination refresh={refresh} onChange={(offset: number, limit: number) => {
            refreshColumns(offset, limit, "");
        }}/>
        </Box>
        {
            loading
            &&
                <CircularProgress/>
        }
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

export { PeriodicTable };
export type {TableColumn, TableSearchKey};
