"use client";

import { getBmrmBaseUrl, getAsync } from "@/app/services/rest_services";
import { useEffect, useRef, useState } from "react";
import { Container, Typography, IconButton, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { ChevronLeftRounded } from "@mui/icons-material";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";

interface VoucherItem {
  id: string;
  name: string;
  quantity: number;
  rate?: number;
  hsn_or_sac?: string;
  amount?: number;
}

interface VoucherDetail {
  voucher_no: string;
  addressed_to: string;
  invoice_date_string: string;
  due_date_string: string;
  currency: string;
  amount: number;
  status: string;
  list_of_items: VoucherItem[];
}

const VoucherDetailScreen = ({}) => {
  let billNumber = useRef("");
  let guid = useRef("");

  const router = useRouter();
  const [voucherDetail, setVoucherDetail] = useState<VoucherDetail | null>(
    null
  );
  const [isDataLoading, setLoadingStatus] = useState(false);
  const [rows, setRows] = useState<VoucherItem[]>([]);

  useEffect(() => {
    billNumber.current = localStorage.getItem("billNumber") || "";
    guid.current = localStorage.getItem("guid") || "";
    onLoad();
  }, []);

  useEffect(() => {
    if (voucherDetail?.list_of_items) {
      setRows(
        voucherDetail.list_of_items.map((item, index) => ({
          ...item,
          id: index.toString(),
        }))
      );
    }
  }, [voucherDetail]);


  // let voucherId = "df89b80e-9048-49f1-9c5e-0c88fe9886f0-00017f21";
  // let billNumber = "400";
  const onLoad = async () => {
    try {
      setLoadingStatus(true);
      let url = guid.current.length > 0
        ? `${getBmrmBaseUrl()}/voucher/detail?voucherId=${encodeURIComponent(guid.current)}`
        : `${getBmrmBaseUrl()}/voucher/detail/voucher-number?value=${encodeURIComponent(billNumber.current)}`;
      console.log("onLoad url ", url);
      const response = await getAsync(url);
      console.log("onLoad Resposne ", response);

      if (response) {
        setVoucherDetail(response);
      } else {
        setVoucherDetail(null);
      }
    } catch (error) {
      console.error("Could not load voucher detail", error);
    } finally {
      setLoadingStatus(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      editable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      editable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: "rate",
      headerName: "Rate",
      type: "number",
      flex: 1,
      valueGetter: (params, row) => row.rate ?? "N/A",
    },
    {
      field: "hsn_or_sac",
      headerName: "HSNSAC",
      type: "number",
      flex: 1,
      valueGetter: (params, row) => row.hsn_or_sac ?? "N/A",
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      flex: 1,
      valueGetter: (params, row) => row.amount ?? "N/A",
    },
  ];

  const gridConfig: GridConfig[] = [
    {
      type: "item",
      view: (
        <CardView>
          <div className="flex flex-row items-center">
            <IconButton onClick={() => router.back()}>
              <ChevronLeftRounded />
            </IconButton>
            <Typography>Go Back</Typography>
          </div>
          <br />
          <Typography className="text-xl">{"Voucher No,"}</Typography>
          <Typography className="text-2xl md:text-3xl mt-2">
            {voucherDetail?.voucher_no ?? "-"}
          </Typography>
          <br />
          <Typography className="text-xl">{"Addressed To,"}</Typography>
          <Typography className="text-2xl md:text-3xl mt-2">
            {voucherDetail?.addressed_to ?? "-"}
          </Typography>
          <br />
          <Typography className="text-xl">Invoice Date,</Typography>
          <Typography className="text-2xl md:text-3xl mt-2">
            {voucherDetail?.invoice_date_string ?? "-"}
          </Typography>
          <br />
          <Typography className="text-xl">Due Date,</Typography>
          <Typography className="text-2xl md:text-3xl mt-2">
            {voucherDetail?.due_date_string ?? "-"}
          </Typography>
          <br />
          <Typography className="text-xl">Total Amount,</Typography>
          <Typography className="text-2xl md:text-3xl mt-2">
            {voucherDetail?.currency}{" "}
            {Math.abs(voucherDetail?.amount ?? 0).toLocaleString()}
          </Typography>
          <br />
          <Typography className="text-xl">Status,</Typography>
          <Typography className="text-2xl md:text-3xl mt-2">
            {voucherDetail?.status ?? "-"}
          </Typography>
        </CardView>
      ),
      className: "",
      children: [],
    },
    {
      type: "item",
      view: (
        <CardView>
          <DataGrid
            columns={columns}
            rows={rows}
            getRowId={(row) => row.id}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5, 10, 25, 50, 75, 100]}
            disableRowSelectionOnClick
          />
        </CardView>
      ),
      className: "",
      children: [],
    },
  ];

  return (
    <Container sx={{ overflowX: "hidden" }}>
      <Grid container sx={{ flexGrow: 1, height: "100vh" }}>
        {RenderGrid(gridConfig)}
      </Grid>
    </Container>
  );
};

export default VoucherDetailScreen;
