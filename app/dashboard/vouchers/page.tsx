"use client";
import {
  getAsync,
  getBmrmBaseUrl,
  postAsync,
} from "@/app/services/rest_services";
import { DataTable } from "@/app/ui/data_grid";
import { DropDown } from "@/app/ui/drop_down";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import {
  ChevronLeftRounded,
  LabelOffRounded,
  Refresh,
} from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  Icon,
  IconButton,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import FeatureControl from "@/app/components/featurepermission/page";
import { useSnackbar } from "@/app/ui/snack_bar_provider";

const ItemGroupCard = ({ voucherType }: { voucherType: string }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // useEffect(() => {
  //   loadData();
  // }, [voucherType]);

  useEffect(() => {
    FeatureControl("CustomerPartySearch").then((permission) => {
      setHasPermission(permission);
      if (permission) {
        loadData();
      }
    });
  }, [voucherType]);

  const columns: GridColDef[] = [
    {
      field: "itemGroup",
      headerName: "Stock Group",
      editable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: "amount",
      type: "number",
      headerName: "Value",
      editable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: "quantity",
      type: "number",
      headerName: "Qty",
      editable: false,
      sortable: true,
      flex: 1,
    },
  ];


  const { showSnackbar } = useSnackbar();
  const loadData = async () => {
    try {
      setLoading(true);
      let url = `${getBmrmBaseUrl()}/meta-voucher/item-group/overview?voucherType=${voucherType}`;
      let response = await postAsync(url, {});
      setData(
        response.map((entry: any, index: number) => {
          return {
            id: index + 1,
            itemGroup: entry.itemGroup,
            ...entry,
          };
        })
      );
    } catch {
      showSnackbar("Could not Item Group Sales");
    } finally {
      setLoading(false);
    }
  };
  if (hasPermission === null) {
    return <CircularProgress />;
  }

  if (hasPermission === false) {
    return (
      <Typography className="text-2xl font-bold flex items-center justify-center flex-1 pl-2 pr-2">
        Get the Premium For this Service Or Contact Admin - 7977662924
      </Typography>
    );
  }

  return (
    <div className="flex flex-col">
      {loading && (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      )}
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
  const [refresh, triggerRefresh] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const router = useRouter();
  useEffect(() => {
    FeatureControl("CustomerPartySearch").then((permission) => {
      setHasPermission(permission);
      if (permission) {
        triggerRefresh(!refresh);
      }
    });
  }, [voucherType]);
  // useEffect(() => {
  //   triggerRefresh(!refresh);
  // }, [voucherType]);

  const columns: GridColDef<any[number]>[] = [
    {
      field: "voucherNumber",
      headerName: "Bill",
      editable: false,
      sortable: true,
      flex: 1,
    },
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
      type: "number",
    },
    {
      field: "postGstAmount",
      headerName: "Post Tax Value",
      editable: false,
      type: "number",
      sortable: true,
      flex: 1,
    },
  ];

  const { showSnackbar } = useSnackbar();

  const loadData = async (
    page: number,
    pageSize: number,
    searchValue?: string
  ) => {
    try {
      let url = `${getBmrmBaseUrl()}/meta-voucher/bill/overview?voucherType=${voucherType}`;
      let requestBody = {
        page_number: page,
        page_size: pageSize,
        search_text: searchValue ?? "",
        filter: "",
      };

      let response = await postAsync(url, requestBody);
      let entries = response.map((entry: any, index: number) => {
        return {
          id: index + 1,
          voucherNumber: entry.voucherNumber,
          guid: entry.guid,
          ...entry,
        };
      });

      setData(entries);
      console.log(`Voucher Details Response : ${JSON.stringify(response)}`);
      return entries;
    } catch {
      showSnackbar("Could not load Transactions");
    }
  };

  if (hasPermission === null) {
    return <CircularProgress />;
  }

  if (hasPermission === false) {
    return (
      <Typography className="text-2xl font-bold flex items-center justify-center flex-1 pl-2 pr-2">
        Get the Premium For this Service Or Contact Admin - 7977662924
      </Typography>
    );
  }

  return (
    <div className="flex flex-col">
      <DataTable
        columns={columns}
        refresh={refresh}
        useSearch={true}
        onApi={async (page, pageSize, searchText) => {
          return await loadData(page, pageSize, searchText);
        }}
        onRowClick={(params) => {
          localStorage.setItem("guid", params.row.guid);
          localStorage.setItem("party_view_type", "voucher");
          router.push("/dashboard/vouchers/voucherDetails");
        }}
      />
    </div>
  );
};

