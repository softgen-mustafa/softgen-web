"use client";
import {
  getAsync,
  getBmrmBaseUrl,
  getSgBizBaseUrl,
  postAsync,
} from "@/app/services/rest_services";
import { DropDown } from "@/app/ui/drop_down";
import { CardView, GridConfig, Weight } from "@/app/ui/responsive_grid";
import { ChevronLeftRounded } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSnackbar } from "@/app/ui/snack_bar_provider";
import { numericToString } from "@/app/services/Local/helper";
import {
  PeriodicTable,
  TableColumn,
  ApiProps,
  TableSearchKey,
} from "@/app/ui/periodic_table/period_table";
import ResponsiveCardGrid from "@/app/components/ResponsiveCardGrid";
import GridCardView from "@/app/ui/grid_card";

const ItemGroupCard = ({ voucherType }: { voucherType: string }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [refresh, triggerRefresh] = useState(false);

  useEffect(() => {
    loadData();
  }, [voucherType]);

  const columns: GridColDef<any[number]>[] = [
    {
      field: "itemGroup",
      headerName: "Stock Group",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 250,
    },

    {
      field: "amount",
      headerName: "Value",
      editable: false,
      sortable: true,
      type: "number",
      flex: 1,
    },
    {
      field: "amountstr",
      type: "number",
      headerName: "Value",
      editable: false,
      sortable: true,
      hideable: true,
      flex: 1,
      minWidth: 200,
    },
    {
      field: "quantity",
      type: "number",
      headerName: "Qty",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 150,
    },
  ];

  const searchKeys: TableSearchKey[] = [
    {
      title: "StockGroup",
      value: "Stock Group",
    },
  ];

  const { showSnackbar } = useSnackbar();
  const loadData = async () => {
    try {
      triggerRefresh(true);
      let url = `${getBmrmBaseUrl()}/meta-voucher/item-group/overview?voucherType=${voucherType}`;
      let response = await postAsync(url, {});
      let entries = response.map((entry: any, index: number) => {
        return {
          id: index + 1,
          itemGroup: entry.itemGroup,
          amount: `\u20B9 ${numericToString(entry.amount)}`,
          amountstr: entry.amount,
          quantity: entry.quantity,

          // ...entry,
        };
      });
      setData(entries);
      return entries;
    } catch {
      showSnackbar("Could not Item Group Sales");
    } finally {
      triggerRefresh(false);
    }
  };
  // if (hasPermission === null) {
  //   return <CircularProgress />;
  // }

  // if (hasPermission === false) {
  //   return (
  //     <Typography className="text-2xl font-bold flex items-center justify-center flex-1 pl-2 pr-2">
  //       Get the Premium For this Service Or Contact Admin - 7977662924
  //     </Typography>
  //   );
  // }

  return (
    <div className="flex flex-col">
      {/* {loading && (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      )} */}
      {/* <DataGrid
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
      /> */}
      {/* <DataTable
        columns={columns}
        refresh={refresh}
        onApi={async (page, pageSize, searchText) => {
          return await loadData();
        }}
        useSearch={false}
        useServerPagination={false}
        onRowClick={() => {}}
      /> */}
      <PeriodicTable
        chartKeyFields={[
          {
            label: "Stock Group",
            value: "itemGroup",
          },
        ]}
        chartValueFields={[
          {
            label: "Amount",
            value: "amountstr",
          },
          {
            label: "Quantity",
            value: "quantity",
          },
        ]}
        useSearch={true}
        searchKeys={searchKeys}
        columns={columns.map((col: any) => {
          console.log(col);
          let column: TableColumn = {
            header: col.headerName,
            field: col.field,
            type: "text",
            pinned: false,
            rows: [],
            hideable: col.hideable,
          };
          return column;
        })}
        // onApi={loadData}
        rows={data}
        reload={refresh}
      />
    </div>
  );
};

