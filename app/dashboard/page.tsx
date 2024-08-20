"use client";
import { CustomerDetailsCard } from "./cards/customer_card";
import { Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import { OutstandingCard } from "./cards/outstanding_card";
import { InventoryCard } from "./cards/inventory_card";
import { OutstandingTask } from "./cards/outstanding_task_card";
import { CardView, GridConfig, RenderGrid, Weight, DynGrid } from "../ui/responsive_grid";
import { DropDown } from "../ui/drop_down";
import { getAsync, getBmrmBaseUrl } from "../services/rest_services";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import { inspiredPalette } from "../ui/theme";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { numericToString } from "../services/Local/helper";
import { useRouter } from "next/navigation";
import { FeatureControl } from "../components/featurepermission/permission_helper";
import RankedPartyOutstandingCard from "./cards/ranked_party";
import { AgingView } from "./cards/aging_card";
import { DataTable } from "@/app/ui/data_grid";
import { SingleChartView } from "@/app/ui/graph_util";

const BrokerMonthlyOverview = () => {

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
            valueGetter: (value, row) =>
            `${numericToString(row.commission) || "0"}`,
        },
    ];

    const onApi = async () => {
        try {
            let url = `${getBmrmBaseUrl()}/broker-sales/get/broker/monthly-sales?monthYear=all`;
            let response = await getAsync(url);
            let entries = response.map((entry: any, index: number) => {
                return {
                    id: index + 1,
                    ...entry
                };
            })
            return entries ?? [];

        } catch {
            return [];
        }
    }

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
            onRowClick={(params) => {
            }}
            />
        </Box>
    );
}

const DashboardPage = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [filters, updateFilters] = useState([
    { id: 1, label: "Daily", value: "daily", isSelected: true },
    { id: 2, label: "Weekly", value: "weekly", isSelected: false },
    { id: 3, label: "Montly", value: "monthly", isSelected: false },
    { id: 4, label: "Quarterly", value: "quarterly", isSelected: false },
    { id: 5, label: "Yearly", value: "yearly", isSelected: false },
  ]);

  let companyId = useRef<string | null>(null);

  let incomingBillType = "Receivable"; // populate later
  const [types, updateTypes] = useState([
    { id: 1, label: "Receivable", code: "receivable" },
    { id: 2, label: "Payable", code: "payable" },
  ]);

  let selectedType = useRef(types[incomingBillType === "Payable" ? 1 : 0]);
  let selectedFilter = useRef(filters[0]);

  const [totalAmount, setAmount] = useState("0");
  const [rows, setRows] = useState([]);

  const theme = useTheme();
  const router = useRouter();

  const loadData = async () => {
      try {
          let url = `${getBmrmBaseUrl()}/info/user-tenant/get/companies`;
          let response = await getAsync(url);
          let values = response.map((entry: any) => {
              return {
                  id: entry["company_id"],
                  name: entry["company_name"],
                  user_id: entry.user_id,
              };
          });
          if (values && values.length > 0) {
              let cookieCompany = Cookies.get("companyId") ?? null;
              if (cookieCompany === null || cookieCompany.length < 1) {
                cookieCompany = values[0].id;
              }
              companyId.current = cookieCompany;
              Cookies.set("companyId", cookieCompany!);
          }
      } catch (error) {
          console.error("Failed to load companies", error);
      }
  };

  const selectedCompanyId = Cookies.get("companyId") ?? null;

  const [userType, setUserType] = useState("");

  useEffect(() => {
      setUserType(Cookies.get("userType")??"");
      if (companyId.current === null || companyId.current.length < 1) 
      {
          loadData();
      }
    checkPermission();
  }, []);

  const checkPermission = async () => {
    loadAmount();
    loadUpcoming();
    // }
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
          billCount: entry.billCount,
          currency: entry.currency ?? "₹",
        };
      });
      setRows(entries);
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
      valueGetter: (value, row) =>
        `${row.currency || ""} ${numericToString(row.amount) || "0"}`,
    },
  ];

  const brokerGridConfig: GridConfig[] = [
      {
          type: "item",
          view: (
              <CardView title="Montly Overview">
              <BrokerMonthlyOverview />
              </CardView>
          ),
          className: "",
          children: [],
      },
  ];
  const views = [
      {
          weight: Weight.Medium,
          view: (
              <CardView title="Today's O/S">
              <OutstandingTask companyId={selectedCompanyId} />
              </CardView>
          ),
      },
      {
          weight: Weight.Medium,
          view: (
              <CardView permissionCode="OutstandingCard">
              <OutstandingCard
              companyId={selectedCompanyId}
              title="Outstanding Overview"
              />
              </CardView>
          ),
      },
      {
          weight: Weight.Medium,
          view: (
              <CardView permissionCode="AgingOutstandingCard">
              <AgingView
              billType={selectedType.current.code}
              title="Aging-Wise O/S"
              />
              </CardView>
          ),
      },
      {
          weight: Weight.Low,
          view: (
              <CardView className="bg-red-500" permissionCode="CustomerCard">
              <CustomerDetailsCard companyId={selectedCompanyId} />
              </CardView>
          ),
      },
      {
          weight: Weight.High,
          view: (
              <CardView title="Ranked Parties">
              <RankedPartyOutstandingCard
              billType={selectedType.current.code}
              />
              </CardView>
          ),
      },
      {
          weight: Weight.High,
          view: (
              <CardView title="Upcoming Collections">
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
                          color: card.isSelected ? "white" : inspiredPalette.dark,
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
              <DataGrid
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
                  router.push("/dashboard/outstanding/party-search");
              }}
              pageSizeOptions={[5, 10, 25, 50, 75, 100]}
              disableRowSelectionOnClick
              onPaginationModelChange={(value) => {
                  alert(`page model:  ${JSON.stringify(value)}`);
              }}
              />
              </CardView>
          ),
      },
  ];


  return (
    <div className="">
      {/* <Typography
        className="mt-14 ml-2 text-3xl mb-2 font-medium"
        style={{ color: inspiredPalette.dark }}
      >
        Dashboard
      </Typography> */}
      <DynGrid views={views}/>
    </div>
  );
};

export default DashboardPage;
