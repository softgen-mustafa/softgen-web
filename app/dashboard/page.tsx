// "use client";
// import { CustomerDetailsCard } from "./cards/customer_card";
// import { Grid, Typography } from "@mui/material";
// import { OutstandingCard } from "./cards/outstanding_card";
// import { SalesReportCard } from "./cards/sales_report_card";
// import { InventoryCard } from "./cards/inventory_card";
// import { OutstandingTask } from "./cards/outstanding_task_card";
// import { CardView, GridConfig, RenderGrid } from "../ui/responsive_grid";
// import { DropDown } from "../ui/drop_down";
// import { getAsync, getBmrmBaseUrl } from "../services/rest_services";
// import { useEffect, useRef, useState } from "react";
// import Cookies from "js-cookie";
// import { inspiredPalette } from "../ui/theme";

// const CompanyCard = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     loadData();
//   }, []);

//   const loadData = async () => {
//     try {
//       let url = `${getBmrmBaseUrl()}/info/user-tenant/get/companies`;
//       let response = await getAsync(url);
//       let values = response.map((entry: any) => {
//         return {
//           id: entry["company_id"],
//           name: entry["company_name"],
//           user_id: entry.user_id,
//         };
//       });
//       setData(values);
//       if (values && values.length > 0) {
//         Cookies.set("companyId", values[0].id);
//       }
//     } catch {}
//   };

//   return (
//     <div>
//       <DropDown
//         label={"Select Company"}
//         displayFieldKey={"name"}
//         valueFieldKey={null}
//         selectionValues={data}
//         helperText={""}
//         onSelection={(selection) => {
//           Cookies.set("companyId", selection.id);
//         }}
//       />
//     </div>
//   );
// };

// const DashboardPage = () => {
//   const gridConfig: GridConfig[] = [
//     {
//       type: "item",
//       view: (
//         <CardView title="Overview">
//           <CompanyCard />
//           <CustomerDetailsCard></CustomerDetailsCard>
//         </CardView>
//       ),
//       className: "",
//       children: [],
//     },
//     {
//       type: "item",
//       view: (
//         <CardView title="Outstanding Overview">
//           <OutstandingCard  />
//         </CardView>
//       ),
//       className: "",
//       children: [],
//     },
//     {
//       type: "item",
//       view: (
//         <CardView title="Inventory">
//           <InventoryCard />
//         </CardView>
//       ),
//       className: "",
//       children: [],
//     },
//     {
//       type: "item",
//       view: (
//         <CardView title="Today's O/S">
//           <OutstandingTask />
//         </CardView>
//       ),
//       className: "",
//       children: [],
//     },
//   ];
//   return (
//     <div className="">
//       <Typography
//         className="mt-14 ml-2 text-3xl mb-2 font-medium"
//         style={{ color: inspiredPalette.dark }}
//       >
//         Dashboard
//       </Typography>
//       <Grid
//         container
//         sx={{
//           flexGrow: 1,
//           height: "100vh",
//         }}
//       >
//         {RenderGrid(gridConfig)}
//       </Grid>
//     </div>
//   );
// };
// export default DashboardPage;

"use client";
import { CustomerDetailsCard } from "./cards/customer_card";
import { Box, Grid, Stack, Typography, useTheme } from "@mui/material";
import { OutstandingCard } from "./cards/outstanding_card";
import { InventoryCard } from "./cards/inventory_card";
import { OutstandingTask } from "./cards/outstanding_task_card";
import { CardView, GridConfig, RenderGrid } from "../ui/responsive_grid";
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

// const CompanyCard = ({
//   onCompanyChange,
// }: {
//   onCompanyChange: (companyId: string) => void;
// }) => {
//   const [data, setData] = useState([]);

//   // useEffect(() => {
//   //   loadData();
//   // }, []);

//   // const loadData = async () => {
//   //   try {
//   //     let url = `${getBmrmBaseUrl()}/info/user-tenant/get/companies`;
//   //     let response = await getAsync(url);
//   //     let values = response.map((entry: any) => {
//   //       return {
//   //         id: entry["company_id"],
//   //         name: entry["company_name"],
//   //         user_id: entry.user_id,
//   //       };
//   //     });
//   //     setData(values);
//   //     if (values && values.length > 0) {
//   //       const firstCompanyId = values[0].id;
//   //       Cookies.set("companyId", firstCompanyId);
//   //       onCompanyChange(firstCompanyId);
//   //     }
//   //   } catch (error) {
//   //     console.error("Failed to load companies", error);
//   //   }
//   // };

//   return (
//     <div>
//       {/* <DropDown
//         label={"Select Company"}
//         displayFieldKey={"name"}
//         valueFieldKey={null}
//         selectionValues={data}
//         helperText={""}
//         onSelection={(selection) => {
//           const companyId = selection.id;
//           Cookies.set("companyId", companyId);
//           onCompanyChange(companyId);
//         }}
//       /> */}
//     </div>
//   );
// };

const DashboardPage = () => {
  // const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
  //   null
  // );
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
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

  const [totalAmount, setAmount] = useState("0");
  const [rows, setRows] = useState([]);

  const theme = useTheme();
  const router = useRouter();

  const selectedCompanyId = Cookies.get("companyId") ?? null;
  // useEffect(() => {
  //   if (selectedCompanyId) {
  //     // Logic when the company ID changes
  //     console.log(`Company ID changed to: ${selectedCompanyId}`);
  //   }
  // }, [selectedCompanyId]);

  // const handleCompanyChange = (companyId: string) => {
  //   setSelectedCompanyId(companyId);
  // };

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const permission = await FeatureControl("OutstandingDashboardScreen");
    setHasPermission(permission);
    if (permission) {
      loadAmount();
      loadUpcoming();
    }
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

  const gridConfig: GridConfig[] = [
    {
      type: "item",
      view: (
        <CardView title="Today's O/S">
          <OutstandingTask companyId={selectedCompanyId} />
        </CardView>
      ),
      className: "",
      children: [],
    },
    {
      type: "container",
      view: null,
      className: "",
      children: [
        {
          type: "item",
          view: (
            <CardView>
              <OutstandingCard
                companyId={selectedCompanyId}
                title="Outstanding Overview"
              />
            </CardView>
          ),
          className: "",
          children: [],
        },
        {
          type: "item",
          view: (
            <CardView>
              <AgingView
                billType={selectedType.current.code}
                title="Aging-Wise O/S"
              />
            </CardView>
          ),
          className: "",
          children: [],
        },
        {
          type: "item",
          view: (
            <CardView className="bg-red-500">
              <CustomerDetailsCard companyId={selectedCompanyId} />
            </CardView>
          ),
          className: "",
          children: [],
        },
      ],
    },
    // {
    //   type: "item",
    //   view: (
    //     <CardView title="Inventory">
    //       <InventoryCard companyId={selectedCompanyId} />
    //     </CardView>
    //   ),
    //   className: "",
    //   children: [],
    // },
    {
      type: "container",
      view: null,
      className: "",
      children: [
        {
          type: "item",
          view: (
            <CardView title="Ranked Parties">
              <RankedPartyOutstandingCard
                billType={selectedType.current.code}
              />
            </CardView>
          ),
          className: "",
          children: [],
        },
      ],
    },
    {
      type: "item",
      view: (
        <CardView title="Upcoming Collections">
          {/* <Container className="flex overflow-x-auto"> */}
          <Stack flexDirection="row">
            {filters.map((card, index) => (
              <Box
                key={index}
                className=" mr-4 rounded-3xl"
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
      className: "",
      children: [],
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
      <Grid
        container
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

export default DashboardPage;
