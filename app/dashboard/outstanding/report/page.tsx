"use client";

import { numericToString } from "@/app/services/Local/helper";
import { DropDown } from "@/app/ui/drop_down";
import { DataTable } from "@/app/ui/data_grid";
import { CardView, DynGrid, Weight, GridDirection } from "@/app/ui/responsive_grid";
import { GridColDef } from "@mui/x-data-grid";
import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const Page = () => {

    const [refresh, setRefresh] = useState(false);
    const [groups, setGroups] = useState([]);

    let selectedGroups = useRef<string[]>([])

    useEffect(() => {
        loadGroups().then(_ => setRefresh(!refresh))
    }, [])

    const loadGroups = async () => {
        let url = "http://118.139.167.125:45700/os/get/groups?isDebit=true";
        let appHeaders = {
            "Content-Type": "application/json; charset=utf-8",
            "CompanyId": Cookies.get("companyId") ?? 1,
        };
        let res = await axios.get(url,{ headers: appHeaders })
        let values = res.data.map((entry: string) => {
            return {
                name: entry,
                value: entry
            }
        })
        setGroups(values);

    }

    const loadData = async (offset: number, limit: number, search?: string) => {
        let url = "http://118.139.167.125:45700/os/get/report?isDebit=true";
            let requestBody = {
            "Limit": limit,
            "Offset": offset,
            "PartyName": "",
            "SearchText": search,
            "Groups": selectedGroups.current ?? [],
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
        weight: Weight.Low,
        view: (
            <CardView title="Outstanding Overview">
            <DropDown
            label="Select Type"
            displayFieldKey={"name"}
            valueFieldKey={null}
            selectionValues={groups}
            helperText={""}
            onSelection={(selection: any) => {
                /*let exists = selectedGroups.current.indexOf(selection.name);
                if (exists === -1) {
                    selectedGroups.current.push(selection.name)
                }*/
                selectedGroups.current = [selection.name];
                setRefresh(!refresh);
            }}
            />
            </CardView>
        )
        },
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
