// "use client";

// import { getBmrmBaseUrl } from "@/app/services/rest_services";
// import { useEffect, useRef, useState } from "react";
// import { Container, Typography, IconButton, Grid } from "@mui/material";
// import { useRouter } from "next/navigation";
// import { GridColDef } from "@mui/x-data-grid";
// import { ChevronLeftRounded } from "@mui/icons-material";
// import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
// import { numericToString } from "@/app/services/Local/helper";
// import { DataTable } from "@/app/ui/data_grid";
// import { getAsync } from "@/app/services/rest_services";
// const VoucherDetailScreen = () => {
//   const router = useRouter();
//   const [rows, setRows] = useState<any[]>([]);
//   const [isDataLoading, setLoadingStatus] = useState(false);
//   const [voucherDetail, setVoucherDetail] = useState([]);

//   let voucherNumber: string = "";

//   useEffect(() => {
//     voucherNumber = localStorage.getItem("voucherNumber") || "";
//     onLoad();
//   }, []);

//   const onLoad = async () => {
//     try {
//       setLoadingStatus(true);
//       const voucherId = voucherNumber;
//       const billNumber = voucherNumber;
//       let url = voucherId
//         ? `${getBmrmBaseUrl()}/voucher/detail?voucherId=${voucherId}`
//         : `${getBmrmBaseUrl()}/voucher/detail/voucher-number?value=${billNumber}`;
//       let response = await getAsync(url);

//       if (response) {
//         setVoucherDetail(response);
//       } else {
//         setVoucherDetail({});
//       }
//     } catch (error) {
//       console.error("Could not load voucher detail", error);
//     } finally {
//       setLoadingStatus(false);
//     }
//   };
//   const onLoadItems = async () => {
//     try {
//       return voucherDetail.list_of_items ?? [];
//     } catch {
//       alert("Error in onLoadItems:");
//       return [];
//     }
//   };

//   const columns: GridColDef[] = [
//     {
//       field: "name",
//       headerName: "Name",
//       editable: false,
//       sortable: true,
//       minWidth: 300,
//       maxWidth: 400,
//     },
//     {
//       field: "quantity",
//       headerName: "Quantity",
//       type: "number",
//       editable: false,
//       sortable: true,
//       minWidth: 300,
//       maxWidth: 400,
//       valueGetter: (params, row) => row.quantity,
//     },

//     {
//       field: "rate",
//       headerName: "Rate",
//       type: "number",
//       width: 110,
//       valueGetter: (params, row) => row.rate ?? "N/A",
//     },
//     {
//       field: "hsn_or_sac",
//       headerName: "HSNSAC",
//       type: "number",
//       width: 110,
//       valueGetter: (params, row) => row.hsn_or_sac ?? "N/A",
//     },
//     {
//       field: "amount",
//       headerName: "Amount",
//       type: "number",
//       width: 110,
//       valueGetter: (params, row) => row.amount ?? "N/A",
//     },
//   ];

//   const gridConfig: GridConfig[] = [
//     {
//       type: "item",
//       view: (
//         <CardView>
//           <div className="flex flex-row items-center">
//             <IconButton onClick={() => router.back()}>
//               <ChevronLeftRounded />
//             </IconButton>
//             <Typography>Go Back</Typography>
//           </div>
//           <br />
//           <Typography className="text-xl">{"Voucher No,"}</Typography>
//           <Typography className="text-2xl md:text-3xl mt-2">
//             {voucherNo ?? voucherDetail?.["voucher_no"]}
//           </Typography>

//           <br />
//           <Typography className="text-xl">{"Addressed To,"}</Typography>
//           <Typography className="text-2xl md:text-3xl mt-2">
//             {voucherDetail["addressed_to"] ?? "-"}
//           </Typography>

//           <br />
//           <Typography className="text-xl">Invoice Date,</Typography>
//           <Typography className="text-2xl md:text-3xl mt-2">
//             {voucherDetail["invoice_date_string"] ?? "-"}
//           </Typography>