const BillsCard = ({ voucherType }: { voucherType: string }) => {
  const [data, setData] = useState([]);
  const [refresh, triggerRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const router = useRouter();
  useEffect(() => {
    // FeatureControl("CustomerPartySearch").then((permission) => {
    //   setHasPermission(permission);
    //   if (permission) {
    // triggerRefresh(!refresh);
    //   }
    // });
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
      minWidth: 150,
    },
    {
      field: "partyName",
      headerName: "Party",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
    },
    {
      field: "preGstAmount",
      headerName: "Pre Gst Amount",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 200,
      type: "number",
    },
    {
      field: "amount",
      headerName: "Value",
      editable: false,
      sortable: true,
      flex: 1,
      hideable: true,
      minWidth: 200,
      type: "number",
    },
    {
      field: "postGstAmount",
      headerName: "Post Tax Value",
      editable: false,
      type: "number",
      sortable: true,
      flex: 1,
      minWidth: 200,
    },
    {
      field: "guid",
      headerName: "GUID",
      editable: false,
      type: "number",
      sortable: true,
      hideable: true,
      flex: 1,
      minWidth: 200,
    },
  ];

  const { showSnackbar } = useSnackbar();

  const loadData = async (apiProps: ApiProps) => {
    // alert(JSON.stringify(apiProps));
    setIsLoading(true);
    try {
      let url = `${getBmrmBaseUrl()}/meta-voucher/bill/overview?voucherType=${voucherType}`;
      let requestBody = {
        page_number: apiProps.offset + 1,
        page_size: apiProps.limit,
        search_text: apiProps.searchText ?? "",
        filter: "",
      };

      let response = await postAsync(url, requestBody);
      let entries = response.map((entry: any, index: number) => {
        return {
          id: index + 1,
          voucherNumber: entry.voucherNumber,
          guid: entry.guid,
          partyName: entry.partyName,
          postGstAmount: `\u20B9 ${numericToString(entry.postGstAmount)}`,
          amount: `\u20B9 ${numericToString(entry.amount)}`,
          preGstAmount: `\u20B9 ${numericToString(entry.preGstAmount)}`,
          // preGstAmount: entry.preGstAmount,
          // ...entry,
        };
      });

      setData(entries);
      console.log(`Voucher Details Response : ${JSON.stringify(response)}`);
      return entries;
    } catch {
      showSnackbar("Could not load Transactions");
    } finally {
      setIsLoading(false);
    }
  };

  // if (hasPermission === null) {
  //   return <CircularProgress />;
  // }

  // if (hasPermission === false) {
  //   return (
  //     <Typography className="text-2xl text-center font-bold flex items-center justify-center flex-1 pl-2 pr-2">
  //       Check Your Internet Access Or This Feature is not included in your
  //       Subscription package. Kindly get the Premium package to utilize this
  //       feature.
  //     </Typography>
  //   );
  // }

  const handleRowClick = (rowData: any) => {
    alert(JSON.stringify(rowData));
    localStorage.setItem("guid", rowData.guid);
    localStorage.setItem("party_view_type", "voucher");
    router.push("/dashboard/vouchers/voucherDetails");
  };

  return (
    <div className="flex flex-col">
      <PeriodicTable
        useSearch={true}
        columns={columns.map((col: any) => {
          let column: TableColumn = {
            header: col.headerName,
            field: col.field,
            type: "text",
            pinned: false,
            rows: [],
            hideable: col.hideable,
          };
          return column;
        })}
        onApi={loadData}
        reload={refresh}
        onRowClick={handleRowClick}
      />
      {/* <DataTable
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
      /> */}
    </div>
  );
};

const MonthlySalesCard = ({ voucherType }: { voucherType: string }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    loadData();
  }, [voucherType]);

  // useEffect(() => {
  //   loadData();
  // }, [voucherType]);
  //
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
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
    {
      field: "amount",
      headerName: "Value",
      editable: false,
      sortable: true,
      type: "number",
      hideable: true,
      flex: 1,
    },
  ];

  const loadData = async () => {
    try {
      setLoading(true);

      let url = `${getBmrmBaseUrl()}/meta-voucher/monthly/overview?voucherType=${voucherType}`;
      let response = await postAsync(url, {});
      console.log(`response: ${JSON.stringify(response)}`);

      let values = response.map((entry: any, index: number) => {
        return {
          id: index + 1,
          monthStr: entry.monthStr,
          monthNumber: months.indexOf(entry.monthStr.substring(0, 3)),
          year: entry.monthStr.substring(4),
          preGstAmount: `\u20B9 ${numericToString(entry.preGstAmount)}`,
          amount: entry.preGstAmount,
        };
      });

      let sortedValues = values.sort((a: any, b: any) => {
        if (a.year !== b.year) {
          return sortBy.current === "asc" ? a.year - b.year : b.year - a.year; // Sort by Year
        } else {
          return sortBy.current === "asc"
            ? a.monthNumber - b.monthNumber
            : b.monthNumber - a.monthNumber; // If years are equal, sort by MonthNumber
        }
      });
      setData(sortedValues);
      // triggerRefresh(!refresh)
      return sortedValues;
    } catch {
      showSnackbar("Could not Load Monthly Sales");
      return [];
    } finally {
      setLoading(false);
    }
  };

  let sortBy = useRef("asc");
  const [refresh, triggerRefresh] = useState(false);
  return (
    <div className="flex flex-col">
      {/* {loading && (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      )} */}
      {/* <DataTable
        columns={columns}
        refresh={refresh}
        onApi={async (page, pageSize, searchText) => {
          return await loadData();
        }}
        onRowClick={(params) => {
          const row = params.row;
        }}
        useSearch={false}
        useServerPagination={false}
        useCustomSorting={true}
        SortingView={() => (
          <div className=" mb-3">
            <Button
              variant="contained"
              sx={{
                textTransform: "capitalize",
              }}
              onClick={() => {
                sortBy.current = sortBy.current == "asc" ? "desc" : "asc";
                triggerRefresh(!refresh);
              }}
            >
              Sort Month By {sortBy.current == "asc" ? "desc" : "asc"}
            </Button>
          </div>
        )}
      /> */}
      <PeriodicTable
        chartKeyFields={[
          {
            label: "Month",
            value: "monthStr",
          },
        ]}
        chartValueFields={[
          {
            label: "Amount",
            value: "amount",
          },
        ]}
        useSearch={false}
        columns={columns.map((col: any) => {
          let column: TableColumn = {
            header: col.headerName,
            field: col.field,
            type: "text",
            pinned: false,
            rows: [],
            hideable: col.hideable,
          };
          return column;
        })}
        rows={data}
        // onApi={loadData}
        reload={loading}
      />
    </div>
  );
};