const MonthlySalesCard = ({ voucherType }: { voucherType: string }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    FeatureControl("CustomerPartySearch").then((permission) => {
      setHasPermission(permission);
      if (permission) {
        loadData();
      }
    });
  }, [voucherType]);

  // useEffect(() => {
  //   loadData();
  // }, [voucherType]);
  //

  const { showSnackbar } = useSnackbar();
  const columns: GridColDef[] = [
    {
      field: "monthStr",
      headerName: "Month",
      editable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: "preGstAmount",
      headerName: "Value",
      editable: false,
      sortable: true,
      type: "number",
      flex: 1,
    },
  ];

  const loadData = async () => {
    try {
      setLoading(true);

      let url = `${getBmrmBaseUrl()}/meta-voucher/monthly/overview?voucherType=${voucherType}`;
      let response = await postAsync(url, {});
      console.log(`response: ${JSON.stringify(response)}`);
      setData(
        response.map((entry: any, index: number) => {
          return {
            id: index + 1,
            monthStr: entry.monthStr,
            preGstAmount: entry.preGstAmount,
          };
        })
      );
    } catch {
        showSnackbar("Could not Load Monthly Sales");
    } finally {
      setLoading(false);
    }
  };
  if (hasPermission === null) {
    return <CircularProgress />;
  }

  if (hasPermission === false) {
    return (
      <Typography className="text-2xl font-bold flex items-center justify-center flex-1 pl-2 pr-2">
        Get the Premium For this Service Or Contact Admin - 7977662924
      </Typography>
    );
  }

  return (
    <div className="flex flex-col">
      {loading && (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      )}
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
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const { showSnackbar }  = useSnackbar();

  useEffect(() => {
    FeatureControl("CustomerPartySearch").then((permission) => {
      setHasPermission(permission);
      if (permission) {
        loadData();
      }
    });
  }, [voucherType]);

  // useEffect(() => {
  //   loadData();
  // }, [voucherType]);

  const columns: GridColDef[] = [
    {
      field: "partyName",
      headerName: "Party",
      editable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: "monthStr",
      headerName: "Month",
      editable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: "preGstAmount",
      headerName: "Value",
      editable: false,
      type: "number",
      sortable: true,
      flex: 1,
    },
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      let url = `${getBmrmBaseUrl()}/meta-voucher/monthly/customer/overview?voucherType=${voucherType}`;
      let response = await postAsync(url, {});
      setData(
        response.map((entry: any, index: number) => {
          return {
            id: index + 1,
            partyName: entry.partyName,
            monthStr: entry.monthStr,
            preGstAmount: entry.preGstAmount,
          };
        })
      );
    } catch {
        showSnackbar("Could not load Monthly Party Sales");
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return <CircularProgress />;
  }

  if (hasPermission === false) {
    return (
      <Typography className="text-2xl font-bold flex items-center justify-center flex-1 pl-2 pr-2">
        Get the Premium For this Service Or Contact Admin - 7977662924
      </Typography>
    );
  }
  return (
    <div className="flex flex-col">
      {loading && (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      )}
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
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    FeatureControl("CustomerPartySearch").then((permission) => {
      setHasPermission(permission);
      if (permission) {
        loadData();
      }
    });
  }, [voucherType]);

  // useEffect(() => {
  //   loadData();
  // }, [voucherType]);

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
      type: "number",
      sortable: true,
      flex: 1,
    },
  ];

  const { showSnackbar } = useSnackbar();
  const loadData = async () => {
    try {
      setLoading(true);
      let url = `${getBmrmBaseUrl()}/meta-voucher/customer/overview?voucherType=${voucherType}`;
      let response = await postAsync(url, {});
      setData(
        response.map((entry: any, index: number) => {
          return {
            id: index + 1,
            partyName: entry.partyName,
            preGstAmount: entry.preGstAmount,
          };
        })
      );
    } catch {
        showSnackbar("Could not load customer sales");
    } finally {
      setLoading(false);
    }
  };

  if (hasPermission === null) {
    return <CircularProgress />;
  }

  if (hasPermission === false) {
    return (
      <Typography className="text-2xl font-bold flex items-center justify-center flex-1 pl-2 pr-2">
        Get the Premium For this Service Or Contact Admin - 7977662924
      </Typography>
    );
  }
  return (
    <div className="flex flex-col">
      {loading && (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      )}
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

  const { showSnackbar } = useSnackbar();
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
      showSnackbar("Could not load voucher types");
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
