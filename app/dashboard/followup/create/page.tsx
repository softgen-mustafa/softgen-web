"use client";
import {
  getAsync,
  getBmrmBaseUrl,
  getUmsBaseUrl,
  getSgBizBaseUrl,
} from "@/app/services/rest_services";
import { DropDown } from "@/app/ui/drop_down";
import { CardView, GridConfig, RenderGrid } from "@/app/ui/responsive_grid";
import { Box, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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
import { ApiDropDown } from "@/app/ui/api_drop_down";
import { convertToDate } from "@/app/services/Local/helper";

interface OsSettings {
  pocEmail: string;
  pocMobile: number;
  pocName: string;
  Notes: string;
  nextFollowup: string;
  nextDate: string;
}

const Page = () => {
  const router = useRouter();
  const initialDetails: OsSettings = {
    pocEmail: "",
    pocMobile: 0,
    pocName: "",
    Notes: "",
    nextFollowup: "",
    nextDate: "",
  };

  const [pocDetails, setPocDetails] = useState<OsSettings>(initialDetails);
  const [data, setData] = useState([]);
  const [refresh, triggerRefresh] = useState(false);
  const [refreshBills, triggerBillsRefresh] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  let selectedBills = useRef<string[]>([]);
  let selectedUser = useRef<string[]>([]);
  let selectedParty = useRef<string>("");
  const compId = Cookies.get("companyId");

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Bill Number",
      sortable: false,
      flex: 1,
    },

    {
      field: "PendingAmount",
      headerName: "Pending Balance",
      sortable: false,
      flex: 1,
    },
    {
      field: "OpeningAmount",
      headerName: "Opening Balance",
      sortable: false,
      flex: 1,
    },
    {
      field: "BillDate",
      headerName: "Bill Date",
      sortable: false,
      flex: 1,
    },
    {
      field: "DueDate",
      headerName: "Due Date",
      sortable: false,
      flex: 1,
    },
  ];

  useEffect(() => {
    loadParties("");
    loadBills("");
  }, []);

  const loadParties = async (searchValue: string) => {
    let values = [{ name: "None" }];
    try {
      let url = `${getSgBizBaseUrl()}/os/search/ledgers?searchKey=${searchValue}`;
      let response = await getAsync(url);
      if (response == null || response.Data == null) {
        return [];
      }
      response.Data.map((entry: any) => {
        values.push({
          name: entry.Name,
        });
      });
      triggerRefresh(false);
      return values;
    } catch {
      return [];
    }
  };

  const loadBills = async (searchValue: string) => {
    try {
      let url = `${getSgBizBaseUrl()}/os/get/bills?searchText=${searchValue}&partyName=${
        selectedParty.current
      }`;
      let response = await getAsync(url);
      if (response == null || response.Data == null) {
        return [];
      }
      let values = response.Data.map((entry: any) => {
        return {
          name: entry.BillNumber,
          PartyName: entry.PartyName,
          ParentGroup: entry.ParentGroup,
          PendingAmount: entry.PendingAmount,
          OpeningAmount: entry.OpeningAmount.Value,
          BillDate: convertToDate(entry.BillDate),
          DueDate: convertToDate(entry.DueDate),
        };
      });
      return values;
    } catch {
      triggerRefresh(false);
      return [];
    }
  };

  const loadUser = async () => {
    try {
      let url = `${getSgBizBaseUrl()}/party/get/contact-person?partyName=${
        selectedParty.current
      }`;

      let response = await getAsync(url);
      if (response && response.length > 0) {
        let values = response.Data.map((entry: any) => {
          return {
            PersonId: entry.PersonId,
            Name: entry.Name,
            PartyName: entry.PartyName,
            pocEmail: entry.Email,
            pocMobile: entry.PhoneNo,
          };
        });
        return values;
      }
    } catch {
      console.log("Something went wrong...");
    } finally {
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
            <ApiDropDown
              label="Party"
              displayFieldKey={"name"}
              valueFieldKey={null}
              onApi={loadParties}
              helperText={""}
              onSelection={(selection) => {
                selectedParty.current = selection.name;
                loadParties("");
                triggerBillsRefresh(!refreshBills);
                triggerRefresh(!refresh);
              }}
            />

            <br></br>
            <ApiMultiDropDown
              reload={refreshBills}
              label="Bills"
              displayFieldKey={"name"}
              defaultSelections={selectedBills.current}
              valueFieldKey={null}
              onApi={loadBills}
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
                setPocDetails((prev) => ({ ...prev, pocName: data }));
                selectedUser.current = data.Name;
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
        <CardView title="Status Table">
          <PeriodicTable
            useSearch={true}
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
            rows={selectedBills.current}
            // onApi={loadBills}
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
            actionViews={[
              {
                label: "Status",
                renderView: (row: any[]) => {
                  let BillNumber = row.find(
                    (entry: any) => entry.field === "BillNumber"
                  );
                  let selected = row.find(
                    (entry: any) => entry.field === "selected"
                  );
                  let statusOptions = [
                    { id: 0, name: "Pending" },
                    { id: 1, name: "Scheduled" },
                    { id: 2, name: "Completed" },
                  ];
                  return (
                    <Box sx={{ minWidth: 120, maxWidth: "100%" }}>
                      {" "}
                      <DropDown
                        label="Status"
                        displayFieldKey="name"
                        valueFieldKey="id"
                        selectionValues={statusOptions}
                        onSelection={(selection) => {
                          console.log(
                            `Status for BillNumber ${BillNumber.value} changed to ${selection.id}`
                          );
                        }}
                        helperText="Select status"
                      />
                    </Box>
                  );
                },
              },
            ]}
          />
        </CardView>
      ),
      children: [],
    },
    {
      type: "item",
      className: "",
      view: (
        <CardView title="History Table">
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
            // rows={datanew}
          />
        </CardView>
      ),
      children: [],
    },
  ];
  return (
    <Box>
      <Grid
        container
        sx={{
          flexGrow: 1,
          height: "100vh",
        }}
      >
        {RenderGrid(gridConfig)}
      </Grid>
    </Box>
  );
};
export default Page;
