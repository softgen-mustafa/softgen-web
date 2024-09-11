"use client";
import {
  getAsync,
  getBmrmBaseUrl,
  getUmsBaseUrl,
} from "@/app/services/rest_services";
import { DropDown } from "@/app/ui/drop_down";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSnackbar } from "@/app/ui/snack_bar_provider";
import Cookies from "js-cookie";
import ApiAutoComplete from "@/app/ui/api_auto_complete";
import { ApiMultiDropDown } from "@/app/ui/api_multi_select";
import { TextInput } from "@/app/ui/text_inputs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  PeriodicTable,
  TableColumn,
} from "@/app/ui/periodic_table/period_table";
import { GridColDef } from "@mui/x-data-grid";

interface OsSettings {
  pocEmail: string;
  pocMobile: number;
  Notes: string;
  nextFollowup: string;
  nextDate: string;
}

const Page = () => {
  const router = useRouter();
  const initialDetails: OsSettings = {
    pocEmail: "",
    pocMobile: 0,
    Notes: "",
    nextFollowup: "",
    nextDate: "",
  };

  const [voucherTypes, setVoucherTypes] = useState([]);
  const [pocDetails, setPocDetails] = useState<OsSettings>(initialDetails);
  const [selectedVoucherType, setVoucherType] = useState("Sales");
  const [data, setData] = useState([]);
  const [refresh, triggerRefresh] = useState(false);
  const [refreshBills, triggerBillsRefresh] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  let selectedBills = useRef<string[]>([]);

  let selectedUser = useRef(null);

  const compId = Cookies.get("companyId");

  const datanew = [
    {
      Party: "John Doe",
      TotalBills: 12,
      TotalFollowUpCount: 3,
      LastPersonInCharge: "Alice Smith",
      Amount: 1500.75,
    },
    {
      Party: "Jane Smith",
      TotalBills: 8,
      TotalFollowUpCount: 2,
      LastPersonInCharge: "Bob Johnson",
      Amount: 980.5,
    },
    {
      Party: "Acme Corp",
      TotalBills: 20,
      TotalFollowUpCount: 5,
      LastPersonInCharge: "Carol White",
      Amount: 3020.1,
    },
    {
      Party: "Global Inc.",
      TotalBills: 15,
      TotalFollowUpCount: 4,
      LastPersonInCharge: "David Brown",
      Amount: 2125.25,
    },
    {
      Party: "Tech Solutions",
      TotalBills: 9,
      TotalFollowUpCount: 1,
      LastPersonInCharge: "Eve Davis",
      Amount: 1250.0,
    },
  ];
  const columns: GridColDef<any[number]>[] = [
    {
      field: "Party",
      headerName: "Bill Number",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "TotalBills",
      headerName: "Opening Balance",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "TotalFollowUpCount",
      headerName: "Pending Balance",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "LastPersonInCharge",
      headerName: "Bill Date",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
    {
      field: "Amount",
      headerName: "Due Date",
      editable: false,
      sortable: false,
      hideable: false,
      flex: 1,
    },
  ];

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
      return response;
    } catch {
      showSnackbar("Could not load voucher types");
    }
  };

  const loadUser = async () => {
    try {
      if (compId) {
        const url = `${getUmsBaseUrl()}/users/company/${compId}`;
        let response = await getAsync(url);
        if (response && response.length > 0) {
          let values = response.map((entry: any) => ({
            id: entry.id,
            name: entry.name,
          }));
          selectedUser.current = response[0]?.id;
          setData(values);
          return values;
        }
      }
    } catch {
      console.log("Something went wrong...");
    }
  };

  const handleDateChange = (newDate: dayjs.Dayjs | null) => {
    if (newDate) {
      setSelectedDate(newDate);
      setPocDetails((prev) => ({
        ...prev,
        nextDate: newDate.format("DD-MM-YYYY"),
      }));
    }
  };

  const gridConfig: GridConfig[] = [
    {
      type: "item",
      className: "",
      view: (
        <CardView
          title={"Overview"}
          permissionCode="CustomerPartySearch"
          className="h-fit"
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DropDown
              label="Select Type"
              displayFieldKey={"name"}
              valueFieldKey={null}
              selectionValues={voucherTypes}
              helperText={"Select Party"}
              onSelection={(selection) => {
                setVoucherType(selection.name);
              }}
              useSearch={true}
            />

            <br></br>
            <ApiMultiDropDown
              reload={refreshBills}
              label="Bills"
              displayFieldKey={"name"}
              defaultSelections={selectedBills.current}
              valueFieldKey={null}
              onApi={loadVoucherTypes}
              helperText={""}
              onSelection={(selection) => {
                selectedBills.current = selection;
                triggerRefresh(!refresh);
              }}
            />
            <br></br>
            <ApiAutoComplete
              label="Select User"
              displayFieldKey={"name"}
              onApi={loadUser}
              onSelection={(data) => {
                selectedUser.current = data;
                triggerRefresh(!refresh);
              }}
            />
            <br></br>
            <TextInput
              mode="text"
              placeHolder="Email"
              onTextChange={(value) => {
                setPocDetails((prev) => ({ ...prev, pocEmail: value }));
              }}
              defaultValue={pocDetails.pocEmail}
            />
            <br></br>
            <TextInput
              mode="number"
              placeHolder="Mobile Number"
              onTextChange={(value) => {
                setPocDetails((prev) => ({
                  ...prev,
                  pocMobile: parseInt(value ?? "0"),
                }));
              }}
              defaultValue={pocDetails.pocMobile.toString()}
            />
            <br></br>
            <TextInput
              multiline={true}
              mode="text"
              placeHolder="Notes"
              onTextChange={(value) => {
                setPocDetails((prev) => ({ ...prev, Notes: value }));
              }}
              defaultValue={pocDetails.Notes}
            />
            <br></br>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={handleDateChange}
              format="DD-MM-YYYY"
              slots={{
                textField: (params) => (
                  <TextField
                    {...params}
                    helperText="Pick the next follow-up date"
                  />
                ),
              }}
            />
          </LocalizationProvider>
        </CardView>
      ),
      children: [],
    },
    {
      type: "item",
      className: "",
      view: (
        <CardView
          title="Status Table"
          // permissionCode="CustomerPartySearch"
        >
          <PeriodicTable
            useSearch={false}
            reload={refresh}
            columns={columns.map((col: any) => {
              let column: TableColumn = {
                header: col.headerName,
                field: col.field,
                type: "text",
                pinned: false,
                hideable: col.hideable,
                rows: [],
              };
              return column;
            })}
            rows={datanew}
            checkBoxSelection={true}
            renderCheckedView={(values: any) => {
              return (
                <div>
                  {values.map((entry: any, index: number) => {
                    return <div key={index}>{entry[0].value}</div>;
                  })}
                </div>
              );
            }}
          />
        </CardView>
      ),
      children: [],
    },
    {
      type: "item",
      className: "",
      view: (
        <CardView
          title="History Table"
          // permissionCode="CustomerPartySearch"
        >
          <PeriodicTable
            useSearch={false}
            reload={refresh}
            columns={columns.map((col: any) => {
              let column: TableColumn = {
                header: col.headerName,
                field: col.field,
                type: "text",
                pinned: false,
                hideable: col.hideable,
                rows: [],
              };
              return column;
            })}
            rows={datanew}
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
