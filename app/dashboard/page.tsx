"use client";
import { CustomerDetailsCard } from "./cards/customer_card";
import { Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import { OutstandingCard } from "./cards/outstanding_card";
import { InventoryCard } from "./cards/inventory_card";
import { OutstandingTask } from "./cards/outstanding_task_card";
import {
  CardView,
  GridConfig,
  RenderGrid,
  Weight,
  DynGrid,
} from "../ui/responsive_grid";
import { DropDown } from "../ui/drop_down";
import {
  getAsync,
  getBmrmBaseUrl,
  getSgBizBaseUrl,
} from "../services/rest_services";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { inspiredPalette } from "../ui/theme";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { convertToDate, numericToString } from "../services/Local/helper";
import { useRouter } from "next/navigation";
import { FeatureControl } from "../components/featurepermission/permission_helper";
import RankedPartyOutstandingCard from "./cards/ranked_party";
import { AgingView } from "./cards/aging_card";
import { DataTable } from "@/app/ui/data_grid";
import { SingleChartView } from "@/app/ui/graph_util";
import Column from "../ui/periodic_table/column";
import {
  ApiProps,
  PeriodicTable,
  TableColumn,
} from "../ui/periodic_table/period_table";
import Loading from "./loading";

const BrokerMonthlyOverview = ({ companyId }: { companyId: string }) => {
  useEffect(() => {}, [companyId]);

  const columns: GridColDef<any[number]>[] = [
    {
      field: "dateStr",
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
      flex: 1,
      type: "number",
      // valueGetter: (value, row) => `${row.currency || ""} ${row.amount || "0"}`,
      valueGetter: (value, row) =>
        `${numericToString(row.preGstAmount) || "0"}`,
    },
    {
      field: "postGstAmount",
      headerName: "Post Tax",
      editable: false,
      sortable: true,
      flex: 1,
      type: "number",
      // valueGetter: (value, row) => `${row.currency || ""} ${row.amount || "0"}`,
      valueGetter: (value, row) =>
        `${numericToString(row.postGstAmount) || "0"}`,
    },
    {
      field: "commission",
      headerName: "Commission",
      editable: false,
      sortable: true,
      flex: 1,
      type: "number",
      // valueGetter: (value, row) => `${row.currency || ""} ${row.amount || "0"}`,
      valueGetter: (value, row) => `${numericToString(row.commission) || "0"}`,
    },
  ];

  const onApi = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/broker-sales/get/broker/monthly-sales?monthYear=all`;
      let response = await getAsync(url);
      let entries = response.map((entry: any, index: number) => {
        return {
          id: index + 1,
          ...entry,
        };
      });
      return entries ?? [];
    } catch {
      return [];
    }
  };

  return (
    <Box>
      <DataTable
        columns={columns}
        refresh={true}
        useSearch={true}
        useServerPagination={false}
        onApi={async (page, pageSize, searchText) => {
          return await onApi();
        }}
        onRowClick={(params) => {}}
      />
    </Box>
  );
};

interface ColumProps {
  header: string;
  field: string;
  type: string;
}

const DashboardPage = () => {
  const [data, setData] = useState([]);
  const [filters, updateFilters] = useState([
    { id: 1, label: "Daily", value: "daily", isSelected: true },
    { id: 2, label: "Weekly", value: "weekly", isSelected: false },
    { id: 3, label: "Montly", value: "monthly", isSelected: false },
    { id: 4, label: "Quarterly", value: "quarterly", isSelected: false },
    { id: 5, label: "Yearly", value: "yearly", isSelected: false },
  ]);

  let incomingBillType = "Receivable"; // populate later
  const [types, updateTypes] = useState([
    { id: 1, label: "Receivable", code: "receivable" },
    { id: 2, label: "Payable", code: "payable" },
  ]);

  let selectedType = useRef(types[incomingBillType === "Payable" ? 1 : 0]);
  let selectedFilter = useRef(filters[0]);

  const [cachedCompanyIndex, setCompanyId] = useState(0);

  const [totalAmount, setAmount] = useState("0");
  const [syncInfo, setSyncInfo] = useState("");

  const [rows, setRows] = useState([]);

  const [refresh, triggerRefresh] = useState(false);
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const router = useRouter();

  console.log(
    Cookies.get("authToken"),
    Cookies.get("companyId"),
    Cookies.get("userType")
  );

  const loadData = async () => {
    try {
      setLoading(true);
      let url = `${getBmrmBaseUrl()}/info/user-tenant/get/companies`;
      let response = await getAsync(url);
      let values = response.map((entry: any) => {
        return {
          id: entry["company_id"],
          name: entry["company_name"],
          user_id: entry.user_id,
        };
      });
      setData(values);
      console.log(values);
      if (values && values.length > 0) {
        let existingCompany = Cookies.get("companyId");
        let exisitngIndex = values.findIndex(
          (entry: any) => entry.id === existingCompany
        );
        setCompanyId(0);
        let guid = values[0].id;
        if (exisitngIndex !== -1) {
          guid = values[exisitngIndex].id;
          setCompanyId(exisitngIndex);
        }
        Cookies.set("companyId", guid);
      }
    } catch (error) {
      setLoading(false);
      console.error("Failed to load companies", error);
    } finally {
      setLoading(false);
    }
  };

  const [userType, setUserType] = useState("");

  useEffect(() => {
    loadData().then((_) => {
      setUserType(Cookies.get("userType") ?? "");
      checkPermission();
    });
  }, []);

  let cmpId = Cookies.get("companyId");
  useEffect(() => {
    loadLastSync(cmpId);
  }, [cmpId]);

  const checkPermission = async () => {
    loadAmount();
    loadUpcoming();
  };

  const loadAmount = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/bill/get/outstanding-amount?groupType=${
        selectedType.current.code
      }`;
      let response = await getAsync(url);
      let amount = `${"₹"} ${numericToString(response)}`;
      setAmount(amount);
    } catch {
      alert("Coult not load amount");
    }
  };

  const loadLastSync = async (companyId: any) => {
    try {
      let url = `${getSgBizBaseUrl()}/sync-info/get`;
      url += `?companyId=${companyId}`;
      let response = await getAsync(url);
      // console.log("lastsync", JSON.stringify(response));
      const syncInfo = convertToDate(response.Data.SyncDateTime);
      setSyncInfo(syncInfo);
      return syncInfo;
    } catch (error) {
      console.error("Failed to load sync details:", error);
      alert("Could not load Sync Details");
    }
  };

  const loadUpcoming = async () => {
    try {
      let url = `${getBmrmBaseUrl()}/bill/get/upcoming-overview?groupType=${
        selectedType.current.code
      }&durationType=${selectedFilter.current.value}`;
      let response = await getAsync(url);
      let entries = response.map((entry: any) => {
        return {
          id: entry.id,
          name: entry.title,
          amount: entry.amount,
          // amount: `${entry.currency ?? "₹"} ${numericToString(entry.amount)}`,
          billCount: entry.billCount,
          currency: entry.currency ?? "₹",
        };
      });
      setRows(entries);
      return entries;
    } catch {
      alert("Could not load upcoming outstanding");
    }
  };

  const columns: GridColDef<any[number]>[] = [
    {
      field: "name",
      headerName: "Duration Name",
      editable: false,
      sortable: true,
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Value",
      editable: false,
      sortable: true,
      flex: 1,
      type: "number",
      // valueGetter: (value, row) => `${row.currency || ""} ${row.amount || "0"}`,
      // valueGetter: (value, row) =>
      //   `${row.currency || ""} ${numericToString(row.amount) || "0"}`,
      valueGetter: (value, row) => row.amount || "0",
    },
  ];

  const brokerGridConfig = [
    {
      weight: Weight.Medium,
      view: (
        <CardView title="Montly Overview">
          <BrokerMonthlyOverview companyId={data[cachedCompanyIndex]} />
        </CardView>
      ),
    },
  ];

  const views = [
    {
      weight: Weight.Medium,
      view: (
        <div className={`flex flex-col h-full`}>
          <CardView className="mb-2" title="Switch Company">
            <DropDown
              label={"Select Company"}
              displayFieldKey={"name"}
              valueFieldKey={null}
              selectionValues={data}
              helperText={""}
              defaultSelectionIndex={cachedCompanyIndex}
              onSelection={(selection) => {
                const companyId = selection.id;
                let exisitngIndex = data.findIndex(
                  (entry: any) => entry.id === companyId
                );
                if (exisitngIndex != -1) {
                  setCompanyId(exisitngIndex);
                  Cookies.set("companyId", companyId);
                  loadLastSync(companyId).catch(() => {
                    // Handle any errors silently, keeping the previous sync info
                  });
                }
              }}
            />

            <br></br>

            <Typography className="text-base mb-8 justify-center">
              {`${"Last Sync"} ${syncInfo}`}
            </Typography>
          </CardView>
          {loading ? (
            <Loading />
          ) : (
            <CardView
              className="mt-2"
              style={{
                backgroundColor: loading
                  ? "#FFFFFF"
                  : theme.palette.primary.main,
              }}
              permissionCode="CustomerCard"
            >
              <CustomerDetailsCard companyId={data[cachedCompanyIndex]} />
            </CardView>
          )}
        </div>
      ),
    },
    {
      weight: Weight.Medium,
      view: (
        <CardView
          title={"Payable vs Receivable"}
          permissionCode="OutstandingCard"
        >
          <OutstandingCard
            companyId={data[cachedCompanyIndex]}
            title="Outstanding Overview"
          />
        </CardView>
      ),
    },
    {
      weight: Weight.Medium,
      view: (
        <CardView title={"Aging Wise"} permissionCode="AgingOutstandingCard">
          <AgingView
            billType={selectedType.current.code}
            companyId={data[cachedCompanyIndex]}
            title="Aging-Wise O/S"
          />
        </CardView>
      ),
    },
    {
      weight: Weight.High,
      view: (
        <CardView title="Today's O/S">
          <OutstandingTask companyId={data[cachedCompanyIndex]} />
        </CardView>
      ),
    },
    {
      weight: Weight.High,
      view: (
        <CardView title="Ranked Parties">
          <RankedPartyOutstandingCard
            companyId={data[cachedCompanyIndex]}
            billType={selectedType.current.code}
          />
        </CardView>
      ),
    },
    {
      weight: Weight.High,
      view: (
        <CardView title="Upcoming Collections" className="overflow-scroll">
          {/* <Container className="flex overflow-x-auto"> */}
          <Stack
            flexDirection="row"
            gap={1}
            pb={1}
            sx={{ overflowX: "scroll" }}
          >
            {filters.map((card, index) => (
              <Box
                key={index}
                className="rounded-3xl"
                sx={{
                  minWidth: 100,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 40,
                  background: card.isSelected
                    ? theme.palette.primary.main
                    : inspiredPalette.lightTextGrey,
                  color: card.isSelected
                    ? theme.palette.primary.contrastText
                    : inspiredPalette.dark,
                  cursor: "pointer",
                }}
                onClick={(event) => {
                  let values: any[] = filters;
                  values = values.map((entry: any) => {
                    let isSelected = card.value === entry.value;
                    entry.isSelected = isSelected;
                    return entry;
                  });
                  updateFilters(values);
                  selectedFilter.current = card;
                  loadUpcoming();
                  // triggerRefresh(!refresh);
                }}
              >
                <Typography
                  component="div"
                  className="flex h-full w-full flex-row justify-center items-center"
                >
                  {card.label}
                </Typography>
              </Box>
            ))}
          </Stack>
          {/* </Container> */}
          <br />
          {/* <DataTable
            columns={columns}
            refresh={refresh}
            useSearch={false}
            useServerPagination={false}
            onApi={async (page, pageSize, searchText) => {
              return loadUpcoming();
            }}
            onRowClick={(params) => {
              localStorage.setItem("party_filter_value", params.row.id);
              localStorage.setItem("party_view_type", "upcoming");
              localStorage.setItem(
                "party_bill_type",
                selectedType.current.code
              );
              localStorage.setItem(
                "party_filter_type",
                selectedFilter.current.value
              );
            }}
          /> */}
          <PeriodicTable
            chartKeyFields={[
              {
                label: "Duration",
                value: "name",
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
              };
              return column;
            })}
            // onApi={loadUpcoming}
            rows={rows}
            reload={refresh}
          />
          {/* <DataGrid
            columns={columns}
            rows={rows}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            onRowClick={(params) => {
              localStorage.setItem("party_filter_value", params.row.id);
              localStorage.setItem("party_view_type", "upcoming");
              localStorage.setItem(
                "party_bill_type",
                selectedType.current.code
              );
              localStorage.setItem(
                "party_filter_type",
                selectedFilter.current.value
              );
            }}
            pageSizeOptions={[5, 10, 25, 50, 75, 100]}
            disableRowSelectionOnClick
            onPaginationModelChange={(value) => {
              alert(`page model:  ${JSON.stringify(value)}`);
            }}
          /> */}
        </CardView>
      ),
    },
    // {
    //   weight: Weight.High,
    //   view: (
    //     <CardView title="Data Grid">
    //       <PeriodicTable cColumn={CC} data={dummyData} />
    //     </CardView>
    //   ),
    // },
  ];

  return (
    <div>
      <DynGrid views={views} />
    </div>
  );
};

export default DashboardPage;