const MonthlyCustomerSalesCard = ({ voucherType }: { voucherType: string }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, triggerRefresh] = useState(false);
  // const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    // FeatureControl("CustomerPartySearch").then((permission) => {
    //   setHasPermission(permission);
    //   if (permission) {
    loadData();
    //   }
    // });
  }, [voucherType]);

  // useEffect(() => {
  //   loadData();
  // }, [voucherType]);

  let sortBy = useRef("asc");

  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const columns: GridColDef[] = [
    {
      field: "partyName",
      headerName: "Party",
      editable: false,
      sortable: true,
      flex: 1,
      minWidth: 250,
    },
    {
      field: "monthStr",
      headerName: "Month",
      editable: false,
      sortable: true,
      type: "number",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "preGstAmount",
      headerName: "Value",
      editable: false,
      type: "number",
      sortable: true,
      flex: 1,
      minWidth: 180,
    },
    {
      field: "amount",
      headerName: "Value",
      editable: false,
      type: "number",
      sortable: true,
      flex: 1,
      hideable: true,
      minWidth: 180,
    },
  ];

  const loadData = async () => {
    try {
      setLoading(true);
      let url = `${getBmrmBaseUrl()}/meta-voucher/monthly/customer/overview?voucherType=${voucherType}`;
      let response = await postAsync(url, {});
      let values = response.map((entry: any, index: number) => {
        return {
          id: index + 1,
          partyName: entry.partyName,
          monthStr: entry.monthStr,
          monthNumber: months.indexOf(entry.monthStr.substring(0, 3)),
          year: entry.monthStr.substring(4),
          preGstAmount: `\u20B9 ${numericToString(entry.preGstAmount)}`,
          amount: entry.preGstAmount,
        };
      });

      let sortedValues = values.sort((a: any, b: any) => {
        if (a.year !== b.year) {
          return sortBy.current === "asc" ? a.year - b.year : b.year - a.year; // Sort by Year
        } else {
          return sortBy.current === "asc"
            ? a.monthNumber - b.monthNumber
            : b.monthNumber - a.monthNumber; // If years are equal, sort by MonthNumber
        }
      });
      setData(sortedValues);
      return sortedValues;
    } catch {
      showSnackbar("Could not load Monthly Party Sales");
    } finally {
      setLoading(false);
    }
  };

  // if (hasPermission === null) {
  //   return <CircularProgress />;
  // }

  // if (hasPermission === false) {
  //   return (
  //     <Typography className="text-2xl font-bold flex items-center justify-center flex-1 pl-2 pr-2">
  //       Get the Premium For this Service Or Contact Admin - 7977662924
  //     </Typography>
  //   );
  // }
  return (
    <div className="flex flex-col">
      {/* {loading && (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      )} */}
      {/* <DataTable
        columns={columns}
        refresh={refresh}
        onApi={async (page, pageSize, searchText) => {
          return await loadData();
        }}
        onRowClick={(params) => {
          const row = params.row;
        }}
        useSearch={false}
        useServerPagination={false}
        useCustomSorting={true}
        SortingView={() => (
          <div className=" mb-3">
            <Button
              variant="contained"
              sx={{
                textTransform: "capitalize",
              }}
              onClick={() => {
                sortBy.current = sortBy.current == "asc" ? "desc" : "asc";
                triggerRefresh(!refresh);
              }}
            >
              Sort Month By {sortBy.current == "asc" ? "desc" : "asc"}
            </Button>
          </div>
        )}
      /> */}
      <PeriodicTable
        chartKeyFields={[
          {
            label: "Party",
            value: "partyName",
          },
        ]}
        chartValueFields={[
          {
            label: "Amount",
            value: "amount",
          },
        ]}
        useSearch={false}
        columns={columns.map((col: any) => {
          let column: TableColumn = {
            header: col.headerName,
            field: col.field,
            type: "text",
            pinned: false,
            rows: [],
            hideable: col.hideable,
          };
          return column;
        })}
        // onApi={loadData}
        rows={data}
        reload={loading}
      />
    </div>
  );
};

