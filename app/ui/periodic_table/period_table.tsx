"use client";
import { Box, IconButton, Typography } from "@mui/material";
import { ChevronRight, ChevronLeft, Sync, FilterAlt, FilterAltOff } from "@mui/icons-material";
import { useState, useRef } from "react";
import {
    FormControl,
    MenuItem,
    Select,
} from "@mui/material";

interface TableActionProps {
    onFilterToggle: () => void;
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

const TablePagination = () => {

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
                }
            }}><ChevronLeft/></IconButton>

            <Typography>{offSet + 1}</Typography>

            <IconButton className="ml-2" onClick={() => {
                setOffSet(offSet + 1)
            }}><ChevronRight/></IconButton>
            </Box>
    );
}

const PeriodicTable = () => {
    const [filterOpen, toggleFilter] = useState(false);
    return (
        <div className="flex flex-col w-full h-auto">
            <Box className="flex flex-row w-full justify-between ">
                <TableActions onFilterToggle={() => toggleFilter(!filterOpen)}/>
                <TablePagination />
            </Box>
            {
                filterOpen &&
                <Box className="flex flex-row">
                    <Box className="flex flex-col">
                        <Typography>Filters</Typography>
                    </Box>
                </Box>
            }
        </div>
    );
}

export { PeriodicTable }