//           <br />
//           <Typography className="text-xl">Due Date,</Typography>
//           <Typography className="text-2xl md:text-3xl mt-2">
//             {voucherDetail["due_date_string"] ?? "-"}
//           </Typography>

//           <br />
//           <Typography className="text-xl">Total Amount,</Typography>
//           <Typography className="text-2xl md:text-3xl mt-2">
//             {voucherDetail["currency"]}{" "}
//             {Math.abs(voucherDetail.amount).toLocaleString()}
//           </Typography>

//           <br />
//           <Typography className="text-xl">Status,</Typography>
//           <Typography className="text-2xl md:text-3xl mt-2">
//             {voucherDetail["status"] ?? "-"}
//           </Typography>
//         </CardView>
//       ),
//       className: "",
//       children: [],
//     },

//     {
//       type: "item",
//       view: (
//         <CardView>
//           <DataTable
//             columns={columns}
//             onApi={async (page, pageSize) => await onApi(page, pageSize)}
//             onRowClick={(params) => {}}
//           />
//         </CardView>
//       ),
//       className: "",
//       children: [],
//     },
//   ];

//   return (
//     <Container sx={{ overflowX: "hidden" }}>
//       <Grid container sx={{ flexGrow: 1, height: "100vh" }}>
//         {RenderGrid(gridConfig)}
//       </Grid>
//     </Container>
//   );
// };

// export default VoucherDetailScreen;

"use client";

import { getBmrmBaseUrl, getAsync } from "@/app/services/rest_services";
import { useEffect, useState } from "react";
import { Container, Typography, IconButton, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { GridColDef } from "@mui/x-data-grid";
import { ChevronLeftRounded } from "@mui/icons-material";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { DataTable } from "@/app/ui/data_grid";

interface VoucherDetail {
  voucher_no: string;
  addressed_to: string;
  invoice_date_string: string;
  due_date_string: string;
  currency: string;
  amount: number;
  status: string;
  list_of_items: any[];
}

const VoucherDetailScreen = () => {
  const router = useRouter();
  const [voucherDetail, setVoucherDetail] = useState<VoucherDetail | null>(
    null
  );
  const [isDataLoading, setLoadingStatus] = useState(false);
  const [voucherNumber, setVoucherNumber] = useState<string>("");
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const storedVoucherNumber = localStorage.getItem("voucherNumber") || "";
    setVoucherNumber(storedVoucherNumber);
    onLoad(storedVoucherNumber);
  }, []);

  const onLoad = async (storedVoucherNumber: string) => {
    try {
      setLoadingStatus(true);
      const url = storedVoucherNumber
        ? `${getBmrmBaseUrl()}/voucher/detail?voucherId=${storedVoucherNumber}`
        : `${getBmrmBaseUrl()}/voucher/detail/voucher-number?value=${storedVoucherNumber}`;
      const response = await getAsync(url);

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

  const onLoadItems = async (
    page: number,
    pageSize: number,
    searchText?: string
  ): Promise<any[]> => {
    try {
      const items = voucherDetail?.list_of_items ?? [];

      let filteredItems = items;
      if (searchText) {
        filteredItems = items.filter((item) =>
          Object.values(item).some((value) =>
            String(value).toLowerCase().includes(searchText.toLowerCase())
          )
        );
      }

      return filteredItems.slice();
    } catch (error) {
      console.error("Error in onLoadItems:", error);
      return [];
    }
  };
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      editable: false,
      sortable: true,
      minWidth: 300,
      maxWidth: 400,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      editable: false,
      sortable: true,
      minWidth: 300,
      maxWidth: 400,
    },
    {
      field: "rate",
      headerName: "Rate",
      type: "number",
      width: 110,
      valueGetter: (params, row) => row.rate ?? "N/A",
    },
    {
      field: "hsn_or_sac",
      headerName: "HSNSAC",
      type: "number",
      width: 110,
      valueGetter: (params, row) => row.hsn_or_sac ?? "N/A",
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      width: 110,
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
          <DataTable
            columns={columns}
            onApi={async (page, pageSize, searchText) => {
              return onLoadItems(page, pageSize, searchText);
            }}
            onRowClick={(params) => {}}
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