const CustomerSalesCard = ({ voucherType }: { voucherType: string }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, triggerRefresh] = useState(false);
  // const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    // FeatureControl("CustomerPartySearch").then((permission) => {
    //   setHasPermission(permission);
    //   if (permission) {
    loadData();
    //   }
    // });
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
    {
      field: "amount",
      headerName: "Value",
      editable: false,
      type: "number",
      hideable: true,
      sortable: true,
      flex: 1,
    },
  ];

  const { showSnackbar } = useSnackbar();
  const loadData = async () => {
    try {
      triggerRefresh(true);
      let url = `${getBmrmBaseUrl()}/meta-voucher/customer/overview?voucherType=${voucherType}`;
      let response = await postAsync(url, {});
      let entries = response.map((entry: any, index: number) => {
        return {
          id: index + 1,
          partyName: entry.partyName,
          preGstAmount: `\u20B9 ${numericToString(entry.preGstAmount)}`,
          amount: entry.preGstAmount,
        };
      });
      setData(entries);
      return entries;
    } catch {
      showSnackbar("Could not load customer sales");
    } finally {
      triggerRefresh(false);
    }
  };

  return (
    <div className="flex flex-col">
      <PeriodicTable
        chartKeyFields={[
          {
            label: "Party",
            value: "partyName",
          },
        ]}
        chartValueFields={[
          {
            label: "Amount",
            value: "amount",
          },
        ]}
        useSearch={false}
        columns={columns.map((col: any) => {
          let column: TableColumn = {
            header: col.headerName,
            field: col.field,
            type: "text",
            pinned: false,
            rows: [],
            hideable: col.hideable,
          };
          return column;
        })}
        rows={data}
        // onApi={loadData}
        reload={refresh}
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
      // alert(url);
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

  const views = [
    {
      id: 1,
      weight: Weight.High,
      content: (
        <div title="Overview">
          <DropDown
            label="Select Type"
            displayFieldKey={"name"}
            valueFieldKey={null}
            selectionValues={voucherTypes}
            helperText={"Select Outstanding Type"}
            onSelection={(selection) => {
              setVoucherType(selection.name);
            }}
            useSearch={true}
          />
          <br />
          <GridCardView title="Monthly Review" permissionCode="MonthlyReview">
            <MonthlySalesCard voucherType={selectedVoucherType} />
          </GridCardView>
        </div>
        // </CardView>
      ),
      children: [],
    },
    {
      id: 2,
      weight: Weight.High,
      content: (
        <GridCardView
          title="Monthly Party Sales"
          permissionCode="MonthlyPartySales"
        >
          <MonthlyCustomerSalesCard voucherType={selectedVoucherType} />
        </GridCardView>
      ),
      children: [],
    },
    {
      id: 3,
      weight: Weight.High,
      content: (
        <GridCardView title="Party Wise Sales" permissionCode="PartyWiseSales">
          <CustomerSalesCard voucherType={selectedVoucherType} />
        </GridCardView>
      ),
      children: [],
    },
    {
      id: 4,
      weight: Weight.High,
      content: (
        <GridCardView title="Item Group Sales" permissionCode="ItemGroupSales">
          <ItemGroupCard voucherType={selectedVoucherType} />
        </GridCardView>
      ),
      children: [],
    },
    {
      id: 5,
      weight: Weight.High,
      content: (
        <GridCardView title="Bill Wise Review" permissionCode="BillWiseReview">
          <BillsCard voucherType={selectedVoucherType} />
        </GridCardView>
      ),
      children: [],
    },
  ];

  return (
    <div className="w-full" style={{}}>
      <ResponsiveCardGrid screenName="vouchers" initialCards={views} />
    </div>
  );
};
export default Page;
