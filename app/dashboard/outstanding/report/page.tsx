"use client";

import { numericToString } from "@/app/services/Local/helper";
import { DataTable } from "@/app/ui/data_grid";
import { CardView, DynGrid, Weight, GridDirection } from "@/app/ui/responsive_grid";
import { GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const Page = () => {

    const [refresh, setRefresh] = useState(false);

    const loadData = async (offset: number, limit: number, search?: string) => {
        let url = "http://118.139.167.125:45700/os/get/report?isDebit=true";
            let requestBody = {
            "Limit": limit,
            "Offset": offset,
            "PartyName": "",
            "SearchText": search,
            "Groups": [],
            "DueDays": 30,
            "OverDueDays": 90
        }
        let appHeaders = {
            "Content-Type": "application/json; charset=utf-8",
            "CompanyId": Cookies.get("companyId") ?? 1,
        };
        let res = await axios.post(url, requestBody, { headers: appHeaders })
        let values = res.data.Data.map((entry: any, index: number) => {
            return {
                id: index + 1,
                ...entry
            };
        });
        return values
    }


    const columns: GridColDef<any[number]>[] = [
        {
            field: "LedgerName",
            headerName: "Party",
            editable: false,
            sortable: true,
            flex: 1,
            minWidth: 200,
        },
        {
            field: "LedgerGroupName",
            headerName: "Parent",
            editable: false,
            sortable: true,
            flex: 1,
            minWidth: 200,
        },
        {
            field: "BillDate",
            headerName: "Bill Date",
            editable: false,
            sortable: true,
            flex: 1,
        },
        {
            field: "DueDate",
            headerName: "Due Date",
            editable: false,
            sortable: true,
            flex: 1,
        },
        {
            field: "DelayDays",
            headerName: "Delay",
            editable: false,
            sortable: true,
            type: "number",
            flex: 1,
            minWidth: 150,
        },
        {
            field: "Amount",
            headerName: "Pending Amount",
            editable: false,
            sortable: true,
            type: "number",
            flex: 1,
            minWidth: 150,
        },
        {
            field: "DueAmount",
            headerName: "Due Amount",
            editable: false,
            sortable: true,
            type: "number",
            flex: 1,
            minWidth: 150,
        },
        {
            field: "OverDueAmount",
            headerName: "OverDue Amount",
            editable: false,
            sortable: true,
            type: "number",
            flex: 1,
            minWidth: 150,
        },
    ];

    const gridConfig = [
        {
            weight: Weight.High,
            view: (
                <CardView title="Parties">
                <DataTable
                columns={columns}
                refresh={refresh}
                useSearch={true}
                onApi={async (page, pageSize, searchText) => {
                    return await loadData(page, pageSize, searchText);
                }}
                onRowClick={(params) => {
                }}
                />
                </CardView>
            ),
        },
    ]

    return (
        <div className="w-full">
        <DynGrid views={gridConfig} direction={GridDirection.Column}/>
        </div>
    );
}

export default Page;
