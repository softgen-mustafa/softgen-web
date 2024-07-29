"use client";
import {
  getAsync,
  getBmrmBaseUrl,
  postAsync,
} from "@/app/services/rest_services";
import { DataTable } from "@/app/ui/data_grid";
import { DropDown } from "@/app/ui/drop_down";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { ChevronLeftRounded, LabelOffRounded } from "@mui/icons-material";
import { Grid, IconButton, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const ItemGroupCard = ({ voucherType }: { voucherType: string }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, [voucherType]);

  const columns: GridColDef[] = [
    {
      field: "itemGroup",
      headerName: "Stock Group",
      editable: false,
      sortable: true,
      minWidth: 300,
      maxWidth: 400,
    },
    {
      field: "amount",
      headerName: "Value",
      editable: false,
      sortable: true,
      minWidth: 300,
      maxWidth: 400,
    },
    {
      field: "quantity",
      headerName: "Qty",
      editable: false,
      sortable: true,
      minWidth: 300,
      maxWidth: 400,
    },
  ];

  const loadData = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/meta-voucher/item-group/overview?voucherType=${voucherType}`;
      let response = await postAsync(url, {});
      setData(
        response.map((entry: any) => {
          return {
            id: entry.itemGroup,
            ...entry,
          };
        })
      );
    } catch {
      alert("Could not load data");
    }
  };
  return (
    <div className="flex flex-col">
      <DataGrid
        columns={columns}
        rows={data}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        onRowClick={(params) => {}}
        pageSizeOptions={[5, 10, 25, 50, 75, 100]}
        disableRowSelectionOnClick
        onPaginationModelChange={(value) => {}}
      />
    </div>
  );
};



const BillsCard = ({ voucherType }: { voucherType: string }) => {
  const [data, setData] = useState([]);

  const router = useRouter();
  useEffect(() => {
    loadData();
  }, [voucherType]);

  const columns: GridColDef[] = [
    {
      field: "voucherNumber",
      headerName: "Bill",
      editable: false,
      sortable: true,
      minWidth: 300,
      maxWidth: 400,
    },
    {
      field: "partyName",
      headerName: "Party",
      editable: false,
      sortable: true,
      minWidth: 300,
      maxWidth: 400,
    },
    {
      field: "preGstAmount",
      headerName: "Value",
      editable: false,
      sortable: true,
      minWidth: 300,
      maxWidth: 400,
    },
    {
      field: "postGstAmount",
      headerName: "Post Tax Value",
      editable: false,
      sortable: true,
      minWidth: 300,
      maxWidth: 400,
    },
  ];

  const loadData = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/meta-voucher/bill/overview?voucherType=${voucherType}`;
      let response = await postAsync(url, {});
      setData(
        response.map((entry: any) => {
          return {
            id: entry.voucherNumber,
            ...entry,
          };
        })
      );
    } catch {
      alert("Could not load data");
    }
  };
  return (
    <div className="flex flex-col">
      <DataGrid
        columns={columns}
        rows={data}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        onRowClick={(params) => {
          localStorage.setItem("voucherNumber", (params.row));
          router.push("/dashboard/vouchers/voucherDetails");
        }}
        pageSizeOptions={[5, 10, 25, 50, 75, 100]}
        disableRowSelectionOnClick
        onPaginationModelChange={(value) => {}}
      />
    </div>
  );
};

