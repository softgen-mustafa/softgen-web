"use client";
import { getBmrmBaseUrl, postAsync } from "@/app/services/rest_services";
import { useEffect, useState } from "react";
import {
    Typography,
    IconButton,
    Grid,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { GridColDef } from "@mui/x-data-grid";
import { ChevronLeftRounded} from "@mui/icons-material";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { DataTable } from "@/app/ui/data_grid";


const Page = () => {
    const router = useRouter();
    const [refresh, triggerRefresh] = useState(false);

    useEffect(() => {
    },[])

    const loadData = async () => {
        try {
            let url = `${getBmrmBaseUrl()}/broker-sales/broker/overview`;
            let response = await await postAsync(url, {});
            return response;
        } catch {
            return [];
        }
    }

    const columns: GridColDef[] = [
        {
            field: "partyName",
            headerName: "Party",
            editable: false,
            sortable: true,
            flex: 1,
        },
        {
            field: "preGstAmount",
            headerName: "Value",
            editable: false,
            sortable: true,
            flex: 1,
        },
        {
            field: "postGstAmount",
            headerName: "Post Tax",
            editable: false,
            sortable: true,
            flex: 1,
        },
    ];

    const gridConfig: GridConfig[] = [
        {
            type: "item",
            className: "",
            view: (
                <CardView
                title={"Overview"}
                className="h-fit"
                actions={[
                    <IconButton
                    key={1}
                    onClick={() => {
                        router.back();
                    }}
                    >
                    <ChevronLeftRounded />
                    <Typography>Go Back</Typography>
                    </IconButton>,
                ]}
                >
                <DataTable
                columns={columns}
                refresh={refresh}
                useSearch={false}
                useServerPagination={false}
                onApi={async (page, pageSize, searchText) => {
                    return await loadData();
                }}
                onRowClick={(params) => {
                    localStorage.setItem("partyName", params.row.partyName);
                    router.push("/dashboard/broker/outstanding/party-overview");
                }}
                />
                </CardView>
            ),
            children: [],
        },
    ];

    return (
        <div className="w-full" style={{}}>
        <Grid
        container
        className="bg-gray-200"
        sx={{
            flexGrow: 1,
            height: "100vh",
        }}
        >
        {RenderGrid(gridConfig)}
        </Grid>
        </div>
    );
}

export default Page;