const MonthlySalesCard = ({ voucherType }: { voucherType: string }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, [voucherType]);

  const columns: GridColDef[] = [
    {
      field: "monthStr",
      headerName: "Month",
      editable: false,
      sortable: true,
      minWidth: 300,
      maxWidth: 400,
    },
    {
      field: "preGstAmount",
      headerName: "Value",
      editable: false,
      sortable: true,
      minWidth: 300,
      maxWidth: 400,
    },
  ];

  const loadData = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/meta-voucher/monthly/overview?voucherType=${voucherType}`;
      let response = await postAsync(url, {});
      console.log(`response: ${JSON.stringify(response)}`);
      setData(
        response.map((entry: any) => {
          return {
            id: entry.monthStr,
            monthStr: entry.monthStr,
            preGstAmount: entry.preGstAmount,
          };
        })
      );
    } catch {
      alert("Could not load data");
    }
  };
  return (
    <div className="flex flex-col">
      <DataGrid
        columns={columns}
        rows={data}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        onRowClick={(params) => {}}
        pageSizeOptions={[5, 10, 25, 50, 75, 100]}
        disableRowSelectionOnClick
        onPaginationModelChange={(value) => {}}
      />
    </div>
  );
};

const MonthlyCustomerSalesCard = ({ voucherType }: { voucherType: string }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, [voucherType]);

  const columns: GridColDef[] = [
    {
      field: "partyName",
      headerName: "Party",
      editable: false,
      sortable: true,
      minWidth: 300,
      maxWidth: 400,
    },
    {
      field: "monthStr",
      headerName: "Month",
      editable: false,
      sortable: true,
      minWidth: 300,
      maxWidth: 400,
    },
    {
      field: "preGstAmount",
      headerName: "Value",
      editable: false,
      sortable: true,
      minWidth: 300,
      maxWidth: 400,
    },
  ];

  const loadData = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/meta-voucher/monthly/customer/overview?voucherType=${voucherType}`;
      let response = await postAsync(url, {});
      setData(
        response.map((entry: any) => {
          return {
            id: entry.partyName,
            partyName: entry.partyName,
            monthStr: entry.monthStr,
            preGstAmount: entry.preGstAmount,
          };
        })
      );
    } catch {
      alert("Could not load data");
    }
  };
  return (
    <div className="flex flex-col">
      <DataGrid
        columns={columns}
        rows={data}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        onRowClick={(params) => {}}
        pageSizeOptions={[5, 10, 25, 50, 75, 100]}
        disableRowSelectionOnClick
        onPaginationModelChange={(value) => {}}
      />
    </div>
  );
};

const CustomerSalesCard = ({ voucherType }: { voucherType: string }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, [voucherType]);

  const columns: GridColDef[] = [
    {
      field: "partyName",
      headerName: "Party",
      editable: false,
      sortable: true,
      minWidth: 300,
      maxWidth: 400,
    },
    {
      field: "preGstAmount",
      headerName: "Value",
      editable: false,
      sortable: true,
      minWidth: 300,
      maxWidth: 400,
    },
  ];

  const loadData = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/meta-voucher/customer/overview?voucherType=${voucherType}`;
      let response = await postAsync(url, {});
      setData(
        response.map((entry: any) => {
          return {
            id: entry.partyName,
            partyName: entry.partyName,
            preGstAmount: entry.preGstAmount,
          };
        }),
      );
    } catch {
      alert("Could not load data");
    }
  };
  return (
    <div className="flex flex-col">
      <DataGrid
        columns={columns}
        rows={data}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        onRowClick={(params) => {}}
        pageSizeOptions={[5, 10, 25, 50, 75, 100]}
        disableRowSelectionOnClick
        onPaginationModelChange={(value) => {}}
      />
    </div>
  );
};

const Page = () => {
  const router = useRouter();

  const [voucherTypes, setVoucherTypes] = useState([]);
  const [selectedVoucherType, setVoucherType] = useState("Sales");

  useEffect(() => {
    loadVoucherTypes();
  }, []);

  const loadVoucherTypes = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/meta-voucher/get/voucher-types`;
      let response = await getAsync(url);
      setVoucherTypes(
        response.map((entry: any) => {
          return {
            id: entry.name,
            name: entry.name,
          };
        })
      );
    } catch {
      alert("Could not load voucher types");
    }
  };

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
          <DropDown
            label="Select Type"
            displayFieldKey={"name"}
            valueFieldKey={null}
            selectionValues={voucherTypes}
            helperText={"Select Outstanding Type"}
            onSelection={(selection) => {
              setVoucherType(selection.name);
            }}
          />
          <br />
          <Typography>Monthly Review</Typography>
          <br />
          <MonthlySalesCard voucherType={selectedVoucherType} />
        </CardView>
      ),
      children: [],
    },
    {
      type: "item",
      className: "",
      view: (
        <CardView title="Party Wise Sales">
          <CustomerSalesCard voucherType={selectedVoucherType} />
        </CardView>
      ),
      children: [],
    },
    {
      type: "item",
      className: "",
      view: (
        <CardView title="Monthly Party Sales">
          <MonthlyCustomerSalesCard voucherType={selectedVoucherType} />
        </CardView>
      ),
      children: [],
    },
    {
      type: "item",
      className: "",
      view: (
        <CardView title="Item Group Sales">
          <ItemGroupCard voucherType={selectedVoucherType} />
        </CardView>
      ),
      children: [],
    },
    {
      type: "item",
      className: "",
      view: (
        <CardView title="Bill Wise Review">
          <BillsCard voucherType={selectedVoucherType} />
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
};
export default Page;
